import { Action } from "../../constants/types";

export interface ToastProps {
	id: number;
	title?: string;
	text?: string;
	type?:
	| "info"
	| "success"
	| "error";
	actions?: Action[];
	timeout?: number;
	onDismiss?: (id: ToastProps['id']) => void;
	isDismissable?: boolean;
	autoDismiss?: boolean;
}

export type ToastOptions = Partial<Omit<ToastProps, "id">>;

export interface ToastContextProps {
	show: (options: ToastOptions) => void;
	hide: (id: ToastProps['id']) => void;
	toasts: ToastProps[];
}

export interface ToastProviderProps {
	children: React.ReactNode;
}