import { Stack, useRouter, useSegments } from "expo-router";
import AuthProvider,{ useAuth } from "./authcontext";
import { useEffect } from "react";
import { authEmitter } from "@/services/authEmiter";
import { PaperProvider } from "react-native-paper";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import "@/services/notificacoes/backgroundTask";

function ProtectedLayout() {
  const { userToken, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  configurarNotificacoes();
  registrarBackGroundTask();
  
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

  async function registrarBackGroundTask() {
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
  return (
    <AuthProvider>
      <PaperProvider>
        <ProtectedLayout />
      </PaperProvider>
    </AuthProvider>
  );
}