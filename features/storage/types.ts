import { TimeframeProps } from "../charts/types";
import { LocaleString } from "../i18n/types";
import { SortingProps } from "../data/types";
import { ThemeProps } from "../theme/types";

export interface storageProps {
  '@settings/dark': { type: ThemeProps['dark'] };
  '@settings/language': { type: LocaleString };
	'@filters/timeframe': { type: {[ key: string ]: { id: TimeframeProps['id'] }}}
	'@filters/sorting': { type: {[ key: string ]: { id: keyof SortingProps }}}
}

export type storageKey = keyof storageProps;

export type storageValue<K extends storageKey> = storageProps[K]['type'];
