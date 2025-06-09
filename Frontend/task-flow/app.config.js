import "dotenv/config";

export default ({ config }) => ({
  ...config,
  expo: {
    name: "TaskFlow",
    slug: "task-flow",
    scheme: "myapp",
    extra: {
      SERVER_ROUTE: process.env.SERVER_ROUTE,
      eas: {
        projectId: "d47c1373-5c9f-4289-ac87-9a61964d1312"
      }
    },
    version: "1.0.0",
    orientation: "default",
    userInterfaceStyle: "automatic",
    newArchEnabled: false, // Note: Consider if you really need/want the new architecture enabled.
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCalendarsUsageDescription: "Esta aplicação precisa de acesso ao seu calendário para adicionar e gerenciar prazos de tarefas.",
      }
    },
    android: {
      package: "com.davi_maciel.taskflow", 
      adaptiveIcon: {
        backgroundColor: "#ffffff" 
      },
      permissions: [ 
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE", 
        "android.permission.INTERNET",
        "android.permission.READ_CALENDAR",    
        "android.permission.WRITE_CALENDAR"
      ],
      usesCleartextTraffic: true 
    },
    web: { 
      bundler: "metro",
      output: "static"
    },
    plugins: [ 
      "expo-router",
      "expo-localization",
    ],
    experiments: {
      typedRoutes: true
    }
  },
});