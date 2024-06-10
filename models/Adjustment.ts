import Realm from 'realm';

export type Adjustment = {
	_id: Realm.BSON.UUID;
	date: number;
	price: number;
	amount: number;
	holding_id: Realm.BSON.UUID;
	isValid?: () => boolean;
};

export const AdjustmentSchema = {
	name: 'Adjustment',
	embedded: true,
	properties: {
		_id: 'uuid',
		date: 'double',
		price: 'double',
		amount: 'double',
		holding_id: 'uuid',
	},
};