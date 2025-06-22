import { Stack, useRouter, useSegments } from "expo-router";
import AuthProvider,{ useAuth } from "./authcontext";
import { useEffect, useState } from "react";
import { authEmitter } from "@/services/authEmiter";
import { ActivityIndicator, MD3LightTheme, PaperProvider } from "react-native-paper";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import "@/services/notificacoes/backgroundTask";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from 'expo-status-bar';
import { Platform } from "react-native";
import { useURL } from "expo-linking";

function ProtectedLayout() {
  const { userToken, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const url = useURL();
  const [isDeepLinkHandled, setIsDeepLinkHandled] = useState(false);

  configurarNotificacoes();
  registrarBackGroundTask();

  useEffect(() => {
    async function prepareApp() {
      if (loading) {
      return;
    }

    if (url  && !isDeepLinkHandled) {
      setIsDeepLinkHandled(true);
      const path = url.split('/--/')[1];
      if (path) {
        console.log(`Navigating to deep link path: /${path}`);
        router.replace(`/${path}`);
      }
      return;
    }
    try {

      if (segments.length === 0 || isDeepLinkHandled) {
        return;
      }

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
  }, [userToken, segments, loading, url, isDeepLinkHandled]);

  useEffect(() => {
    const handleLogout = () => {
      router.replace("/login/inicial");
    };
    authEmitter.on("logout", handleLogout);
    return () => {
      authEmitter.off("logout", handleLogout);
    };
  }, [router]);

  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider theme={MD3LightTheme}>
          <ActivityIndicator
            size="large"
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          />
        </PaperProvider>
      </GestureHandlerRootView>
    );
  }
  
  async function configurarNotificacoes() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== "granted") {
        console.warn("Permissão de notificações não concedida");
        return;
      }
    }
  }

  Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

  async function registrarBackGroundTask() {
    if (Platform.OS === "web") {
      console.warn("Background tasks are not supported on web.");
      return;
    }
    const isRegistered = await TaskManager.isTaskRegisteredAsync('verificar-tarefas-vencidas');

    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync('verificar-tarefas-vencidas', {
        minimumInterval: 15 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("Tarefa de verificação de tarefas vencidas registrada com sucesso.");
    } else {
      console.log("Tarefa de verificação de tarefas vencidas já está registrada.");
    }

    const status = await BackgroundFetch.getStatusAsync();
    console.log('Status do BackgroundFetch:', status);
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
    </Stack>
  );
}

export default function RootLayout() {
  const appTheme = MD3LightTheme;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider theme={appTheme}>
          <StatusBar style="light" translucent={false} backgroundColor="black"/>
          <ProtectedLayout />
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}