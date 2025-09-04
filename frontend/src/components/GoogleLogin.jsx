import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaGoogle } from "react-icons/fa";

const GoogleLogin = ({ onSuccess, onError, buttonText = "Continue with Google" }) => {
  const { googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // Only load Google OAuth if client ID is properly configured
    if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID" || clientId === "your_google_client_id_here") {
      console.warn("Google OAuth not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file");
      return;
    }

    // Load Google OAuth script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup'
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login-button"),
          {
            theme: "filled_blue",
            size: "large",
            type: "standard",
            text: "signin_with",
            shape: "rectangular",
            logo_alignment: "left",
          }
        );
      }
    };

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split(".")[1]));
      
      // Guard: ensure required fields exist
      const googleData = {
        googleId: payload?.sub,
        email: payload?.email,
        name: payload?.name,
        picture: payload?.picture,
      };

      if (!googleData.googleId || !googleData.email || !googleData.name) {
        if (onError) onError('Missing Google profile fields (id/email/name).');
        else alert('Google login failed: missing id/email/name.');
        return;
      }

      const result = await googleLogin(googleData);

      if (result.success) {
        if (onSuccess) {
          onSuccess(result);
        } else {
          // Default navigation
          if (result.redirectTo) navigate(result.redirectTo);
          else navigate("/dashboard");
        }
      } else {
        if (onError) {
          onError(result.error);
        } else {
          alert(result.error || "Google login failed");
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
      if (onError) {
        onError("Google login failed. Please try again.");
      } else {
        alert("Google login failed. Please try again.");
      }
    }
  };

  // Fallback button if Google script fails to load
  const handleFallbackGoogleLogin = () => {
    alert("Google OAuth is not configured. Please contact the administrator.");
  };

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isConfigured = clientId && clientId !== "YOUR_GOOGLE_CLIENT_ID" && clientId !== "your_google_client_id_here";

  return (
    <div className="w-full flex justify-center">
      {isConfigured ? (
        <div id="google-login-button"></div>
      ) : (
        <div className="w-full bg-gray-100 text-gray-500 border border-gray-300 py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-3">
          <FaGoogle className="text-gray-400" />
          Google OAuth not configured
        </div>
      )}
    </div>
  );
};

export default GoogleLogin;
