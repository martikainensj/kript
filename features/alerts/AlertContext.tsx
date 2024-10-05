import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AlertContextProps, AlertProps, AlertProviderProps, AlertType } from "./types";
import { Animated, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { DefaultButton } from "../../components/buttons";
import { useI18n } from "../i18n/I18nContext";
import { BorderRadius, GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../theme/ThemeContext";

const AlertContext = createContext<AlertContextProps>({
	show: () => { },
	hide: () => { },
	current: null
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
	const [current, setCurrent] = useState<AlertProps<AlertType> | null>(null);
	const [visible, setVisible] = useState(false);
	const fadeAnim = useRef(new Animated.Value(0)).current;

	const show = <T extends AlertType>(alert: AlertProps<T>) => {
		setCurrent(alert);
		setVisible(true);
	};

	const hide = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start(() => {
			setVisible(false);
			setCurrent(null);
		});
	};

	useEffect(() => {
		if (visible) {
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
	}, [visible]);

	return (
		<AlertContext.Provider value={{
			show,
			hide,
			current
		}}>
			{children}

			{current && visible && (
				<Animated.View style={[styles.container, { opacity: fadeAnim }]}>
					<Alert {...current} />
				</Animated.View>
			)}
		</AlertContext.Provider>
	);
}

const Alert = <T extends AlertType>({ title, message, params }: AlertProps<T>) => {
	const { __ } = useI18n();
	const { hide } = useAlert();
	const { theme } = useTheme();
	const translateYAnim = useRef(new Animated.Value(Spacing.xl)).current;

	useEffect(() => {
		Animated.spring(translateYAnim, {
			toValue: 0,
			useNativeDriver: true,
		}).start();
	}, []);

	const handler = (callback: () => void) => {
		callback();
		hide();
	}

	return (
		<Animated.View
			style={[
				styles.alert,
				{ backgroundColor: theme.colors.background, transform: [{ translateY: translateYAnim }] },
			]}
		>
			<Text style={styles.title}>{title}</Text>

			{message && <Text style={styles.message}>{message}</Text>}

			<View style={styles.buttons}>
				{"onCancel" in params && (
					<DefaultButton
						style={ styles.button }
						onPress={() => handler(params.onCancel)}
					>
						{params.cancelText ?? __("Cancel")}
					</DefaultButton>
				)}

				{"onConfirm" in params && (
					<DefaultButton
						style={ styles.button }
						onPress={() => handler(params.onConfirm)}
					>
						{params.confirmText ?? __("OK")}
					</DefaultButton>
				)}

				{"onDismiss" in params && (
					<DefaultButton
						style={ styles.button }
						onPress={() => handler(params.onDismiss)}
					>
						{params.dismissText ?? __("OK")}
					</DefaultButton>
				)}
			</View>
		</Animated.View>
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
		borderRadius: BorderRadius.md,
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
		justifyContent: "flex-end",
		gap: Spacing.sm
	},
	button: {
		flexShrink: 0
	}
});