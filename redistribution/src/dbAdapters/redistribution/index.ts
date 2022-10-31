import envGet from '@util/envGet'
import * as pg from 'pg'
import type { Shop, ShopCustomer, Customer } from './types'

class RedistributionDatabase {
	private client: pg.Client | undefined

	public Customer(dbClient: pg.Client = this.client!) {
		return {
			async insert(data: Customer[]) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async update(data: Customer[]) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async delete(key: string[]) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			}
		}
	}

	public Shop(dbClient: pg.Client = this.client!) {
		return {
			async insert(data: Shop[]) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async update(data: Shop[]) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async delete(key: string[]) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			}
		}
	}

	public Shopcustomer(dbClient: pg.Client = this.client!) {
		return {
			async insert(data: ShopCustomer[]) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async update(data: ShopCustomer[]) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			},

			async delete(data: ShopCustomer[]) {
				await dbClient.connect()
				await dbClient.query('')
				await dbClient.end()
			}
		}
	}

	private async init() {
		await this.client!.connect()

		await this.client!.query(`
			CREATE TABLE shop (
				token VARCHAR(255) NOT NULL PRIMARY KEY,
				calls INT NOT NULL DEFAULT 0,
				calls_max INT NOT NULL DEFAULT 10
			);

			CREATE TABLE customer (
				login VARCHAR(255) NOT NULL PRIMARY KEY,
				password VARCHAR(255) NOT NULL
			);

			CREATE TABLE shop_customer ( 
				shop_token VARCHAR(255) NOT NULL, 
				customer_login VARCHAR(255) NOT NULL, 
				query VARCHAR(255), 
				CONSTRAINT shop_customer_fk_customer FOREIGN KEY (customer_login) 
				REFERENCES customer (login) ON DELETE CASCADE ON UPDATE CASCADE, 
				CONSTRAINT shop_customer_fk_shop FOREIGN KEY (shop_token) 
				REFERENCES shop (token) ON DELETE CASCADE ON UPDATE CASCADE
			);

			CREATE TABLE shop_customer_rejected (
				shop_token VARCHAR(255) NOT NULL, 
				customer_login VARCHAR(255) NOT NULL, 
				query VARCHAR(255), 
				CONSTRAINT shop_customer_fk_customer FOREIGN KEY (customer_login) 
				REFERENCES customer (login) ON DELETE CASCADE ON UPDATE CASCADE, 
				CONSTRAINT shop_customer_fk_shop FOREIGN KEY (shop_token) 
				REFERENCES shop (token) ON DELETE CASCADE ON UPDATE CASCADE
			);
			
			CREATE OR REPLACE FUNCTION check_shop_calls(var_token shop_customer.shop_token%TYPE, var_login shop_customer.customer_login%TYPE, var_query shop_customer.query%TYPE )
			RETURNS boolean
			LANGUAGE plpgsql
			AS $$
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
						INSERT INTO shop_customer_rejected
						VALUES (var_token, var_login, var_query);
						RETURN false;
					END;
				END IF;
			END;
			$$;

			ALTER TABLE shop_customer 
			ADD CONSTRAINT shop_calls_increment_or_halt
			CHECK(check_shop_calls(token, login, query));
			`)

		await this.client!.end()
	}

	private async isCompatible(): Promise<Boolean> {
		return false
	}

	constructor() {
		const { dbHost, dbPort, dbName, dbUsername, dbPassword } = envGet(
			'dbHost',
			'dbPort',
			'dbName',
			'dbUsername',
			'dbPassword'
		)

		this.client = new pg.Client({
			host: dbHost,
			port: +dbPort,
			database: dbName,
			user: dbUsername,
			password: dbPassword
		})

		/*
        Check if tables exist
        init() if don't
         */
	}
}

export = new RedistributionDatabase()
