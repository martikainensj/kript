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
  }
};
