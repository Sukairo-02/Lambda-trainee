import { AnyPgTable, SelectResultFields, PgSelectFields, GetTableConfig } from 'drizzle-orm-pg'
import { PgDelete, PgInsert, PgSelect, PgUpdate } from 'drizzle-orm-pg/queries'
import { JoinType } from 'drizzle-orm-pg/queries/select.types'

type Insert = PgInsert<AnyPgTable, SelectResultFields<PgSelectFields<GetTableConfig<AnyPgTable, 'name'>>>>
type Select = PgSelect<AnyPgTable, SelectResultFields<PgSelectFields<GetTableConfig<AnyPgTable, 'name'>>>>
type Update = PgUpdate<AnyPgTable, SelectResultFields<PgSelectFields<GetTableConfig<AnyPgTable, 'name'>>>>
type Delete = PgDelete<AnyPgTable, SelectResultFields<PgSelectFields<GetTableConfig<AnyPgTable, 'name'>>>>
type AfterWhere<T extends Insert | Select | Update | Delete> = Omit<T, 'where' | `${JoinType}Join`>
type AfterFields<T extends Insert | Select | Update | Delete> = Omit<T, 'fields'>
export type DbOperation =
	| Insert
	| Select
	| Update
	| Delete
	| AfterWhere<Insert>
	| AfterWhere<Select>
	| AfterWhere<Update>
	| AfterWhere<Delete>
	| AfterFields<Insert>
	| AfterFields<Select>
	| AfterFields<Update>
	| AfterFields<Delete>
