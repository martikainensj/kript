export const FontSize = {
	xs: 12,
	sm: 14,
	md: 16,
	lg: 18,
	xl: 24
}

interface FontWeight {
	light: '100' | '200' | '300' | '400'| '500' | '600' | '700' | '800' | '900',
	regular: '100' | '200' | '300' | '400'| '500' | '600' | '700' | '800' | '900',
	bold: '100' | '200' | '300' | '400'| '500' | '600' | '700' | '800' | '900'
}

export const FontWeight: FontWeight = {
	light: '200',
	regular: '400',
	bold:	 '700'
}

interface FontFamily {
	extraLight: 'MonaSans-ExtraLight';
	light: 'MonaSans-Light';
	regular: 'MonaSans-Regular';
	medium: 'MonaSans-Medium';
	semiBold: 'MonaSans-SemiBold';
	bold: 'MonaSans-Bold';
	extraBold: 'MonaSans-ExtraBold';
	black: 'MonaSans-Black';
}

export const FontFamily: FontFamily = {
	extraLight: 'MonaSans-ExtraLight',
	light: 'MonaSans-Light',
	regular: 'MonaSans-Regular',
	medium: 'MonaSans-Medium',
	semiBold: 'MonaSans-SemiBold',
	bold: 'MonaSans-Bold',
	extraBold: 'MonaSans-ExtraBold',
	black: 'MonaSans-Black'
}