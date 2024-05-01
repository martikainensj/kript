import { Slot, Stack, useGlobalSearchParams } from "expo-router";

export default function AccountLayout() {
  const { name } = useGlobalSearchParams<{ id: string, name: string }>();

  return ( <>
		<Stack.Screen options={ {
			headerBackTitleVisible: false,
			title: name,
			animationDuration: 200
		} }/>
		<Slot />
	</> );
}