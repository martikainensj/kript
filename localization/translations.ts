interface Translation {
	fi?: string,
	en_US?: string
}

export const Translations: { [ key: string ]: Translation } = {
	missingKey: {
		fi: 'Käännös puuttuu',
		en_US: 'Missing translation'
	},
	'welcome to': {
		fi: 'Tervetuloa',
		en_US: 'Welcome to'
	},
	'welcome to kript': {
		fi: 'Tervetuloa Kriptiin',
		en_US: 'Welcome to Kript'
	},
	'home': {
		fi: 'Koti',
		en_US: "Home"
	},
	'settings': {
		fi: 'Asetukset',
		en_US: "Settings"
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
	},
	'overview': {
		fi: 'Yleistä',
		en_US: 'Overview'
	},
	'new': {
		fi: 'Uusi',
		en_US: 'New'
	},
	'edit': {
		fi: 'Muokkaa',
		en_US: 'Edit'
	},
	'remove': {
		fi: 'Poista',
		en_US: 'Remove'
	},
	'no items': {
		fi: 'Ei kohteita',
		en_US: 'No items'
	},

	// Account

	'account': {
		fi: 'Tili',
		en_US: "Account"
	},
	'accounts': {
		fi: 'Tilit',
		en_US: "Accounts"
	},
	'new account': {
		fi: 'Uusi tili',
		en_US: 'New Account'
	},
	'edit account': {
		fi: 'Muokkaa tiliä',
		en_US: 'Edit Account'
	},
	'add account': {
		fi: 'Lisää tili',
		en_US: 'Add Account'
	},
	'update account': {
		fi: 'Päivitä tili',
		en_US: 'Update Account'
	},
	'remove account': {
		fi: 'Poista tili',
		en_US: 'Remove Account'
	},
	'removing existing account': {
		fi: 'Poistetaan olemassa oleva tili',
		en_US: 'Removing existing account'
	},
	'updating existing account': {
		fi: 'Päivitetään olemassa oleva tili',
		en_US: 'Updating existing account'
	},
	'adding a new account': {
		fi: 'Lisätään uutta tiliä',
		en_US: 'Adding a new account'
	},
	'no accounts': {
		fi: 'Ei tilejä',
		en_US: 'No Accounts'
	},
	'create a new account by clicking the "+" button in the top right corner.': {
		fi: 'Luo uusi tili painamalla "+" painiketta oikeassa yläkulmassa',
		en_US: 'Create a new account by clicking the "+" button in the top right corner.'
	},

	// Holding

	'holding': {
		fi: 'Omistus',
		en_US: "Holding"
	},
	'holdings': {
		fi: 'Omistukset',
		en_US: "Holdings"
	},
	'new holding': {
		fi: 'Uusi omistus',
		en_US: 'New holding'
	},
	'edit holding': {
		fi: 'Muokkaa omistusta',
		en_US: 'Edit holding'
	},
	'update holding': {
		fi: 'Päivitä omistus',
		en_US: 'Update holding'
	},
	'remove holding': {
		fi: 'Poista omistus',
		en_US: 'Remove holding'
	},
	'removing existing holding': {
		fi: 'Poistetaan olemassa oleva omistus',
		en_US: 'Removing existing holding'
	},
	'updating existing holding': {
		fi: 'Päivitetään olemassa oleva omistus',
		en_US: 'Updating existing holding'
	},
	'no holdings': {
		fi: 'Ei omistuksia',
		en_US: 'No holdings'
	},

	// Transaction

	'transaction': {
		fi: 'Transaktio',
		en_US: "Transaction"
	},
	'transactions': {
		fi: 'Transaktiot',
		en_US: "Transactions"
	},
	'new transaction': {
		fi: 'Uusi transaktio',
		en_US: 'New Transaction'
	},
	'edit transaction': {
		fi: 'Muokkaa transaktiota',
		en_US: 'Edit Transaction'
	},
	'add transaction': {
		fi: 'Lisää transaktio',
		en_US: 'Add Transaction'
	},
	'update transaction': {
		fi: 'Päivitä transaktio',
		en_US: 'Update Transaction'
	},
	'remove transaction': {
		fi: 'Poista transaktio',
		en_US: 'Remove Transaction'
	},
	'removing existing transaction': {
		fi: 'Poistetaan olemassa oleva transaktio',
		en_US: 'Removing existing Transaction'
	},
	'updating existing transaction': {
		fi: 'Päivitetään olemassa oleva transaktio',
		en_US: 'Updating existing Transaction'
	},
	'adding a new transaction': {
		fi: 'Lisätään uutta transaktiota',
		en_US: 'Adding a new Transaction'
	},
	'no transactions': {
		fi: 'Ei transaktioita',
		en_US: 'No Transactions'
	},

	// Transfers

	'transfer': {
		fi: 'Siirto',
		en_US: 'Transfer'
	},
	'transfers': {
		fi: 'Siirrot',
		en_US: 'Transfers'
	},
	'new transfer': {
		fi: 'Uusi siirto',
		en_US: 'New Transfer'
	},
	'edit transfer': {
		fi: 'Muokkaa siirtoa',
		en_US: 'Edit Transfer'
	},
	'add transfer': {
		fi: 'Lisää siirto',
		en_US: 'Add Transfer'
	},
	'update transfer': {
		fi: 'Päivitä siirto',
		en_US: 'Update Transfer'
	},
	'remove transfer': {
		fi: 'Poista siirto',
		en_US: 'Remove Transfer'
	},
	'removing existing transfer': {
		fi: 'Poistetaan olemassa oleva siirto',
		en_US: 'Removing existing Transfer'
	},
	'updating existing transfer': {
		fi: 'Päivitetään olemassa oleva siirto',
		en_US: 'Updating existing Transfer'
	},
	'adding a new transfer': {
		fi: 'Lisätään uutta siirtoa',
		en_US: 'Adding a new Transfer'
	},
	'no transfers': {
		fi: 'Ei siirtoja',
		en_US: 'No Transfers'
	},

	// Dividends

	'dividend': {
		fi: 'Osinko',
		en_US: 'Dividend'
	},
	'dividends': {
		fi: 'Osingot',
		en_US: 'Dividends'
	},
	'new dividend': {
		fi: 'Uusi osinko',
		en_US: 'New Dividend'
	},
	'edit dividend': {
		fi: 'Muokkaa osinkoa',
		en_US: 'Edit Dividend'
	},
	'add dividend': {
		fi: 'Lisää osinko',
		en_US: 'Add Dividend'
	},
	'update dividend': {
		fi: 'Päivitä osinko',
		en_US: 'Update Dividend'
	},
	'remove dividend': {
		fi: 'Poista osinko',
		en_US: 'Remove Dividend'
	},
	'removing existing dividend': {
		fi: 'Poistetaan olemassa oleva osinko',
		en_US: 'Removing existing Dividend'
	},
	'updating existing dividend': {
		fi: 'Päivitetään olemassa oleva osinko',
		en_US: 'Updating existing Dividend'
	},
	'adding a new dividend': {
		fi: 'Lisätään uutta osinkoa',
		en_US: 'Adding a new Dividend'
	},
	'no dividends': {
		fi: 'Ei osinkoja',
		en_US: 'No Dividends'
	},

	'buy': {
		fi: 'Osta',
		en_US: 'Buy'
	},
	'sell': {
		fi: 'Myy',
		en_US: 'Sell'
	},
	'deposit': {
		fi: 'Talletus',
		en_US: 'Deposit'
	},
	'withdrawal': {
		fi: 'Nosto',
		en_US: 'Withdrawal'
	},
	'balance': {
		fi: 'Saldo',
		en_US: 'Balance'
	},
	'value': {
		fi: 'Arvo',
		en_US: 'Value'
	},

	'are you sure?': {
		fi: 'Oletko varma?',
		en_US: 'Are you sure?'
	},
	'name': {
		fi: 'Nimi',
		en_US: 'Name'
	},
	'date': {
		fi: 'Päivämäärä',
		en_US: 'Date'
	},
	'price': {
		fi: 'Hinta',
		en_US: 'Price'
	},
	'amount': {
		fi: 'Määrä',
		en_US: 'Amount'
	},
	'total': {
		fi: 'Summa',
		en_US: 'Total'
	},
	'notes': {
		fi: 'Muistiinpanot',
		en_US: 'Notes'
	},
	'enter notes here': {
		fi: 'Kirjoita muistiinpanot tähän',
		en_US: 'Enter notes here'
	},
	'investment account': {
		fi: 'Arvo-osuustili',
		en_US: 'Investment Account'
	}
}