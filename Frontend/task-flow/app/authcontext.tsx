import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  user: string | null;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<string | null>(null); 

    useEffect(() => {
        const checkLoginStatus = async () => {
          try{
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
              setUser(storedUser); 
            }
          } catch (error) {
            console.log("Failed to load user from storage", error);
          }
        };
        checkLoginStatus();
      }, []);
  
    const login = async (username: string) => {
      try {
        await AsyncStorage.setItem("user", username);
        setUser(username);
      } catch (error) {
        console.error("Failed to save user", error);
      }
    };

    const logout = async () => {
      try {
        await AsyncStorage.removeItem("user");
        setUser(null);
      } catch (error) {
        console.error("Failed to remove user", error);
      }
    };
  
    return (
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };

  function useAuth () {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
  };

  export { AuthProvider, useAuth };
  export default AuthProvider;