import { Stack } from "expo-router";

export default function InspectionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="client-data" />
      <Stack.Screen name="conditions" />
      <Stack.Screen name="room-selection" />
      <Stack.Screen name="items" />
      <Stack.Screen name="summary" />
    </Stack>
  );
}
