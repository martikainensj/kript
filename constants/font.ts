export const FontSize = {
	xs: 12,
	sm: 14,
	md: 16,
	lg: 18,
	xl: 24
}

export type TextAlignKey = 'left' | 'center' | 'right';
export type FontWeightKey = 'extraLight' | 'light' | 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold' | 'black';
export type FontWeightValue = 100 | 200 | 300 | 400| 500 | 600 | 700 | 800 | 900;
export type FontWeightType = {
	[key in FontWeightKey]: FontWeightValue;
};

export const FontWeight: FontWeightType = {
	extraLight: 100,
	light: 200,
	regular: 300,
	medium: 400,
	semiBold: 500,
	bold: 600,
	extraBold: 700,
	black: 800
}

type FontFamilyType = {
	[key in FontWeightKey]: string;
}

export const FontFamily: FontFamilyType = {
	extraLight: 'MonaSans-ExtraLight',
	light: 'MonaSans-Light',
	regular: 'MonaSans-Regular',
	medium: 'MonaSans-Medium',
	semiBold: 'MonaSans-SemiBold',
	bold: 'MonaSans-Bold',
	extraBold: 'MonaSans-ExtraBold',
	black: 'MonaSans-Black'
}