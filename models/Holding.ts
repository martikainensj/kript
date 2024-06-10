import Realm from "realm";
import { Transaction } from "./Transaction";
import { Adjustment } from "./Adjustment";

export type Holding = {
	_id: Realm.BSON.UUID;
  name: string;
  notes?: string;
  owner_id: string;
	account_id: Realm.BSON.UUID;
  transactions?: Realm.List<Transaction>;
  adjustments?: Realm.List<Adjustment>;
	isValid?: () => boolean;
};

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
    adjustments: 'Adjustment[]',
  }
};
