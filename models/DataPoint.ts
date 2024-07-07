import Realm from 'realm';

export type DataPoint = {
	date: number;
	value: number
};

export type DataPoints = {
	value?: Realm.List<DataPoint>;
	return?: Realm.List<DataPoint>;
};

export type DataPointKey = keyof DataPoint;
export type DataPointValue<K extends DataPointKey> = DataPoint[K];

export const DataPointSchema = {
	name: 'DataPoint',
	embedded: true,
	properties: {
		date: 'double',
		value: 'double',
	}
};
