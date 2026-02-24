import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "../../features/auth/authStorage";
import { logout } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks";

const LogoutButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    // <Button variant="outlined" color="primary" sx={{ mt: 3 }}>
    <Button
      variant="contained"
      onClick={handleLogout}
      sx={{
        borderRadius: 3,
        textTransform: "none",
        fontWeight: 600,
        px: 2.5,
        backgroundColor: "#ce140e",
        "&:hover": {
          backgroundColor: "#b2120c",
        },
      }}
    >
      Выйти
    </Button>
  );
};

export default LogoutButton;
