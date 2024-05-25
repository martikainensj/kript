import Realm from 'realm';

export type Transfer = {
	_id: Realm.BSON.UUID;
  amount: number;
  date: number;
  notes?: string;
  owner_id: string;
	account_id: Realm.BSON.UUID;
	holding_id?: Realm.BSON.UUID;
	holding_name?: string;
	isValid?: () => boolean;
};

export const TransferSchema = {
  name: 'Transfer',
	embedded: true,
  properties: {
		_id: 'uuid',
    amount: 'double',
    date: 'double',
    notes: 'string?',
    owner_id: 'string',
		account_id: 'uuid',
		holding_id: 'uuid?',
		holding_name: 'string?',
  }
};
