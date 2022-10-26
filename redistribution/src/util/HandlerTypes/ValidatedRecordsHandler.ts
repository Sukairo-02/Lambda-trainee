import type { SQSBatchResponse, SQSRecord, Handler } from 'aws-lambda'

type RecordsEvent<RecordType> = {
	Records?: RecordType[]
	FailRecords?: Partial<RecordType>[]
}

type ValidatedRecordsEvent<RecordType, UpdateWith> = RecordsEvent<Omit<RecordType, keyof UpdateWith> & UpdateWith>

export type ValidatedRecordsHandler<UpdateWith, RecordType = SQSRecord, Returns = SQSBatchResponse | void> = Handler<
	ValidatedRecordsEvent<RecordType, UpdateWith>,
	Returns
>
