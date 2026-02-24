import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks";
import { loginSuccess } from "../features/auth/authSlice";
import {
  saveAuthSession,
  type AuthStorageType,
} from "../features/auth/authStorage";

interface DummyJsonLoginResponse {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  image?: string;
  accessToken: string;
  refreshToken: string;
}

const loginSchema = z.object({
  username: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
  rememberMe: z.boolean(),
});

interface LoginFormValues extends z.infer<typeof loginSchema> {}

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: true,
    },
    mode: "onChange",
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username.trim(),
          password: values.password.trim(),
          expiresInMins: 30,
        }),
      });

      const data: DummyJsonLoginResponse & { message?: string } =
        await response.json();

      if (!response.ok) {
        setServerError(data.message || "Неверный логин или пароль");
        return;
      }

      const storageType: AuthStorageType = values.rememberMe
        ? "local"
        : "session";

      saveAuthSession({
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.image,
        },
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        storageType,
      });

      dispatch(
        loginSuccess({
          user: {
            id: data.id,
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            image: data.image,
          },
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          rememberMe: values.rememberMe,
        }),
      );

      navigate("/products", { replace: true });
    } catch (e) {
      setServerError("Ошибка при обращении к серверу. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Добро пожаловать
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            gutterBottom
          >
            Пожалуйста, авторизируйтесь
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2 }}
          >
            <TextField
              label="Логин"
              fullWidth
              margin="normal"
              {...register("username")}
              error={Boolean(errors.username)}
              helperText={errors.username?.message}
            />
            <TextField
              label="Пароль"
              type="password"
              fullWidth
              margin="normal"
              {...register("password")}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setValue("rememberMe", e.target.checked)}
                  color="primary"
                />
              }
              label="Запомнить данные"
            />

            {serverError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {serverError}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Вход..." : "Войти"}
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">
                Нет аккаунта?{" "}
                <Link href="#" underline="hover">
                  Создать
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
