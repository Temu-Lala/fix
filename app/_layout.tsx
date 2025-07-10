import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/hooks/useTheme";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const { colors, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="fixer/[id]" options={{ headerShown: true, title: "Fixer Details" }} />
        <Stack.Screen name="booking/new" options={{ headerShown: true, title: "Book a Service" }} />
        <Stack.Screen name="booking/[id]" options={{ headerShown: true, title: "Booking Details" }} />
        <Stack.Screen name="booking/confirmation" options={{ headerShown: true, title: "Booking Confirmed" }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: true, title: "Chat" }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="settings/language" options={{ headerShown: true, title: "Language" }} />
        <Stack.Screen name="settings/theme" options={{ headerShown: true, title: "Theme" }} />
        <Stack.Screen name="settings/notifications" options={{ headerShown: true, title: "Notifications" }} />
        <Stack.Screen name="payment-methods" options={{ headerShown: false }} />
        <Stack.Screen name="address-book" options={{ headerShown: false }} />
        <Stack.Screen name="address-book/add" options={{ headerShown: true, title: "Add Address" }} />
        <Stack.Screen name="saved-fixers" options={{ headerShown: false }} />
        <Stack.Screen name="help-support" options={{ headerShown: false }} />
        <Stack.Screen name="fixer-application" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}