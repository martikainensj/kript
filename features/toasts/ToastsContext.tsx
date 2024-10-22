import { createContext, useContext, useRef, useState } from "react";
import { ToastContextProps, ToastOptions, ToastProps, ToastProviderProps } from "./types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LayoutAnimation, LayoutAnimationConfig, Platform, StyleSheet, UIManager, View } from "react-native";
import { Duration, GlobalStyles } from "../../constants";
import { Toast } from "./Toast";

const ToastsContext = createContext<ToastContextProps>({
	show: () => { },
	hide: () => { },
	toasts: []
});

export const useToasts = () => useContext(ToastsContext);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
	const insets = useSafeAreaInsets();
	const [toasts, setToasts] = useState<ToastProps[]>([]);
	const id = useRef(0);

	const layoutAnimationConfig = {
		duration: Duration.slow,
		update: {
			type: LayoutAnimation.Types.spring,
			springDamping: 0.7,
		},
	} as LayoutAnimationConfig;

	if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
		UIManager.setLayoutAnimationEnabledExperimental(true);
	}

	const show = (options: ToastOptions) => {
		const toast: ToastProps = {
			id: id.current++,
			...options
		};
		setToasts(prev => [...prev, toast]);
	};

	const hide = (id: ToastProps['id']) => {
		LayoutAnimation.configureNext(layoutAnimationConfig);
		setToasts(prev => prev.filter(toast => toast.id !== id));
	};

	return (
		<ToastsContext.Provider value={{ show, hide, toasts }}>
			{children}
			<View
				style={[
					styles.container,
					{
						top: 'auto',
						left: insets.left,
						right: insets.right,
						bottom: insets.bottom
					}
				]}
			>
				{toasts.map(toast => (
					<Toast key={toast.id} {...toast} onDismiss={hide} />
				))}
			</View>
		</ToastsContext.Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.container,
		...GlobalStyles.slice,
		position: 'absolute',
		flexDirection: 'column-reverse'
	}
})