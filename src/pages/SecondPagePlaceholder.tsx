import { Box, Container, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../features/auth/authSlice";
import { clearAuthSession } from "../features/auth/authStorage";

const SecondPagePlaceholder: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    clearAuthSession();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const fullName =
    user && (user.firstName || user.lastName)
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : user?.username;

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Вторая страница (заглушка)
          </Typography>
          {fullName && (
            <Typography variant="h6" gutterBottom>
              Вы вошли как: {fullName}
            </Typography>
          )}
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Доступ к этой странице есть только после авторизации.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleLogout}
          >
            Выйти
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default SecondPagePlaceholder;
