import { Slot } from "expo-router";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Slot /> 
    </AuthProvider>
  );
}
