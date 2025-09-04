// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback, useContext } from "react";
import api from "../api";

export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify token and load user data
  const verifyToken = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await api.get("/auth/me");
      if (response.data) {
        setUser(response.data);
        // Update stored user data
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user from localStorage on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Verify token in background
        verifyToken();
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [verifyToken]);

  // ✅ Login function
  const login = useCallback(async ({ email, password }) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email, password });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        
        // Determine redirect path based on role
        let redirectTo = "/dashboard";
        if (data.user.role === "admin") {
          redirectTo = "/admin-dashboard";
        } else if (data.user.role === "coach") {
          redirectTo = "/coach-dashboard";
        } else if (data.user.role === "player") {
          redirectTo = "/player-dashboard";
        }

        return { success: true, redirectTo, data };
      }

      return { success: false, error: "No token received" };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Google Login function
  const googleLogin = useCallback(async (googleData) => {
    try {
      setLoading(true);
      const { data } = await api.post("/auth/google-login", googleData);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        
        // Determine redirect path based on role
        let redirectTo = "/dashboard";
        if (data.user.role === "admin") {
          redirectTo = "/admin-dashboard";
        } else if (data.user.role === "coach") {
          redirectTo = "/coach-dashboard";
        } else if (data.user.role === "player") {
          redirectTo = "/player-dashboard";
        }

        return { success: true, redirectTo, data };
      }

      return { success: false, error: "No token received" };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Register function
  const register = useCallback(
    async ({ name, email, password, role, expertise, position }) => {
      try {
        setLoading(true);
        // Ensure only supported roles reach the API
        const safeRole = role === "coach" ? "coach" : "player";
        const { data } = await api.post("/auth/register", {
          name,
          email,
          password,
          role: safeRole,
          expertise,
          position,
        });

        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          
          // Determine redirect path based on role
          let redirectTo = "/dashboard";
          if (data.user.role === "admin") {
            redirectTo = "/admin-dashboard";
          } else if (data.user.role === "coach") {
            redirectTo = "/coach-dashboard";
          } else if (data.user.role === "player") {
            redirectTo = "/player-dashboard";
          }

          return { success: true, redirectTo, data };
        }

        return { success: false, error: "No token received" };
      } catch (err) {
        return {
          success: false,
          error: err.response?.data?.message || err.message,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ✅ Logout function
  const logout = useCallback(async () => {
    try {
      // Call logout endpoint if token exists
      const token = localStorage.getItem("token");
      if (token) {
        await api.post("/auth/logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  // ✅ Update user function
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      googleLogin, 
      register, 
      logout, 
      updateUser,
      verifyToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
