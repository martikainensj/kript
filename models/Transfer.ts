import Realm from 'realm';

export type Transfer = {
  amount: number;
  date: number;
  notes?: string;
  owner_id: string;
	account_id: Realm.BSON.ObjectID;
	holding_name?: string;
	isValid?: () => boolean;
};

export const TransferSchema = {
  name: 'Transfer',
	embedded: true,
  properties: {
    amount: 'double',
    date: 'double',
    notes: 'string?',
    owner_id: 'string',
		account_id: 'objectId',
		holding_name: 'string?',
  }
};
