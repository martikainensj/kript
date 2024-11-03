import React, { useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '@realm/react';
import { Animated, StyleSheet, View } from 'react-native';

import { GlobalStyles, Spacing } from '../../constants';
import { DefaultButton, IconButton } from '../../components/buttons';
import { buildChartData } from '../../helpers';
import { Header } from '../../components/ui/Header';
import { LineChart } from '../../components/charts/LineChart';
import { LineChartButton } from '../../components/buttons/LineChartButton';
import { useChartSheet } from '../../contexts/ChartSheetContext';
import { Grid } from '../../components/ui/Grid';
import { useAlert } from '../../features/alerts/AlertContext';
import { useI18n } from '../../features/i18n/I18nContext';
import { useData } from '../../features/data/DataContext';
import { useCharts } from '../../features/charts/useCharts';
import { useFocusEffect } from 'expo-router';
import { animateIn, animateOut } from '../../features/animations/animate';
import { TextInput } from '../../components/inputs/TextInput';
import { useBottomSheet } from '../../features/bottomSheet/BottomSheetContext';
import { Text } from '../../components/ui/Text';

const Home: React.FC = () => {
	const { logOut } = useAuth();
	const { __ } = useI18n();
	const { getAccounts } = useData();
	const { TimeframeTypes } = useCharts();
	const { openChartSheet } = useChartSheet();
	const { show } = useAlert();
	const [testValue, setTestValue] = useState<string | number>('');
	const focusAnim = useRef(new Animated.Value(0)).current;
	const { register, open } = useBottomSheet();

	const logOutHandler = () => {
		show({
			title: __('Logout'),
			message: __('Are you sure?'),
			type: 'confirmation',
			params: {
				onConfirm: logOut,
				onCancel: () => { }
			}
		})
	}

	const accounts = getAccounts();
	const overallNetValue = buildChartData(accounts.map(account => account.valueHistoryData));
	const overallReturnValue = buildChartData(accounts.map(account => account.returnHistoryData));

	const overviewCharts = [];

	if (overallNetValue) {
		overviewCharts.push(
			<LineChartButton
				label={__("Overall Net Value")}
				unit={"€"}
				data={overallNetValue}
				onPress={() => {
					openChartSheet(
						'',
						<LineChart
							id={"overall-net-value-chart"}
							label={__("Overall Net Value")}
							unit={"€"}
							data={overallNetValue}
							timeframeOptions={[
								TimeframeTypes.ytd,
								TimeframeTypes["1year"],
								TimeframeTypes["3year"],
								TimeframeTypes["5year"],
								TimeframeTypes.max
							]} />
					)
				}}
			/>
		)
	}

	if (overallReturnValue) {
		overviewCharts.push(
			<LineChartButton
				label={__("Overall Return")}
				unit={"€"}
				data={overallReturnValue}
				onPress={() => {
					openChartSheet(
						'',
						<LineChart
							id={"overall-return-chart"}
							label={__("Overall Return")}
							unit={"€"}
							data={overallReturnValue}
							timeframeOptions={[
								TimeframeTypes.ytd,
								TimeframeTypes["1year"],
								TimeframeTypes["3year"],
								TimeframeTypes["5year"],
								TimeframeTypes.max
							]} />
					)
				}}
			/>
		)
	}

	useFocusEffect(
		React.useCallback(() => {
			animateIn({
				animation: focusAnim
			});

			return () => animateOut({
				animation: focusAnim
			});
		}, [])
	);

	useLayoutEffect(() => {
		register({
			id: "overall-net-value-sheet",
			component: (
				<LineChart
					id={"overall-net-value-chart"}
					label={__("Overall Net Value")}
					unit={"€"}
					data={overallNetValue}
					timeframeOptions={[
						TimeframeTypes.ytd,
						TimeframeTypes["1year"],
						TimeframeTypes["3year"],
						TimeframeTypes["5year"],
						TimeframeTypes.max
					]}
				/>
			)
		});
		register({
			id: "test",
			component: (
				<Text>Test</Text>
			)
		});
	}, []);

	return (
		<Animated.View style={[
			styles.container,
			{
				opacity: focusAnim,
			}
		]}>
			<Header
				title={__('Home')}
				right={(
					<IconButton
						onPress={logOutHandler}
						icon={'log-out-outline'}
					/>
				)}
			/>

			<View style={styles.content}>
				<View style={styles.slice}>
					<Grid columns={2} items={overviewCharts} />
				</View>
			</View>
			<DefaultButton
				onPress={() => {
					open("overall-net-value-sheet");
				}}
			>
				Test
			</DefaultButton>

			<DefaultButton
				onPress={() => {
					open("test");
				}}
			>
				Test
			</DefaultButton>
		</Animated.View>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container
	},
	content: {
		...GlobalStyles.content,
	},
	slice: {
		...GlobalStyles.slice
	}
});
