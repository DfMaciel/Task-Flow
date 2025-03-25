import { Stack, useRouter, useSegments } from "expo-router";
import AuthProvider,{ useAuth } from "./authcontext";
import { useEffect } from "react";
import { authEmitter } from "@/services/authEmiter";
import { PaperProvider } from "react-native-paper";

function ProtectedLayout() {
  const { userToken, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  
  useEffect(() => {
    async function prepareApp() {
      if (loading) return;
      
      try {
        const inAuthGroup = segments?.[0] === "login";
        const isNotFound = segments?.[0] === "+not-found";
        
        if (isNotFound) {
          if (userToken) {
            await router?.replace("/(tabs)/home");
          } else {
            await router?.replace("/login/inicial");
          }
        }
        if (!userToken && !inAuthGroup) {
          await router?.replace("/login/inicial");
        } else if (userToken && inAuthGroup) {
          await router?.replace("/(tabs)/home");
        }
          else if (userToken && inAuthGroup) {
            await router?.replace("/(tabs)/home");
          }
      } catch (e) {
        console.warn("Navigation error:", e);
      } finally {
        console.log("App is ready");}
    }

    prepareApp();
  }, [userToken, segments, loading, router]);

  useEffect(() => {
    const handleLogout = () => {
      router.replace("/login/inicial");
    };
    authEmitter.on("logout", handleLogout);
    return () => {
      authEmitter.off("logout", handleLogout);
    };
  }, [router]);
  
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
      <PaperProvider>
        <ProtectedLayout />
      </PaperProvider>
    </AuthProvider>
  );
}