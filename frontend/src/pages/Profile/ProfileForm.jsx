import React, { useState } from "react";
import { Row, Col, Card, Form, Button, Badge, Alert, } from "react-bootstrap";
import { updateProfile } from "../../api/profileApi"

function ProfileForm({ profile, user, setUser, setProfile }) {
    const [saving, setSaving] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState("");
    const [profileError, setProfileError] = useState("");
    const [rawInterests, setRawInterests] = useState("");


    const onSocialChange = (name, value) => {
        setProfile(p => ({ ...p, socialLinks: { ...p.socialLinks, [name]: value } }));
    };
    const saveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setProfileError("");
        setProfileSuccess("");
        try {
            const cleanedInterests = (rawInterests || "")
                .split(",")
                .map(s => s.trim())
                .filter(Boolean);
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

            const { data } = await updateProfile(fd);
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
    const deleteInterest = (index) => {
        setProfile((prev) => {
            return { ...prev, interests: prev.interests.filter((i, idx) => idx != index) }
        })

    }
    return (
        <>
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
                                                <Badge
                                                    key={`${i}-${index}`}
                                                    bg="secondary"
                                                    className="mb-2 position-relative me-2 px-3 py-2 d-inline-flex align-items-center"
                                                >
                                                    {i}
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-white position-absolute top-0 end-0 m-1"
                                                        aria-label="Remove"
                                                        onClick={() => deleteInterest(index)}
                                                        style={{ fontSize: "0.65rem" }}
                                                    />
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
        </>
    )
}

export default ProfileForm