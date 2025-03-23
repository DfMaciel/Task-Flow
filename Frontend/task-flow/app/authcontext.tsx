import { createContext, useContext, useState, useEffect } from "react";
import { login as loginService, logout as logoutService } from "../services/api";
import { getRefreshToken, getToken } from "../services/tokenStorage";
import { AxiosError } from "axios";

interface AuthContextType {
  userToken: string | null;
  login: (email: string, senha: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken();
      const refreshToken = await getRefreshToken();
      setUserToken(token);
      setRefreshToken(refreshToken);
      console.log(token, "fode no pelo", refreshToken);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email: string, senha: string) => {
    // try {
      const result = await loginService(email, senha);
      if (result?.success) {
        setUserToken(await getToken());
        setRefreshToken(await getRefreshToken());
        return { success: result.success};
      }
      else{
        return { success: result?.success, message: result?.message };
      }
    // } catch (error) {
    //     let errorMessage = (error as AxiosError).response?.data as any;
    //     throw new Error(errorMessage);
    // } 
  };

  const logout = async () => {
    await logoutService();
    setUserToken(null);
    setRefreshToken(null);
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