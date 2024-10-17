import React, { useRef } from 'react';
import { useAuth } from '@realm/react';
import { Animated, StyleSheet, View } from 'react-native';

import { GlobalStyles, Spacing } from '../../constants';
import { IconButton } from '../../components/buttons';
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

const Home: React.FC = () => {
	const { logOut } = useAuth();
	const { __ } = useI18n();
	const { getAccounts } = useData();
	const { TimeframeTypes } = useCharts();
	const { openChartSheet } = useChartSheet();
	const { show } = useAlert();
	const focusAnim = useRef(new Animated.Value(0)).current;

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
						icon={'log-out-outline'} />
				)} />
			<View style={styles.contentContainer}>
				<Grid columns={2} items={overviewCharts} />
			</View>
		</Animated.View>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container
	},

	contentContainer: {
		...GlobalStyles.container,
		...GlobalStyles.gutter,
		paddingVertical: Spacing.md
	}
});
