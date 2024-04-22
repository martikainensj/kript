interface Translation {
	fi: string,
	en_US: string
}

export const Translations: { [ key: string ]: Translation } = {
	missingKey: {
		fi: 'Käännös puuttuu',
		en_US: 'Missing translation'
	},
	'home': {
		fi: 'Koti',
		en_US: "Home"
	}
}