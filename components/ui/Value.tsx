import React from "react";
import { View, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Text } from "react-native-paper";
import { Spacing, GlobalStyles, FontSize, Color } from "../../constants";

interface ValueWrapperProps {
  value: string | number;
  unit?: string;
  isVertical?: boolean;
  valueContainerStyle?: ViewStyle;
  valueStyle?: TextStyle;
  unitStyle?: TextStyle;
}

const ValueWrapper: React.FC<ValueWrapperProps> = ( {
  value,
  unit,
  isVertical,
  valueContainerStyle,
  valueStyle,
  unitStyle,
} ) => {
  if ( ! value && value !== 0 ) {
    return (
      <View style={ [styles.valueContainer, valueContainerStyle] }>
        <Text style={ [styles.value, styles.undefined, valueStyle] }>
          { "-" }
        </Text>

        { unit && !isVertical &&
          <Text style={ [styles.unit, styles.undefined, unitStyle] }>{ unit }</Text>
        }
      </View>
    );
  }

  return (
    <View style={ [styles.valueContainer, valueContainerStyle] }>
      { typeof value === "string" || typeof value === "number"
				? <Text style={ [styles.value, valueStyle] }>{ value }</Text>
      	: <View style={ [styles.value, valueStyle] }>{ value }</View>
      }

      { unit && ! isVertical &&
        <Text style={ [styles.unit, { marginLeft: Spacing.xxs }, unitStyle] }>
          { unit }
        </Text>
      }
    </View>
  );
};

interface ValueProps {
  label?: string;
  value: string | number;
  containerStyle?: ViewStyle;
  labelContainerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  valueContainerStyle?: ViewStyle;
  valueStyle?: TextStyle;
  unitStyle?: TextStyle;
  isVertical?: boolean;
  unit?: string | null;
}

export const Value: React.FC<ValueProps> = ( {
  label,
  value,
  containerStyle,
  labelContainerStyle,
  labelStyle,
  valueContainerStyle,
  valueStyle,
  unitStyle,
  isVertical = false,
  unit = null,
} ) => {
  return (
    <View style={ [
			styles.container,
			isVertical ? styles.vertical : styles.horizontal,
			containerStyle
		] }>
      { ( !! label || isVertical ) &&
        <View style={ [styles.labelContainer, labelContainerStyle] }>
          <Text style={ [styles.label, labelStyle] }>{ label }</Text>

          { unit && isVertical && (
            <Text style={ [styles.unit, unitStyle] }>{ unit }</Text>
          ) }
        </View>
      }

      <ValueWrapper
        value={ value }
        unit={ unit }
        valueContainerStyle={ valueContainerStyle }
        valueStyle={ valueStyle }
        unitStyle={ unitStyle }
        isVertical={ isVertical }
      />
    </View>
  );
};

const styles = StyleSheet.create( {
  container: {
    gap: Spacing.xs,
  },
  vertical: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  horizontal: {
    alignItems: 'center',
    justifyContent: "space-between",
    flexDirection: "row",
  },
  horizontalValue: {
    marginLeft: Spacing.md,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: Spacing.xs,
    flexGrow: 1,
  },
  label: {
    ...GlobalStyles.label,
  },
  valueContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
	value: {

	},
  unit: {
    textAlign: "right",
    fontSize: FontSize.xs,
  },
  undefined: {
    color: Color.grey,
  },
} );
