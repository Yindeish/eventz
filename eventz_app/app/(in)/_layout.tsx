import { Stack } from "expo-router";

const InLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="home" />
            <Stack.Screen name="events" />
            <Stack.Screen name="tickets" />
            <Stack.Screen name="message" />
            <Stack.Screen name="profile" />
        </Stack>
    );
}

export default InLayout;