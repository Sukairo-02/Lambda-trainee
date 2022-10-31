import type { SQSBatchResponse, SQSRecord, Handler } from 'aws-lambda'

type ValidatedRecordsEvent<RecordType, UpdateWith> = {
	Records?: (Omit<RecordType, keyof UpdateWith> & UpdateWith)[]
	FailRecords?: (Omit<RecordType, keyof UpdateWith> & Partial<UpdateWith>)[]
}

export type ValidatedRecordsHandler<UpdateWith, RecordType = SQSRecord, Returns = SQSBatchResponse | void> = Handler<
	ValidatedRecordsEvent<RecordType, UpdateWith>,
	Returns
>
