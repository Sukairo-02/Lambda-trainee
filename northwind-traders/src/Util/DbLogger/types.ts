import { AnyPgTable, SelectResultFields, PgSelectFields, GetTableConfig } from 'drizzle-orm-pg'
import { PgDelete, PgInsert, PgSelect, PgUpdate } from 'drizzle-orm-pg/queries'

export type dbOperation =
	| PgInsert<AnyPgTable, SelectResultFields<PgSelectFields<GetTableConfig<AnyPgTable, 'name'>>>>
	| PgSelect<AnyPgTable, SelectResultFields<PgSelectFields<GetTableConfig<AnyPgTable, 'name'>>>>
	| PgUpdate<AnyPgTable, SelectResultFields<PgSelectFields<GetTableConfig<AnyPgTable, 'name'>>>>
	| PgDelete<AnyPgTable, SelectResultFields<PgSelectFields<GetTableConfig<AnyPgTable, 'name'>>>>
