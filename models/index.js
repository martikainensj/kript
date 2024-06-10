import { AccountSchema } from './Account';
import { HoldingSchema } from './Holding';
import { TransactionSchema } from './Transaction';
import { TransferSchema } from './Transfer';
import { AdjustmentSchema } from './Adjustment';

export const Schemas = [
	AccountSchema,
	HoldingSchema,
	TransactionSchema,
	TransferSchema,
	AdjustmentSchema
];