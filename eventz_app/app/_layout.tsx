import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import Providers from '@/components/shared/providers';
import '@/global.css';
import useAuth from '@/hooks/auth/useAuth';
import { hide } from 'expo-router/build/utils/splash';

export const unstable_settings = {
  anchor: '(tabs)',
};

hide()

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Providers>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stacks />
        <StatusBar style="auto" />
      </ThemeProvider>
    </Providers>
  );
}

const Stacks = () => {
  const { user } = useAuth();
  const authenticated = Boolean(user != null);
  const unauthenticated = Boolean(user == null);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={unauthenticated}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>
      <Stack.Protected guard={authenticated}>
        <Stack.Screen name="(in)" />
      </Stack.Protected>
    </Stack>
  );
}
