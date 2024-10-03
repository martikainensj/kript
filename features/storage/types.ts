import { ColorSchemeName } from "react-native";
import { TimeframeProps } from "../charts/types";
import { LocaleString } from "../i18n/types";
import { SortingProps } from "../data/types";

export interface storageProps {
  '@settings/colorScheme': { type: ColorSchemeName };
  '@settings/language': { type: LocaleString };
	'@filters/timeframe': { type: {[ key: string ]: { id: keyof TimeframeProps }}}
	'@filters/sorting': { type: {[ key: string ]: { id: keyof SortingProps }}}
}

export type storageKey = keyof storageProps;

export type storageValue<K extends storageKey> = storageProps[K]['type'];
