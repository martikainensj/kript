import Realm from "realm";
import { Transaction } from "./Transaction";

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
	dividendSum?: number;
	fees?: number;
	averagePrice?: number;
	averageValue?: number;
	value?: number;
	returnValue?: number;
	returnPercentage?: number;
	checksum?: string;
};

export type HoldingKey = keyof Holding;
export type HoldingValue<K extends HoldingKey> = Holding[K];

export const HoldingSchema = {
	name: 'Holding',
	embedded: true,
	properties: {
		_id: 'uuid',
		name: 'string',
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
		checksum: 'string?',
	}
};
