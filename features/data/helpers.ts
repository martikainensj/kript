import { Transaction } from "../realm/models/Transaction";

export const generateChecksum = (object: object) => {
	const objectString = JSON.stringify(object);

	return objectString.split('').reduce((checksum, char) => {
		return (checksum + char.charCodeAt(0)) % 65535;
	}, 0).toString(16);
};

export const getTransactionEndOfDayTimestamp = (transaction: Transaction) => {
	const date = new Date(transaction.date);
	date.setHours(23, 59, 59, 999);
	const timestamp = date.valueOf();

	return timestamp;
}