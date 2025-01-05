import { useEffect, useState } from "react";
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";

import { IconButton } from "../buttons";
import { TextInput } from "../inputs/TextInput";
import { GlobalStyles, IconSize } from "../../constants";
import { allSet, stripRealmListsFromObject } from "../../helpers";
import { Holding } from "../../models/Holding";
import { useI18n } from "../../features/i18n/I18nContext";
import { Text } from "../ui/Text";
import { Icon } from "../ui/Icon";

interface HoldingFormProps {
	label?: string;
	holding: Holding,
	onSubmit: (holding: Holding) => void;
}

export const HoldingForm = ({
	label,
	holding,
	onSubmit
}: HoldingFormProps) => {
	const { __ } = useI18n();
	const [editedHolding, setEditedHolding]
		= useState({ ...holding });

	const { name, notes, leverageRatio, ownershipRatio } = editedHolding;

	const handleDismissKeyboard = () => {
		Keyboard.dismiss();
	};

	const onSubmitHandler = () => {
		handleDismissKeyboard();
		onSubmit(stripRealmListsFromObject(editedHolding));
	}

	useEffect(() => {
		setEditedHolding({ ...holding });
	}, [holding]);

	return (
		<TouchableWithoutFeedback onPress={handleDismissKeyboard}>
			<View style={styles.container}>
				{label && (
					<Text fontSize="md">
						{label}
					</Text>
				)}

				<TextInput
					label={__('Name')}
					value={name}
					placeholder={`${__('Example')}: Apple Inc.`}
					onChangeText={name => setEditedHolding(
						Object.assign({ ...editedHolding }, { name })
					)}
				/>

				<TextInput
					label={__('Leverage ratio')}
					value={leverageRatio}
					placeholder={`${__('Example')}: 1`}
					keyboardType={"numeric"}
					inputMode={'decimal'}
					min={1}
					max={100}
					suffixComponent={<Icon name="speedometer" />}
					onChangeText={leverageRatio => setEditedHolding(
						Object.assign({ ...editedHolding }, { leverageRatio })
					)}
				/>

				{/*<TextInput
					label={ __( 'Notes' ) }
					value={ notes }
					placeholder={ `${ __( 'Enter notes here' ) }...` }
					onChangeText={ notes => setEditedHolding(
						Object.assign( { ...editedHolding }, { notes } )
					) }
					multiline={ true } />*/}

				<IconButton
					icon={'save'}
					size={IconSize.lg}
					style={styles.submitButton}
					disabled={!allSet(name)}
					onPress={onSubmitHandler} />
			</View>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	container: {
		...GlobalStyles.form,
	},
	submitButton: {
		alignSelf: 'flex-end'
	}
});