import { DataPoint } from "../realm/models/DataPoint";

export const getYTDLength = () => {
	const today = new Date();
	const startOfYear = new Date(today.getFullYear(), 0, 1);
	const diffInMs = today.getTime() - startOfYear.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	return diffInDays + 1;
};

export const buildChartData = (datasets: DataPoint[][]): DataPoint[] => {
	const copiedDatasets = datasets.map(dataset => dataset.map(dataPoint => ({ ...dataPoint })));

	const dates = copiedDatasets.reduce((acc, dataset) => {
		dataset.forEach(dataPoint => {
			acc.add(dataPoint.date);
		});
		return acc;
	}, new Set<DataPoint['date']>());

	const sortedDates = [...dates].sort();
	const chartData = sortedDates.map(date => {
		let value = 0;

		copiedDatasets.forEach(dataset => {
			if (dataset[1]?.date <= date) {
				dataset.splice(0, 1);
			}

			if (dataset[0]?.date <= date) {
				value += dataset[0]?.value ?? 0;
			}
		});

		return { date, value } as DataPoint;
	});

	return chartData;
};