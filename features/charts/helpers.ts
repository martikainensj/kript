export const getYTDLength = () => {
	const today = new Date();
	const startOfYear = new Date(today.getFullYear(), 0, 1);
	const diffInMs = today.getTime() - startOfYear.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	return diffInDays + 1;
};