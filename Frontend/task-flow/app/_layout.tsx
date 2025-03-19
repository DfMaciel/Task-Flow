import { Stack, useRouter, useSegments } from "expo-router";
import AuthProvider, { useAuth } from "./authcontext";
import { useEffect } from "react";

function ProtectedLayout() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    const inAuthGroup = segments[0] === "login";
    
    if (!user && !inAuthGroup) {
      router.replace("/login/inicial");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)/home");
    }
  }, [user, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProtectedLayout />
    </AuthProvider>
  );
}