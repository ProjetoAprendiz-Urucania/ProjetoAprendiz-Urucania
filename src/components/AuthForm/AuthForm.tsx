import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import imLogo from "../../assets/img/Form/im_logo.png";
import { login, createStudent } from "../../services/student.service";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { IUser } from "../../interfaces/IUser";

interface IAuthForm {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: IAuthForm) {
  const userContext = useContext(AuthContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserProvider");
  }

  const { setUser } = useAuth();

  const isLogin = mode === "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [church, setChurch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      let res;
      if (isLogin) {
        res = await login(email, password);
      } else {
        const newStudent = { name, email, password, church };
        res = await createStudent(newStudent);
      }

      if (res.studentWithoutPassword && res.token) {
        const storedUser = localStorage.getItem("user");
        const userObject: IUser | null = storedUser
          ? JSON.parse(storedUser)
          : null;
        setUser(userObject);

        navigate("/classes");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro inesperado");
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box sx={{ minWidth: { xs: "240px", sm: "280px" } }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Box component="img" src={imLogo} alt="Logo" width="42px" />
        </Box>

        {error && (
          <Typography color="error" textAlign="center" mb={2}>
            {error}
          </Typography>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          {!isLogin && (
            <>
              <TextField
                id="name"
                label="Nome"
                variant="standard"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={inputStyle}
              />
              <TextField
                id="church"
                label="Igreja"
                variant="standard"
                value={church}
                onChange={(e) => setChurch(e.target.value)}
                sx={inputStyle}
              />
            </>
          )}
          <TextField
            id="email"
            label="Email"
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            id="password"
            label="Senha"
            type={showPassword ? "text" : "password"}
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={inputStyle}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            sx={{
              backgroundColor: "#BB1626",
              fontWeight: "bold",
              color: "white",
              mt: 2,
            }}
          >
            {isLogin ? "Entrar" : "Registrar"}
          </Button>
        </form>

        {isLogin && (
          <>
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Link
                href={isLogin ? "/register" : "/login"}
                sx={{
                  fontSize: "14px",
                  color: "#6b7280",
                  textDecoration: "underline",
                  cursor: "pointer",
                  marginY: 1,
                  "&:hover": {
                    color: "#ED3237",
                  },
                }}
              >
                Esqueci minha senha
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                mt: 3.2,
              }}
            >
              <Box
                sx={{ flex: 1, height: "1px", backgroundColor: "#6b7280" }}
              />
              <Typography
                sx={{
                  mx: 1,
                  color: "#6b7280",
                  fontWeight: "200",
                  fontSize: "12px",
                }}
              >
                ou
              </Typography>
              <Box
                sx={{ flex: 1, height: "1px", backgroundColor: "#6b7280" }}
              />
            </Box>
          </>
        )}

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Link
            href={isLogin ? "/register" : "/login"}
            sx={{
              fontSize: "14px",
              color: "#ED3237",
              fontWeight: "bolder",
              textDecoration: "underline",
              cursor: "pointer",
              marginY: 1.5,
              "&:hover": {
                color: "#BB1626",
              },
            }}
          >
            {isLogin ? "Registrar-se" : "Fazer Login"}
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

const inputStyle = {
  "& .MuiInputLabel-root": { color: "#1F1F1F" },
  "& .MuiInputLabel-root.Mui-focused": {
    fontWeight: "bold",
    color: "#ED3237",
  },
  "& .MuiInput-underline:before": { borderBottomColor: "#1F1F1F" },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: "#ED3237 !important",
  },
  "& .MuiInput-underline:after": { borderBottomColor: "#ED3237" },
};
