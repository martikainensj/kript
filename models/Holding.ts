import Realm from "realm";
import { Transaction } from "./Transaction";
import { DataPoint } from "./DataPoint";

export type Holding = {
	_id: Realm.BSON.UUID;
	name: string;
	notes?: string;
	owner_id: string;
	account_id: Realm.BSON.UUID;
	transactions?: Realm.List<Transaction>;
	isValid?: () => boolean;
	lastPrice?: number;
	amount?: number;
	transactionSum?: number;
	total?: number;
	dividendSum?: number; // TODO: remove at some point
	fees?: number;
	averagePrice?: number;
	averageValue?: number;
	value?: number;
	returnValue?: number;
	returnPercentage?: number;
	valueHistoryData?: DataPoint[];
	returnHistoryData?: DataPoint[];
	dividendHistoryData?: DataPoint[];
	feesHistoryData?: DataPoint[];
	checksum?: string;
};

export type HoldingKey = keyof Holding;
export type HoldingValue<K extends HoldingKey> = Holding[K];

export const HoldingSchema = {
	name: 'Holding',
	embedded: true,
	properties: {
		_id: { type: 'uuid', indexed: true },
		name: { type: 'string', indexed: true },
		notes: 'string?',
		owner_id: 'string',
		account_id: 'uuid',
		transactions: 'Transaction[]',
		lastPrice: 'double?',
		amount: 'double?',
		transactionSum: 'double?',
		total: 'double?',
		dividendSum: 'double?',
		fees: 'double?',
		averagePrice: 'double?',
		averageValue: 'double?',
		value: 'double?',
		returnValue: 'double?',
		returnPercentage: 'double?',
		valueHistoryData: 'DataPoint[]',
		returnHistoryData: 'DataPoint[]',
		dividendHistoryData: 'DataPoint[]',
		feesHistoryData: 'DataPoint[]',
		checksum: 'string?',
	}
};
