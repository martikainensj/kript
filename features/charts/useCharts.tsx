import { useI18n } from "../i18n/I18nContext";
import { getYTDLength } from "./helpers";
import { TimeframeProps } from "./types";

export const useCharts = () => {
	const { __ } = useI18n();

	const TimeframeTypes = {
		'1day': {
			id: '1day',
			name: `1 ${__('day')}`,
			interval: 'daily',
			range: 1
		} as TimeframeProps,
		'1week': {
			id: '1week',
			name: `1 ${__('week')}`,
			interval: 'daily',
			range: 7
		} as TimeframeProps,
		'1month': {
			id: '1month',
			name: `1 ${__('month')}`,
			interval: 'daily',
			range: 30
		} as TimeframeProps,
		'3month': {
			id: '3month',
			name: `3 ${__('month')}`,
			interval: 'daily',
			range: 90
		} as TimeframeProps,
		'ytd': {
			id: 'ytd',
			name: __('YTD'),
			interval: 'daily',
			range: getYTDLength()
		} as TimeframeProps,
		'1year': {
			id: '1year',
			name: `1 ${__('year')}`,
			interval: 'weekly',
			range: 52
		} as TimeframeProps,
		'3year': {
			id: '3year',
			name: `3 ${__('years')}`,
			interval: 'weekly',
			range: 156
		} as TimeframeProps,
		'5year': {
			id: '5year',
			name: `5 ${__('years')}`,
			interval: 'weekly',
			range: 260
		} as TimeframeProps,
		'max': {
			id: 'max',
			name: __('Max'),
			interval: 'monthly',
		} as TimeframeProps,
	};

	return {
		TimeframeTypes
	}
}