import React from 'react';
import { useQuery } from '@realm/react';
import { Text } from 'react-native';

import { Account } from './models/Account';

export const AppNonSync = () => {
	const accounts = useQuery(
		Account,
		collection => collection.sorted('name')
	);

	return (
		<Text>{ JSON.stringify( accounts ) }</Text>
	);
};
