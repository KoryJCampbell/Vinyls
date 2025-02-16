import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "My Vinyl Collection" }} />
      <Stack.Screen name="details" options={{ title: "Album Details" }} />
      <Stack.Screen name="add" options={{ title: "Add New Album" }} />
    </Stack>
  );
}
