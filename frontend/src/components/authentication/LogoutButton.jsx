import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Button } from "react-bootstrap";
const LogoutButton = () => {
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
        <Button variant="outline-dark" onClick={handleLogout}>Logout</Button>
    );
}

export default LogoutButton 