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

	private async init() {
		await this.client!.connect()

		if (!(await this.isCompatible())) {
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
		}

		await this.client!.end()
	}

	private async isCompatible(): Promise<Boolean> {
		return false
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
