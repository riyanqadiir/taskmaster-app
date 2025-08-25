import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await api.post("/user/logout");

            if (response.status === 200) {
                localStorage.removeItem("accessToken");
                navigate("/login");
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
        </Button>
    );
}
