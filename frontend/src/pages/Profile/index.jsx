// src/pages/Profile.jsx
import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card, Form, Button, Badge, Spinner, Alert, } from "react-bootstrap";
import api from "../../api/axios";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState("");
    const [pwSuccess, setPwSuccess] = useState(false)
    const [profileError, setProfileError] = useState("");
    const [pwError, setPwError] = useState(false)
    const [rawInterests, setRawInterests] = useState("");

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

    const [pwForm, setPwForm] = useState({
        currentPassword: "", password: "", confirmPassword: ""
    });

    const onSocialChange = (name, value) => {
        setProfile(p => ({ ...p, socialLinks: { ...p.socialLinks, [name]: value } }));
    };

    useEffect(() => {
        (async () => {
            try {
                const { data } = await api.get("/user/profile");
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

    const saveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setProfileError(""); setProfileSuccess("");
        try {
            const cleanedInterests = (rawInterests || "")
                .split(",")
                .map(s => s.trim())
                .filter(Boolean);;
            const dedupeCI = (arr) => {
                const seen = new Set();
                return arr.filter(it => {
                    const k = it.toLowerCase();
                    if (seen.has(k)) {
                        return false;
                    }
                    seen.add(k);
                    return true;
                });
            };

            const mergedInterests = dedupeCI([...(profile.interests || []), ...cleanedInterests]);

            const fd = new FormData();
            fd.append("firstName", user.firstName)
            fd.append("lastName", user.lastName)
            fd.append("username", user.username)
            fd.append("address", profile.address)
            fd.append("phone", profile.phone)
            fd.append("bio", profile.bio)
            fd.append("interests", JSON.stringify(mergedInterests))
            fd.append("socialLinks", JSON.stringify(profile.socialLinks))
            fd.append("image", profile.image)
            const payload = {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                address: profile.address,
                phone: profile.phone,
                bio: profile.bio,
                interests: mergedInterests,
                socialLinks: profile.socialLinks
            };
            const { data } = await api.patch("/user/profile", fd);
            setUser({
                firstName: data.user?.firstName || "",
                lastName: data.user?.lastName || "",
                username: data.user?.username || "",
                email: data.user?.email || user.email
            });
            setProfile(p => ({
                ...p,
                address: data.profile?.address || "",
                phone: data.profile?.phone || "",
                bio: data.profile?.bio || "",
                interests: Array.isArray(data.profile?.interests) ? data.profile.interests : [],
                socialLinks: {
                    github: data.profile?.socialLinks?.github || "",
                    linkedin: data.profile?.socialLinks?.linkedin || "",
                    twitter: data.profile?.socialLinks?.twitter || "",
                    website: data.profile?.socialLinks?.website || ""
                }
            }));
            setRawInterests("");
            setProfileSuccess("Profile updated successfully.");
        } catch (e) {
            setProfileError(e.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const savePassword = async (e) => {
        e.preventDefault();
        setPwSaving(true);
        setPwError(""); setPwSuccess("");
        if (pwForm.password !== pwForm.confirmPassword) {
            setPwSaving(false);
            return setPwError("New password and confirm password do not match.");
        }
        try {
            await api.patch("/user/change-password", pwForm);
            setPwSuccess("Password updated successfully.");
            setPwForm({ currentPassword: "", password: "", confirmPassword: "" });
        } catch (e) {
            setPwError(e.response?.data?.message || "Failed to update password");
        } finally {
            setPwSaving(false);
        }
    };

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
                    <Card className="shadow-sm">
                        <Card.Body className="text-center">
                            <div
                                className="bg-secondary text-white d-inline-flex align-items-center justify-content-center rounded-circle mb-3 overflow-hidden"
                                style={{ width: 120, height: 120, fontSize: 32 }}
                            >
                                {profile.avatarUrl ? <img src={profile.avatarUrl} className="h-100 w-100 object-fit-cover " alt="hello" /> : (` ${user.firstName?.[0]}  ${user.lastName?.[0]}` || "U").toUpperCase()}
                            </div>
                            <div className="text-start small">
                                <div className="mb-1"><strong>Username:</strong> <span className="text-muted">{user.username || "—"}</span></div>
                                <div className="mb-1"><strong>Email:</strong> <span className="text-muted">{user.email || "—"}</span> <Badge bg="secondary">verified</Badge></div>
                                {profile.bio && (
                                    <div className="mt-2">
                                        <strong>Bio:</strong>
                                        <div className="text-muted">{profile.bio}</div>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mt-4">
                        <Card.Header className="fw-semibold">Change Password</Card.Header>
                        <Card.Body>
                            {pwError && <Alert variant="danger">{pwError}</Alert>}
                            {pwSuccess && <Alert variant="success">{pwSuccess}</Alert>}
                            <Form onSubmit={savePassword}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Current Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={pwForm.currentPassword}
                                        onChange={(e) => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        minLength={8}
                                        value={pwForm.password}
                                        onChange={(e) => setPwForm(f => ({ ...f, password: e.target.value }))}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        minLength={8}
                                        value={pwForm.confirmPassword}
                                        onChange={(e) => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                                        required
                                    />
                                </Form.Group>
                                <div className="d-grid">
                                    <Button type="submit" variant="outline-primary" disabled={pwSaving}>
                                        {pwSaving ? "Updating..." : "Update Password"}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="fw-semibold">Profile</Card.Header>
                        <Card.Body>
                            {profileError && <Alert variant="danger">{profileError}</Alert>}
                            {profileSuccess && <Alert variant="success">{profileSuccess}</Alert>}

                            <Form onSubmit={saveProfile}>
                                <Row className="g-3">

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.firstName}
                                                onChange={(e) => setUser(u => ({ ...u, firstName: e.target.value }))}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.lastName}
                                                onChange={(e) => setUser(u => ({ ...u, lastName: e.target.value }))}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={user.username}
                                                onChange={(e) => setUser(u => ({ ...u, username: e.target.value }))}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" value={user.email} disabled />
                                            <Form.Text className="text-muted">Email is not editable.</Form.Text>
                                        </Form.Group>
                                    </Col>


                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                placeholder="+92 300 0000000"
                                                value={profile.phone}
                                                onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="City, Country"
                                                value={profile.address}
                                                onChange={(e) => setProfile(p => ({ ...p, address: e.target.value }))}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group>
                                            <Form.Label>profile photo</Form.Label>
                                            <Form.Control
                                                type="file"
                                                placeholder="upload your image here"
                                                accept="image/*"
                                                onChange={(e) => setProfile(p => ({ ...p, image: e.target.files[0] }))}
                                            />
                                        </Form.Group>
                                    </Col>


                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label>Bio</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                placeholder="Tell us a bit about yourself"
                                                value={profile.bio}
                                                onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col xs={12}>
                                        <Form.Group>
                                            <Form.Label>Interests (comma separated)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="e.g. React, Node.js, UI/UX"
                                                value={rawInterests}
                                                onChange={(e) => setRawInterests(e.target.value)}
                                            />
                                            {profile.interests.length > 0 && (
                                                <div className="mt-2">
                                                    {profile.interests.map((i, index) => (
                                                        <Badge key={`${i}-${index}`} bg="secondary" className="me-2 mb-2">
                                                            {i}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>


                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>GitHub</Form.Label>
                                            <Form.Control
                                                type="url"
                                                placeholder="https://github.com/yourname"
                                                value={profile.socialLinks.github}
                                                onChange={(e) => onSocialChange("github", e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>LinkedIn</Form.Label>
                                            <Form.Control
                                                type="url"
                                                placeholder="https://linkedin.com/in/yourname"
                                                value={profile.socialLinks.linkedin}
                                                onChange={(e) => onSocialChange("linkedin", e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Twitter</Form.Label>
                                            <Form.Control
                                                type="url"
                                                placeholder="https://twitter.com/yourname"
                                                value={profile.socialLinks.twitter}
                                                onChange={(e) => onSocialChange("twitter", e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Website</Form.Label>
                                            <Form.Control
                                                type="url"
                                                placeholder="https://yourwebsite.com"
                                                value={profile.socialLinks.website}
                                                onChange={(e) => onSocialChange("website", e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>


                                    <Col xs={12} className="d-grid mt-2">
                                        <Button type="submit" disabled={saving}>
                                            {saving ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
