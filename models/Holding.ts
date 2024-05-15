import Realm from "realm";
import { Transaction } from "./Transaction";

export type Holding = {
  name: string;
  notes?: string;
  owner_id: string;
	account_id: Realm.BSON.ObjectID;
  transactions?: Realm.List<Transaction>;
};

export const HoldingSchema = {
  name: 'Holding',
	embedded: true,
  properties: {
    name: 'string',
    notes: 'string?',
    owner_id: 'string',
		account_id: 'objectId',
    transactions: 'Transaction[]',
  }
};
