import envGet from '@util/envGet'
import * as pg from 'pg'
import Customer from './tables/Customer'
import Shop from './tables/Shop'
import ShopCustomer from './tables/ShopCustomer'

class RedistributionDatabase {
	private config = envGet('dbHost', 'dbPort', 'dbName', 'dbUsername', 'dbPassword')

	private client: pg.Client = new pg.Client({
		host: this.config.dbHost,
		port: +this.config.dbPort,
		database: this.config.dbName,
		user: this.config.dbUsername,
		password: this.config.dbPassword
	})

	public Customer = Customer(this.client!)

	public Shop = Shop(this.client)

	public ShopCustomer = ShopCustomer(this.client)

	public async init() {
		await this.client.connect()
		await this.client.query(`
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
				shop_token TEXT NOT NULL, 
				customer_login TEXT NOT NULL, 
				query TEXT, 
				CONSTRAINT shop_customer_fk_customer FOREIGN KEY (customer_login) 
				REFERENCES customer (login) ON DELETE CASCADE ON UPDATE CASCADE, 
				CONSTRAINT shop_customer_fk_shop FOREIGN KEY (shop_token) 
				REFERENCES shop (token) ON DELETE CASCADE ON UPDATE CASCADE
			);

			CREATE TABLE IF NOT EXISTS shop_limit ( 
				shop_token TEXT NOT NULL PRIMARY KEY REFERENCES shop (token)
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

			ALTER TABLE shop_customer 
			ADD CONSTRAINT shop_calls_increment_or_halt
			CHECK(check_shop_calls(token, login, query));

			CREATE OR REPLACE FUNCTION remove_limit_warning()
			RETURNS trigger
			LANGUAGE plpgsql
			AS $remove_limit_warning$
				IF OLD.calls >= OLD.calls_max AND NEW.calls_max > OLD.calls_max THEN
				BEGIN
					DELETE FROM shop_limit
					WHERE shop_token = NEW.token
				END;
				END IF;
				RETURN NEW;
			$remove_limit_warning$;
			
			CREATE OR REPLACE TRIGGER remove_limit_warning BEFORE UPDATE ON shop
			FOR EACH ROW EXECUTE PROCEDURE remove_limit_warning();
			`)

		await this.client.end()
	}

	constructor() {
		// Need client immediately, constructor emptied
		// const { dbHost, dbPort, dbName, dbUsername, dbPassword } = envGet(
		// 	'dbHost',
		// 	'dbPort',
		// 	'dbName',
		// 	'dbUsername',
		// 	'dbPassword'
		// )
		// this.client = new pg.Client({
		// 	host: dbHost,
		// 	port: +dbPort,
		// 	database: dbName,
		// 	user: dbUsername,
		// 	password: dbPassword
		// })
	}
}

export = new RedistributionDatabase()
