import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from '../services/api';

// Custom styled components
const Avatar = ({ sx, children, ...props }) => (
  <div style={{ 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    background: sx?.background || sx?.bgcolor || "#3b82f6", 
    borderRadius: "50%", 
    width: sx?.width || 56, 
    height: sx?.height || 56, 
    margin: sx?.m || "1rem" 
  }} {...props}>
    {children}
  </div>
);

const Button = ({ children, fullWidth, variant, disabled, onClick, sx, type, component, to, ...props }) => {
  const Element = component === Link ? Link : "button";
  const isLink = component === Link;
  
  return (
    <Element
      type={!isLink ? (type || "button") : undefined}
      to={isLink ? to : undefined}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: sx?.py || "12px 24px",
        borderRadius: "12px",
        background: variant === "contained" 
          ? (sx?.background || "#3b82f6") 
          : "transparent",
        color: variant === "contained" 
          ? (sx?.color || "white") 
          : (sx?.color || "#3b82f6"),
        border: variant === "contained" 
          ? "none" 
          : `1px solid ${sx?.borderColor || "#3b82f6"}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontWeight: 600,
        fontSize: "0.95rem",
        textTransform: "none",
        textDecoration: "none",
        textAlign: "center",
        display: "inline-block",
        ...sx,
      }}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </Element>
  );
};

const TextField = ({ label, value, onChange, error, helperText, disabled, fullWidth, margin, required, name, id, type, autoComplete, autoFocus, ...props }) => (
  <div style={{ marginBottom: margin === "normal" ? "16px" : "8px", width: fullWidth ? "100%" : "auto" }}>
    <div style={{ marginBottom: "4px", fontSize: "0.85rem", color: "#8b9bb0", fontWeight: 500 }}>
      {label} {required && <span style={{ color: "#ff5a5f" }}>*</span>}
    </div>
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      style={{
        width: "100%",
        padding: "12px 16px",
        borderRadius: "12px",
        border: error ? "2px solid #ff5a5f" : "1px solid #222733",
        background: "#13171f",
        color: "#eef2ff",
        fontSize: "1rem",
        outline: "none",
        transition: "border-color 0.2s",
      }}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
    {error && helperText && <div style={{ marginTop: "4px", fontSize: "0.75rem", color: "#ff5a5f" }}>{helperText}</div>}
  </div>
);

const Container = ({ children, maxWidth, ...props }) => (
  <div style={{ 
    padding: "0 24px", 
    maxWidth: maxWidth === "xs" ? "480px" : "1200px", 
    margin: "0 auto",
    width: "100%"
  }} {...props}>
    {children}
  </div>
);

const Box = ({ sx, children }) => <div style={sx}>{children}</div>;

const Typography = ({ children, variant, sx }) => (
  <div style={{ 
    fontSize: variant === "h5" ? "1.5rem" : variant === "body2" ? "0.875rem" : "1rem",
    fontWeight: variant === "h5" ? 600 : 400,
    margin: variant === "h5" ? "1rem 0" : "0.25rem 0",
    ...sx 
  }}>
    {children}
  </div>
);

const Alert = ({ severity, sx, children, onClose }) => (
  <div style={{ 
    ...sx, 
    padding: "12px 16px", 
    borderRadius: "12px", 
    background: severity === "error" ? "rgba(255, 90, 95, 0.1)" : severity === "warning" ? "rgba(245, 158, 11, 0.1)" : "rgba(0, 196, 140, 0.1)", 
    borderLeft: `4px solid ${severity === "error" ? "#ff5a5f" : severity === "warning" ? "#f59e0b" : "#00c48c"}`,
    marginBottom: "16px",
    position: "relative"
  }}>
    {children}
    {onClose && (
      <button 
        onClick={onClose} 
        style={{ 
          position: "absolute", 
          right: "12px", 
          top: "50%", 
          transform: "translateY(-50%)",
          background: "none", 
          border: "none", 
          cursor: "pointer",
          color: "#8b9bb0",
          fontSize: "20px"
        }}
      >
        ×
      </button>
    )}
  </div>
);

const FormControlLabel = ({ control, label, sx }) => (
  <label style={{ display: "flex", alignItems: "center", marginTop: "16px", cursor: "pointer", ...sx }}>
    {control}
    <span style={{ marginLeft: "8px", fontSize: "0.9rem", color: "#8b9bb0" }}>{label}</span>
  </label>
);

const Checkbox = ({ checked, onChange, color, disabled }) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    disabled={disabled}
    style={{
      width: "18px",
      height: "18px",
      cursor: disabled ? "not-allowed" : "pointer",
      accentColor: color === "primary" ? "#3b82f6" : "auto",
    }}
  />
);

const CircularProgress = ({ size, sx }) => {
  React.useEffect(() => {
    if (!document.querySelector("#circular-progress-keyframes")) {
      const style = document.createElement("style");
      style.id = "circular-progress-keyframes";
      style.textContent = `
        @keyframes circular-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{ 
      display: "inline-block",
      width: size || 24, 
      height: size || 24, 
      borderRadius: "50%", 
      border: "3px solid rgba(59, 130, 246, 0.3)", 
      borderTop: `3px solid ${sx?.color || "#3b82f6"}`, 
      animation: "circular-spin 1s linear infinite",
      ...sx 
    }} />
  );
};

const Paper = ({ sx, children }) => (
  <div style={{ 
    ...sx, 
    background: "#13171f", 
    borderRadius: "24px", 
    border: "1px solid #222733", 
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
  }}>
    {children}
  </div>
);

const Divider = ({ sx, children }) => (
  <div style={{ 
    display: "flex", 
    alignItems: "center", 
    margin: sx?.my || "16px 0",
    ...sx 
  }}>
    <hr style={{ flex: 1, border: "none", height: "1px", background: "#222733" }} />
    {children && <span style={{ margin: "0 16px", color: "#8b9bb0", fontSize: "0.75rem" }}>{children}</span>}
    {children && <hr style={{ flex: 1, border: "none", height: "1px", background: "#222733" }} />}
  </div>
);

const Grid = ({ container, children }) => (
  <div style={{ 
    display: "flex", 
    flexDirection: "column",
    width: "100%",
    ...(container && { gap: "16px" })
  }}>
    {children}
  </div>
);

// Icon components
const LockOutlinedIcon = ({ fontSize }) => (
  <svg width={fontSize === 32 ? 32 : 24} height={fontSize === 32 ? 32 : 24} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1 .9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-1-7V6c0-1.1 .9-2 2-2s2 .9 2 2v4h-4z"/>
  </svg>
);

// Main Login Component
export default function Login() {
  const [alert, setAlert] = React.useState({ st: false, msg: "", severity: "error" });
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = React.useState({});

  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Auto-dismiss alert after 5 seconds
  React.useEffect(() => {
    if (alert.st) {
      const timer = setTimeout(() => {
        setAlert({ st: false, msg: "", severity: "error" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.st]);

  // Load remembered email from localStorage
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      
      setAlert({
        st: true,
        msg: "Please fix the errors before submitting",
        severity: "warning",
      });
      return;
    }

    const lastAttempt = localStorage.getItem("lastLoginAttempt");
    const now = Date.now();
    if (lastAttempt && now - parseInt(lastAttempt) < 2000) {
      setAlert({
        st: true,
        msg: "Please wait a moment before trying again",
        severity: "warning",
      });
      return;
    }
    localStorage.setItem("lastLoginAttempt", now.toString());

    setLoading(true);
    setAlert({ st: false, msg: "", severity: "error" });

    try {
      const res = await api.post('/users/login', {
        email: formData.email,
        password: formData.password,
      });

      if (res.data.token) {
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        await login(res.data.token);
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      let errorMessage = "Network Error. Please check your connection.";
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Invalid email or password";
            break;
          case 403:
            errorMessage = "Account locked. Too many failed attempts.";
            break;
          case 404:
            errorMessage = "User not found. Please sign up first.";
            break;
          case 429:
            errorMessage = "Too many login attempts. Please try again later.";
            break;
          default:
            errorMessage = error.response.data?.error || "Login failed. Please try again.";
        }
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please check your connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setAlert({
        st: true,
        msg: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormData({
      email: "demo@tradingplatform.com",
      password: "demo123",
    });
    
    setErrors({});
    
    // Small delay to ensure state updates
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Container maxWidth="xs">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(circle at 30% 20%, rgba(59,130,246,0.05) 0%, rgba(0,0,0,0) 70%)",
          }}
        >
          <Paper
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(19, 23, 31, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(34, 39, 51, 0.5)",
              borderRadius: "24px",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #3b82f6, #00c48c)",
                width: 56,
                height: 56,
                margin: "1rem",
              }}
            >
              <LockOutlinedIcon fontSize={32} />
            </Avatar>

            <Typography variant="h5" sx={{ mt: 1, fontWeight: 600, textAlign: "center" }}>
              Welcome Back
            </Typography>
            
            <Typography variant="body2" sx={{ color: "#8b9bb0", mb: 3, textAlign: "center" }}>
              Sign in to access your trading dashboard
            </Typography>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              {alert.st && (
                <Alert 
                  severity={alert.severity}
                  onClose={() => setAlert({ st: false, msg: "", severity: "error" })}
                >
                  {alert.msg}
                </Alert>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Remember me"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background: loading ? undefined : "linear-gradient(135deg, #3b82f6, #2563eb)",
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ color: "white", marginRight: "8px" }} />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleDemoLogin}
                disabled={loading}
                sx={{
                  mb: 2,
                  py: 1,
                  borderColor: "rgba(59, 130, 246, 0.5)",
                }}
              >
                Try Demo Account
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" sx={{ color: "#8b9bb0" }}>
                  New to Trading Platform?
                </Typography>
              </Divider>

              <Grid container>
                <Button
                  component={Link}
                  to="/register"
                  fullWidth
                  variant="text"
                  sx={{ color: "#3b82f6" }}
                >
                  Create New Account
                </Button>
                
                <Button
                  component={Link}
                  to="/forgot-password"
                  fullWidth
                  variant="text"
                  sx={{ color: "#8b9bb0", fontSize: "0.8rem" }}
                >
                  Forgot Password?
                </Button>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Container>
    </div>
  );
}