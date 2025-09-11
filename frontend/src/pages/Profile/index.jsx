// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import ResetPassword from "./ResetPassword";
import ProfileInfo from "./ProfileInfo";
import ProfileForm from "./ProfileForm";
import {fetchProfile} from "../../api/profileApi"
export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        firstName: "", lastName: "", username: "", email: ""
    });
    const [profile, setProfile] = useState({
        address: "",
        phone: "",
        bio: "",
        avatarUrl: "",
        interests: [],
        socialLinks: {
            github: "", linkedin: "", twitter: "", website: ""
        },
        image: ""
    });

    useEffect(() => {
        (async () => {
            try {
                const { data } = await fetchProfile();
                setUser({
                    firstName: data.user?.firstName || "",
                    lastName: data.user?.lastName || "",
                    username: data.user?.username || "",
                    email: data.user?.email || ""
                });
                setProfile(p => ({
                    ...p,
                    address: data.profile?.address || "",
                    phone: data.profile?.phone || "",
                    bio: data.profile?.bio || "",
                    avatarUrl: data.profile?.avatarUrl,
                    interests: Array.isArray(data.profile?.interests) ? data.profile.interests : [],
                    socialLinks: {
                        github: data.profile?.socialLinks?.github || "",
                        linkedin: data.profile?.socialLinks?.linkedin || "",
                        twitter: data.profile?.socialLinks?.twitter || "",
                        website: data.profile?.socialLinks?.website || ""
                    }
                }));
            } catch (e) {
                setProfileError(e.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <Container className="py-4">
                <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4 overflow-scroll">
            <Row className="g-4">
                <Col lg={4}>
                    <ProfileInfo profile={profile} user={user} />
                    <ResetPassword />
                </Col>
                <Col lg={8}>
                    <ProfileForm user={user} setUser={setUser} profile={profile} setProfile={setProfile} />
                </Col>
            </Row>
        </Container>
    );
}
