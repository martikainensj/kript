export type DataPoint = {
	date: number;
	value?: number
};

export type DataPointKey = keyof DataPoint;
export type DataPointValue<K extends DataPointKey> = DataPoint[K];

export const DataPointSchema = {
	name: 'DataPoint',
	embedded: true,
	properties: {
		date: 'double',
		value: 'double?',
	}
};
