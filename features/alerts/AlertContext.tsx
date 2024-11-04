import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { AlertContextProps, AlertProps, AlertProviderProps, AlertType } from "./types";
import { DefaultButton } from "../../components/buttons";
import { useI18n } from "../i18n/I18nContext";
import { BlurIntensity, BorderRadius, Duration, GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../theme/ThemeContext";
import { Text } from "../../components/ui/Text";
import { BlurView } from "../../components/ui/BlurView";
import { ANIMATION_DURATION } from "./constants";

const AlertContext = createContext<AlertContextProps>({
  show: () => {},
  hide: () => {},
  current: null,
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const { theme } = useTheme();
  const [current, setCurrent] = useState<AlertProps<AlertType> | null>(null);
  const [visible, setVisible] = useState(false);

  const blurIntensityAnim = useRef(new Animated.Value(0)).current;
  const blurOpacityDriver = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const listenerId = blurOpacityDriver.addListener(({ value }) => {
      blurIntensityAnim.setValue(value * BlurIntensity.lg);
    });
    return () => blurOpacityDriver.removeListener(listenerId);
  }, []);

  const show = <T extends AlertType>(alert: AlertProps<T>) => {
    Animated.timing(blurOpacityDriver, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    setCurrent(alert);
    setVisible(true);
  };

  const hide = () => {
		setCurrent(null);

    Animated.timing(blurOpacityDriver, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  return (
    <AlertContext.Provider value={{ show, hide, current }}>
      {children}
      <View style={styles.container} pointerEvents={visible ? "auto" : "none"}>
        <BlurView
          intensity={blurIntensityAnim}
          style={StyleSheet.absoluteFill}
          tint={theme.dark ? "light" : "dark"}
        />
        {current && <Alert {...current} />}
      </View>
    </AlertContext.Provider>
  );
};

// Type guard functions
const hasOnCancel = (params: any): params is { onCancel: () => void; cancelText?: string } => {
  return "onCancel" in params;
};

const hasOnConfirm = (params: any): params is { onConfirm: () => void; confirmText?: string } => {
  return "onConfirm" in params;
};

const hasOnDismiss = (params: any): params is { onDismiss: () => void; dismissText?: string } => {
  return "onDismiss" in params;
};

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

  const handlePress = (callback: () => void) => {
    callback();
    hide();
  };

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
        {hasOnCancel(params) && (
          <DefaultButton style={styles.button} onPress={() => handlePress(params.onCancel)}>
            {params.cancelText ?? __("Cancel")}
          </DefaultButton>
        )}
        {hasOnConfirm(params) && (
          <DefaultButton style={styles.button} onPress={() => handlePress(params.onConfirm)}>
            {params.confirmText ?? __("OK")}
          </DefaultButton>
        )}
        {hasOnDismiss(params) && (
          <DefaultButton style={styles.button} onPress={() => handlePress(params.onDismiss)}>
            {params.dismissText ?? __("OK")}
          </DefaultButton>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.slice,
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  alert: {
    minWidth: "80%",
    padding: Spacing.lg,
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
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  button: {
    flexShrink: 0,
  },
});