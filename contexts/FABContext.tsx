import React, {
	useState,
	createContext,
	useContext
} from "react";
import {
	StyleSheet
} from "react-native";
import { FAB as PaperFAB, FABGroupProps } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import {
	BorderRadius,
	Spacing
} from "../constants";
import { Icon } from "../components/ui/Icon";
import { EdgeInsets } from "react-native-safe-area-context";
import { useI18n } from "../features/i18n/I18nContext";
import { useData } from "../features/data/DataContext";

interface FABContext {
	actions: FABGroupProps["actions"];
	setActions: React.Dispatch<React.SetStateAction<FABContext['actions']>>;
	icon?: React.ComponentProps<typeof Ionicons>['name'];
	setIcon?: React.Dispatch<React.SetStateAction<FABContext['icon']>>;
	label?: string;
	setLabel?: React.Dispatch<React.SetStateAction<FABContext['label']>>;
}

const FABContext = createContext<FABContext>({
	actions: [],
	setActions: () => { },
	icon: 'ellipsis-vertical',
	setIcon: () => { },
	label: '',
	setLabel: () => { },
});

export const useFAB = () => useContext(FABContext);

interface ProviderProps {
	side?: 'left' | 'right';
	insets?: EdgeInsets;
	children: React.ReactNode;
}

export const FABProvider: React.FC<ProviderProps> = ({
	side = 'right',
	insets,
	children
}) => {
	const [actions, setActions] = useState<FABContext['actions']>([]);
	const [icon, setIcon] = useState<FABContext['icon']>('ellipsis-vertical');
	const [label, setLabel] = useState<FABContext['label']>('');

	return (
		<FABContext.Provider value={{
			actions,
			setActions,
			icon,
			setIcon,
			label,
			setLabel
		}}>
			{children}
			<FAB
				side={side}
				insets={insets}
				icon={icon}
				label={label}
			/>
		</FABContext.Provider>
	);
}

interface FABProps {
	side: ProviderProps['side'];
	insets: ProviderProps['insets'];
	icon: FABContext['icon'];
	label: FABContext['label'];
}

const FAB: React.FC<FABProps> = ({ side, insets, icon, label }) => {
	const { isProcessing } = useData();
	const { __ } = useI18n();
	const { actions } = useFAB();
	const [open, setOpen] = useState(false);

	const isVisible = !isProcessing && !!actions.length;

	const getIcon = () => {
		if (open) {
			return 'close';
		}

		if (icon) {
			return icon;
		}

		return 'ellipsis-vertical';
	}

	return (
		<PaperFAB.Group
			open={open}
			visible={isVisible}
			icon={({ size }) => <Icon name={getIcon()} size={size} />}
			actions={actions}
			variant={"secondary"}
			onStateChange={(state) => {
				setOpen(state.open);
			}}
			style={{
				paddingBottom: insets?.bottom,
			}}
			label={label}
			fabStyle={[
				styles.fab,
				side === 'left' && styles.left,
				side === 'right' && styles.right,
			]} />
	)
}

const styles = StyleSheet.create({
	fab: {
		borderRadius: BorderRadius.xl,
	},
	left: {
		marginLeft: Spacing.md,
		marginRight: 'auto'
	},
	right: {
		marginLeft: 'auto',
		marginRight: Spacing.md
	}
});