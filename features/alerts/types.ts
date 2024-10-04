export type AlertType =
	| "confirmation"
	| "warning"
	| "dismiss";

export interface AlertParams {
  confirmation: {
		onConfirm: () => void;
		onCancel: () => void;
		confirmText?: string;
		cancelText?: string
	};
  warning: {
		onDismiss: () => void;
		dismissText?: string;
	};
  dismiss: {
		onDismiss: () => void;
		dismissText?: string;
	};
}

export type AlertParamsType<K extends AlertType> = AlertParams[K];

export interface BaseAlertProps {
  title: string;
  message?: string;
}

export type AlertProps<T extends AlertType> = BaseAlertProps & {
  type: T;
  params: AlertParamsType<T>;
};

export interface AlertContextProps {
  show: <T extends AlertType>(alert: AlertProps<T>) => void;
  hide: () => void;
  current: AlertProps<AlertType> | null;
}

export interface AlertProviderProps {
  children: React.ReactNode;
}
