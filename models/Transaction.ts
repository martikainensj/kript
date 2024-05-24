import Realm from 'realm';

export type Transaction = {
  amount: number;
  date: number;
  notes?: string;
  owner_id: string;
  price: number;
  total: number;
	holding_name: string;
	isValid?: () => boolean;
};

export const TransactionSchema = {
  name: 'Transaction',
	embedded: true,
  properties: {
    amount: 'double',
    date: 'double',
    notes: 'string?',
    owner_id: 'string',
    price: 'double',
    total: 'double',
		holding_name: 'string',
  }
};
