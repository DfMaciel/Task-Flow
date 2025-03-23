import { createContext, useContext, useState, useEffect } from "react";
import { login as loginService, logout as logoutService } from "./services/api";
import { getToken } from "./services/tokenStorage";

interface AuthContextType {
  userToken: string | null;
  login: (email: string, senha: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken();
      setUserToken(token);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email: string, senha: string) => {
    const result = await loginService(email, senha);
    if (result.success) {
      setUserToken(await getToken());
    }
    return result;
  };

  const logout = async () => {
    await logoutService();
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth (): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
  };

  export { useAuth };
  export default AuthProvider;