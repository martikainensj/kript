import { useI18n } from "../i18n/I18nContext";
import { SortingProps } from "./types";

export const useSorting = () => {
	const { __ } = useI18n();

	const SortingTypes = {
		newestFirst: {
			id: 'newestFirst',
			icon: 'arrow-up-outline',
			name: __('Newest first'),
			function: (a: any, b: any) => b.date - a.date
		} as SortingProps,
		oldestFirst: {
			id: 'oldestFirst',
			icon: 'arrow-down-outline',
			name: __('Oldest first'),
			function: (a: any, b: any) => a.date - b.date
		} as SortingProps,
		name: {
			id: 'name',
			icon: 'text-outline',
			name: __('Name (A-Z)'),
			function: (a: any, b: any) => a.name.localeCompare(b.name)
		} as SortingProps,
		highestReturn: {
			id: 'highestReturn',
			icon: 'arrow-up-outline',
			name: __('Highest return'),
			function: (a: any, b: any) => b.returnValue - a.returnValue
		} as SortingProps,
		lowestReturn: {
			id: 'lowestReturn',
			icon: 'arrow-down-outline',
			name: __('Lowest return'),
			function: (a: any, b: any) => a.returnValue - b.returnValue
		} as SortingProps,
		highestValue: {
			id: 'highestValue',
			icon: 'arrow-up-outline',
			name: __('Highest value'),
			function: (a: any, b: any) => b.value - a.value
		} as SortingProps
	};

	return {
		SortingTypes
	}
}