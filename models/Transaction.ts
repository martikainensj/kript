import Realm from 'realm';

export type Transaction = {
	_id: Realm.BSON.UUID;
  amount: number;
  date: number;
  notes?: string;
  owner_id: string;
  price: number;
  total: number;
	account_id: Realm.BSON.UUID;
	holding_name: string;
	holding_id?: Realm.BSON.UUID;
	isValid?: () => boolean;
};

export const TransactionSchema = {
  name: 'Transaction',
	embedded: true,
  properties: {
		_id: 'uuid',
    amount: 'double',
    date: 'double',
    notes: 'string?',
    owner_id: 'string',
    price: 'double',
    total: 'double',
		account_id: 'uuid',
		holding_name: 'string',
		holding_id: 'uuid?',
  }
};
