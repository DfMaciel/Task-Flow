import "dotenv/config";

export default ({ config }) => ({
  ...config,
  expo: {
    name: "TaskFlow",
    slug: "task-flow",
    scheme: "taskflow",
    owner: "davi_maciel",
    extra: {
      SERVER_ROUTE: process.env.SERVER_ROUTE,
      eas: {
        projectId: "d47c1373-5c9f-4289-ac87-9a61964d1312"
      }
    },
    version: "1.0.0",
    orientation: "default",
    userInterfaceStyle: "automatic",
    newArchEnabled: true, // Note: Consider if you really need/want the new architecture enabled.
    ios: {
      bundleIdentifier: "com.davi_maciel.taskflow",
      supportsTablet: true,
      infoPlist: {
        NSCalendarsUsageDescription: "Esta aplicação precisa de acesso ao seu calendário para adicionar e gerenciar prazos de tarefas.",
      },
      associatedDomains: [
        "applinks:expo.dev"
      ]
    },
    android: {
      package: "com.davi_maciel.taskflow", 
      adaptiveIcon: {
        backgroundColor: "#ffffff",
        foregroundImage: "./taskflowlogo.png"
      },
      permissions: [ 
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE", 
        "android.permission.INTERNET",
        "android.permission.READ_CALENDAR",    
        "android.permission.WRITE_CALENDAR",
        "android.permission.ACTIVITY_RECOGNITION",
        "android.permission.health.READ_STEPS"
      ],
      usesCleartextTraffic: true ,
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          data: [
            {
            scheme: "https",
            host: "expo.dev",
            pathPrefix: "/@davi_maciel/task-flow"
            }
          ],
          category: ["BROWSABLE", "DEFAULT"]
        },
        {
          "action": "VIEW",
          "category": ["BROWSABLE", "DEFAULT"],
          "data": [{ "scheme": "health-connect", "host": "permissions" }]
        }
      ]
    },
    web: { 
      bundler: "metro",
      output: "static"
    },
    plugins: [ 
      "expo-router",
      "expo-localization",
      "react-native-health-connect",
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 26,
            "compileSdkVersion": 34,
            "targetSdkVersion": 34
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  },
});