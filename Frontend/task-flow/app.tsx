import 'expo-router/entry';
import { AuthProvider } from './app/authcontext';
import { Slot } from 'expo-router';

export default function App() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}