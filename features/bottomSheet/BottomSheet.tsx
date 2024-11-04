import React, { useEffect, useState } from "react";
import { Animated, Dimensions, LayoutChangeEvent, StyleSheet, View } from "react-native";
import {
  PanGestureHandler,
  ScrollView,
  HandlerStateChangeEvent,
  PanGestureHandlerEventPayload,
  State,
	GestureEvent,
} from "react-native-gesture-handler";
import { BorderRadius, GlobalStyles, Spacing } from "../../constants";
import { useTheme } from "../theme/ThemeContext";
import { ANIMATION_DURATION, DISMISS_THRESHOLD, DRAG_RESISTANCE_FACTOR } from "./constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
  enableContentScroll?: boolean;
  isVisible: boolean;
  onClose: () => void;
  translationYAnim: Animated.Value;
  setBottomSheetHeight: (height: number) => void;
}

export const BottomSheet: React.FC<Props> = ({
  children,
  enableContentScroll,
  isVisible,
  onClose,
  translationYAnim,
  setBottomSheetHeight,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [height, setHeight] = useState(0);

  const onGestureEvent = (e: GestureEvent<PanGestureHandlerEventPayload>) => {
    const { translationY } = e.nativeEvent;
    const resistanceValue = translationY < 0 ? translationY / (1 - translationY * DRAG_RESISTANCE_FACTOR) : translationY;
    
		translationYAnim.setValue(resistanceValue);
  };

  const onHandlerStateChange = (e: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
    if (e.nativeEvent.state === State.END) {
      const shouldDismiss = e.nativeEvent.translationY > DISMISS_THRESHOLD;
      
			Animated.timing(translationYAnim, {
        toValue: shouldDismiss ? height : 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(shouldDismiss ? onClose : undefined);
    }
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;

    setHeight(height);
    setBottomSheetHeight(height);
  };

  useEffect(() => {
    if (height > 0) {
      Animated.spring(translationYAnim, {
        toValue: isVisible ? 0 : height,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, height]);

  return (<>
    <Animated.View style={[styles.fillerContainer, { backgroundColor: theme.colors.surface, transform: [{ translateY: translationYAnim }] }]} />
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: translationYAnim }], backgroundColor: theme.colors.background },
      ]}
      onLayout={onLayout}
    >
      <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <View style={[styles.handleContainer, { backgroundColor: theme.colors.surface }]}>
          <View style={[styles.handleIndicator, { backgroundColor: theme.colors.surfaceVariant }]} />
        </View>
      </PanGestureHandler>

      <ScrollView
        scrollEnabled={enableContentScroll}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom }]}
      >
        {children}
      </ScrollView>
    </Animated.View>
	</>);
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  handleContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
  },
  handleIndicator: {
    height: Spacing.xs,
    width: Spacing.xl,
    borderRadius: BorderRadius.sm,
  },
  contentContainer: {
    ...GlobalStyles.content,
  },
  fillerContainer: {
    ...StyleSheet.absoluteFillObject,
    top: "100%",
    height: Dimensions.get("screen").height,
    pointerEvents: "none",
  },
});