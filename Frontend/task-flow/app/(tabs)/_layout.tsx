import { Tabs } from "expo-router";
import { BottomNavigation, IconButton } from "react-native-paper";
import { CommonActions } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import { Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }
            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            return options.title || route.name;
          }}
          style={{
            backgroundColor: theme.colors.surface,
            height: Platform.OS === 'ios' ? 94 : 64,
            justifyContent: 'center',
          }}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.onSurfaceDisabled}
        />
      )}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="usuario"
        options={{
          title: "Usuário",
          headerShown: true,
          headerTitle: "Meu perfil",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: theme.colors.primary, 
            height: 56,
          },
          headerTintColor: '#FFF', 
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}