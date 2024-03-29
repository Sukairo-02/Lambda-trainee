import envGet from '@util/envGet'
import Customer from './tables/Customer'
import Shop from './tables/Shop'
import ShopCustomer from './tables/ShopCustomer'
import { Pool, PoolClient } from 'pg'

class RedistributionDatabase {
	private config = envGet('dbHost', 'dbPort', 'dbName', 'dbUsername', 'dbPassword')

	private conPool = new Pool({
		host: this.config.dbHost,
		port: +this.config.dbPort,
		database: this.config.dbName,
		user: this.config.dbUsername,
		password: this.config.dbPassword,
		connectionTimeoutMillis: 4000,
		query_timeout: 4000
	})

	private tables(dbClient: PoolClient) {
		return {
			Customer: Customer(dbClient),

			Shop: Shop(dbClient),

			ShopCustomer: ShopCustomer(dbClient),

			async end() {
				await dbClient.release()
			}
		}
	}

	public async init() {
		const poolClient = await this.conPool.connect()

		if (
			!(
				await poolClient.query(`
				SELECT EXISTS (
				SELECT 1
				FROM   information_schema.tables 
				WHERE  table_schema = 'public'
				AND    table_name = 'shop_customer'
				)`)
			).rows[0].exists
		) {
			await poolClient.query(`
				CREATE TABLE IF NOT EXISTS shop (
					token TEXT NOT NULL PRIMARY KEY,
					calls INT NOT NULL DEFAULT 0,
					calls_max INT NOT NULL DEFAULT 10
				);
	
				CREATE TABLE IF NOT EXISTS customer (
					login TEXT NOT NULL PRIMARY KEY,
					password TEXT NOT NULL
				);
	
				CREATE TABLE IF NOT EXISTS shop_customer ( 
					id SERIAL,
					shop_token TEXT NOT NULL, 
					customer_login TEXT NOT NULL, 
					query TEXT, 
					CONSTRAINT shop_customer_fk_customer FOREIGN KEY (customer_login) 
					REFERENCES customer (login) ON DELETE CASCADE ON UPDATE CASCADE, 
					CONSTRAINT shop_customer_fk_shop FOREIGN KEY (shop_token) 
					REFERENCES shop (token) ON DELETE CASCADE ON UPDATE CASCADE
				);
	
				CREATE TABLE IF NOT EXISTS shop_limit ( 
					shop_token TEXT NOT NULL PRIMARY KEY 
					REFERENCES shop (token) ON DELETE CASCADE ON UPDATE CASCADE
				);
				
				CREATE OR REPLACE FUNCTION check_shop_calls(var_token shop_customer.shop_token%TYPE, var_login shop_customer.customer_login%TYPE, var_query shop_customer.query%TYPE )
				RETURNS boolean
				LANGUAGE plpgsql
				AS $check_shop_calls$
				DECLARE
					var_calls_max integer;
					var_calls integer;
				BEGIN
					SELECT calls, calls_max
					FROM shop 
					WHERE shop.token = var_token 
					INTO var_calls, var_calls_max;

					IF var_calls IS NULL OR var_calls_max IS NULL THEN
						RETURN false;
					END IF;
	
					IF var_calls < var_calls_max THEN
						BEGIN
							UPDATE shop
							SET calls = calls + 1
							WHERE token = var_token;
							RETURN true;
						END;
					ELSE
						BEGIN
							INSERT INTO shop_limit
							VALUES (var_token)
							ON CONFLICT DO NOTHING;
							RETURN false;
						END;
					END IF;
				END;
				$check_shop_calls$;
	
				CREATE FUNCTION remove_limit_warning()
				RETURNS trigger
				LANGUAGE plpgsql
				AS $remove_limit_warning$
				BEGIN
					IF NEW.calls_max > NEW.calls
					THEN
					BEGIN
						DELETE FROM shop_limit
						WHERE shop_token = NEW.token;
					END;
					END IF;
					RETURN NEW;
				END;
				$remove_limit_warning$;
				
				CREATE TRIGGER remove_limit_warning AFTER UPDATE ON shop
				FOR EACH ROW EXECUTE PROCEDURE remove_limit_warning();
				`)
		}

		return this.tables(poolClient)
	}

	public async end() {
		await this.conPool.end()
	}

	constructor() {}
}

export = new RedistributionDatabase()
