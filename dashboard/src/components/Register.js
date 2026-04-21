import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Alert,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Paper,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../hooks/useAuth";
import api from '../services/api';

/* ✅ Enhanced DARK THEME with professional colors */
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      light: "#609cff",
      dark: "#1e4a8a",
    },
    secondary: {
      main: "#00c48c",
    },
    error: {
      main: "#ff5a5f",
    },
    background: {
      default: "#0a0c10",
      paper: "#13171f",
    },
    text: {
      primary: "#eef2ff",
      secondary: "#8b9bb0",
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.5px",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          padding: "10px 24px",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#222733",
            },
            "&:hover fieldset": {
              borderColor: "#3b82f6",
            },
          },
        },
      },
    },
  },
});

export default function Register() {
  const [alert, setAlert] = React.useState({ st: false, msg: "", severity: "error" });
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Validation functions
  const validateName = (name) => {
    if (!name) return "Username is required";
    if (name.length < 3) return "Username must be at least 3 characters";
    if (name.length > 50) return "Username must be less than 50 characters";
    if (!/^[a-zA-Z0-9\s\-_.]+$/.test(name)) {
      return "Username can only contain letters, numbers, spaces, and -_. characters";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 100) return "Password must be less than 100 characters";
    
    // Password strength checks
    let strengthErrors = [];
    if (!/[A-Z]/.test(password)) strengthErrors.push("one uppercase letter");
    if (!/[a-z]/.test(password)) strengthErrors.push("one lowercase letter");
    if (!/[0-9]/.test(password)) strengthErrors.push("one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) strengthErrors.push("one special character");
    
    if (strengthErrors.length > 0) {
      return `Password must contain ${strengthErrors.join(", ")}`;
    }
    return "";
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      setAlert({
        st: true,
        msg: "Please fix the errors before submitting",
        severity: "warning",
      });
      return;
    }

    if (!acceptTerms) {
      setAlert({
        st: true,
        msg: "Please accept the Terms & Conditions to continue",
        severity: "warning",
      });
      return;
    }

    // Rate limiting check
    const lastAttempt = localStorage.getItem("lastRegisterAttempt");
    const now = Date.now();
    if (lastAttempt && now - parseInt(lastAttempt) < 5000) {
      setAlert({
        st: true,
        msg: "Please wait a moment before trying again",
        severity: "warning",
      });
      return;
    }
    localStorage.setItem("lastRegisterAttempt", now.toString());

    setLoading(true);
    setAlert({ st: false, msg: "", severity: "error" });

    try {
      // Using api instance instead of axios with full URL
      const res = await api.post('/users/register', {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      });

      if (res.data.token) {
        // Show success message
        setAlert({
          st: true,
          msg: "Registration successful! Redirecting to dashboard...",
          severity: "success",
        });
        
        // Auto-login after registration
        await login(res.data.token);
        
        // Redirect after short delay
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.error || "Invalid registration data";
            break;
          case 409:
            errorMessage = "Email already exists. Please use a different email or login.";
            break;
          case 429:
            errorMessage = "Too many registration attempts. Please try again later.";
            break;
          default:
            errorMessage = error.response.data?.error || "Registration failed. Please try again.";
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    if (strength <= 2) return { strength, label: "Weak", color: "#ff5a5f" };
    if (strength <= 4) return { strength, label: "Medium", color: "#f97316" };
    return { strength, label: "Strong", color: "#00c48c" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        
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
            elevation={0}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(19, 23, 31, 0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(34, 39, 51, 0.5)",
              borderRadius: "24px",
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: "primary.main",
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, #3b82f6, #00c48c)",
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 32 }} />
            </Avatar>

            <Typography component="h1" variant="h5" sx={{ mt: 1, fontWeight: 600 }}>
              Create Account
            </Typography>
            
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3, textAlign: "center" }}>
              Join our trading platform to start investing
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
              {alert.st && (
                <Alert 
                  severity={alert.severity} 
                  sx={{ 
                    mb: 2,
                    borderRadius: "12px",
                    "& .MuiAlert-icon": { alignItems: "center" }
                  }}
                  onClose={() => setAlert({ st: false, msg: "", severity: "error" })}
                >
                  {alert.msg}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    required
                    fullWidth
                    label="Username"
                    autoFocus
                    value={formData.name}
                    onChange={handleInputChange}
                    error={!!errors.name}
                    helperText={errors.name || "Enter your full name or username"}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={!!errors.email}
                    helperText={errors.email || "We'll never share your email"}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    error={!!errors.password}
                    helperText={errors.password || "Use 8+ characters with mix of letters, numbers & symbols"}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                            disabled={loading}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Box
                          sx={{
                            flex: 1,
                            height: 4,
                            bgcolor: "rgba(255,255,255,0.1)",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${(passwordStrength.strength / 6) * 100}%`,
                              height: "100%",
                              bgcolor: passwordStrength.color,
                              transition: "width 0.3s",
                            }}
                          />
                        </Box>
                        <Typography variant="caption" sx={{ color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnKeyIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                            disabled={loading}
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        color="primary"
                        disabled={loading}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        I agree to the{" "}
                        <Link to="/terms" style={{ color: "#3b82f6" }}>
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy" style={{ color: "#3b82f6" }}>
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  position: "relative",
                  background: loading ? undefined : "linear-gradient(135deg, #3b82f6, #2563eb)",
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1, color: "white" }} />
                    Creating Account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <Grid container justifyContent="center">
                <Grid item>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#3b82f6", textDecoration: "none" }}>
                      Sign in
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}