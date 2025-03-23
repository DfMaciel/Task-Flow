import { Stack, useRouter, useSegments } from "expo-router";
import AuthProvider,{ useAuth } from "./authcontext";
import { useEffect } from "react";

function ProtectedLayout() {
  const { userToken, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  
  useEffect(() => {
    async function prepareApp() {
      if (loading) return;
      
      try {
        const inAuthGroup = segments?.[0] === "login";
        
        if (!userToken && !inAuthGroup) {
          await router?.replace("/login/inicial");
        } else if (userToken && inAuthGroup) {
          await router?.replace("/(tabs)/home");
        }
      } catch (e) {
        console.warn("Navigation error:", e);
      } finally {
        console.log("App is ready");}
    }

    prepareApp();
  }, [userToken, segments, loading, router]);

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