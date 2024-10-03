export type IntervalKey = 
	| 'daily'
	| 'weekly'
	| 'monthly'
	| 'yearly';

export type TimeframeKey =
  | '1day'
  | '1week'
  | '1month'
  | '3month'
  | 'ytd'
  | '1year'
  | '3year'
  | '5year'
  | 'max';

export interface TimeframeProps {
  id: TimeframeKey;
  name: string;
  interval: IntervalKey;
  range?: number;
}