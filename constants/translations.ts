interface Translation {
	fi?: string,
	en_US?: string
}

export const Translations: { [ key: string ]: Translation } = {
	missingKey: {
		fi: 'Käännös puuttuu',
		en_US: 'Missing translation'
	},
	'welcome to kript': {
		fi: 'Tervetuloa Kriptiin',
		en_US: 'Welcome to Kript'
	},
	'home': {
		fi: 'Koti',
		en_US: "Home"
	},
	'accounts': {
		fi: 'Tilit',
		en_US: "Accounts"
	},
	'authentication': {
		fi: 'Tunnistus',
		en_US: 'Authentication'
	},
	'email': {
		fi: 'Sähköposti',
		en_US: 'Email'
	},
	'password': {
		fi: 'Salasana',
		en_US: 'Password'
	},
	'example': {
		fi: 'Esimerkki',
		en_US: 'Example'
	},
	'login': {
		fi: 'Kirjaudu',
		en_US: 'Login'
	},
	'sign up': {
		fi: 'Rekisteröidy',
		en_US: 'Sign up'
	},
	'logout': {
		fi: 'Kirjaudu ulos',
		en_US: 'Logout'
	},
	'are you sure you want to log out?': {
		fi: 'Haluatko varmasti kirjautua ulos?',
		en_US: 'Are you sure you want to log out?'
	},
	'login failed. please check your username and password and try again.': {
		fi: 'Kirjautuminen epäonnistui. Tarkista käyttäjätunnus ja salasana ja yritä uudelleen.',
		en_US: 'Login failed. Please check your username and password and try again.'
	},
	'registration failed. please check the information you provided and try again.': {
		fi: 'Rekisteröityminen epäonnistui. Tarkista antamasi tiedot ja yritä uudelleen.',
		en_US: 'Registration failed. Please check the information you provided and try again.'
	}
}