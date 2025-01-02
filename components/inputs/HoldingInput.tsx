import React, { useState } from "react";
import {
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from "react-native";
import { ChipProps, Chips } from "./Chips";
import { Spacing } from "../../constants";
import { TextInput } from "./TextInput";
import { Account } from "../../models/Account";
import { useUser } from "../../features/realm/useUser";
import { Holding } from "../../models/Holding";

interface HoldingInputProps {
	value: string
	setValue: React.Dispatch<React.SetStateAction<string>>
	label: string
	placeholder: string,
	account: Account,
	disabled?: boolean,
	style?: StyleProp<ViewStyle>
}

export const HoldingInput: React.FC<HoldingInputProps> = ({
	value,
	setValue,
	label,
	placeholder,
	account,
	disabled,
	style,
}) => {
	const { user } = useUser();

	const [inputValue, setInputValue] = useState(value);
	const [chipsValue, setChipsValue] = useState(value);
	const [canShowChips, setCanShowChips] = useState(false);
	const [filteredHoldings, setFilteredHoldings] = useState<Partial<Holding>[]>([...account.holdings]);

	const chipsVisible =
		!!filteredHoldings.length && (!value || canShowChips);

	const onFocusHandler = () => {
		setCanShowChips(true);
	}

	const onClear = () => {
		setInputValue('');
		setValue(null);
		setChipsValue(null);
		setCanShowChips(true);
		setFilteredHoldings([...account.holdings]);
	}

	const onChangeText = (value: string) => {
		setInputValue(value);

		const filteredHoldings: Partial<Holding>[] = !!value
			? [...account.holdings].filter(holding => {
				const label = holding.name?.toLowerCase();
				return label.includes(value.toString().toLowerCase());
			})
			: [...account.holdings];

		filteredHoldings.push({
			name: value,
			owner_id: user.id,
			account_id: account._id,
		});

		setFilteredHoldings(filteredHoldings);

		if (!value) {
			return onClear();
		}

		setChipsValue(
			!!filteredHoldings.length && filteredHoldings[0].name
		);
	}

	const onSubmitHandler = () => {
		setValue(chipsValue);
		setInputValue(chipsValue);
		setCanShowChips(false);
	}

	const onSelectChip = (value: ChipProps) => {
	}

	return (
		<View style={[
			styles.container,
			style
		]}>
			<TextInput
				value={inputValue}
				label={label}
				placeholder={placeholder}
				onChangeText={onChangeText}
				onSubmitEditing={onSubmitHandler}
				onBlur={onSubmitHandler}
				onFocus={onFocusHandler}
				disabled={disabled}
			/>

			{chipsVisible &&
				<View style={styles.chipsWrapper}>
					<Chips
						items={filteredHoldings.map(holding => {
							return {
								label: holding.name,
								value: holding.name
							}
						})}
						value={chipsValue}
						setValue={(value) => {
							setChipsValue(value);
							setValue(value);
							setInputValue(value);
							setCanShowChips(false);
						}}
					/>
				</View>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: Spacing.sm
	},
	chipsWrapper: {
		marginHorizontal: -Spacing.md
	},
	contentContainer: {
		paddingHorizontal: Spacing.md
	}
})