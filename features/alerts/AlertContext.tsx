import { createContext, useContext, useState } from "react";
import { AlertContextProps, AlertProps, AlertProviderProps, AlertType } from "./types";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { DefaultButton } from "../../components/buttons";
import { useI18n } from "../i18n/I18nContext";
import { GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../theme/ThemeContext";

const AlertContext = createContext<AlertContextProps>({
	show: () => { },
	hide: () => { },
	current: null
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
	const [current, setCurrent] = useState<AlertProps<AlertType> | null>(null);

	const show = <T extends AlertType>(alert: AlertProps<T>) => {
		setCurrent(alert);
	};

	const hide = () => {
		setCurrent(null);
	};

	return (
		<AlertContext.Provider value={{
			show,
			hide,
			current
		}}>
			{children}

			{current && (
				<View style={styles.container}>
					<Alert {...current} />
				</View>
			)}
		</AlertContext.Provider>
	);
}

const Alert = <T extends AlertType>({ title, message, params }: AlertProps<T>) => {
	const { __ } = useI18n();
	const { hide } = useAlert();
	const { theme } = useTheme();
	const handler = (callback: () => void) => {
		callback();
		hide();
	}

	return (
		<View style={[
			styles.alert,
			{ backgroundColor: theme.colors.background }
		]}>
			<Text style={[
				styles.title
			]}>{title}</Text>

			{message && (
				<Text style={styles.message}>{message}</Text>
			)}

			<View style={styles.buttons}>
				{"onConfirm" in params && (
					<DefaultButton onPress={() => handler(params.onConfirm)}>
						{params.confirmText ?? __("OK")}
					</DefaultButton>
				)}

				{"onCancel" in params && (
					<DefaultButton onPress={() => handler(params.onCancel)}>
						{params.cancelText ?? __("Cancel")}
					</DefaultButton>
				)}

				{"onDismiss" in params && (
					<DefaultButton onPress={() => handler(params.onDismiss)}>
						{params.dismissText ?? __("OK")}
					</DefaultButton>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.gutter,
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: "rgba(0, 0, 0, 0.6)",
	},
	alert: {
		padding: Spacing.lg,
		backgroundColor: "white",
		borderRadius: 8,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	message: {
		fontSize: 16,
		marginBottom: 16,
	},
	buttons: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: Spacing.md
	},
});