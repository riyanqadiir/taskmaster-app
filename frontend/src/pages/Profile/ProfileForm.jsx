import React, { useState, useEffect } from "react";
import { Row, Col, Card, Form, Button, Badge, Alert } from "react-bootstrap";
import { updateProfile } from "../../api/profileApi";

function ProfileForm({ profile, user, setUser, setProfile }) {
    const [saving, setSaving] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState("");
    const [profileError, setProfileError] = useState("");
    const [rawInterests, setRawInterests] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    // preview selected avatar
    useEffect(() => {
        if (profile?.image && profile.image instanceof File) {
            const url = URL.createObjectURL(profile.image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
        setPreviewUrl("");
    }, [profile?.image]);

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
                    if (seen.has(k)) return false;
                    seen.add(k);
                    return true;
                });
            };

            const mergedInterests = dedupeCI([...(profile.interests || []), ...cleanedInterests]);

            const fd = new FormData();
            fd.append("firstName", user.firstName);
            fd.append("lastName", user.lastName);
            fd.append("username", user.username);
            fd.append("address", profile.address);
            fd.append("phone", profile.phone);
            fd.append("bio", profile.bio);
            fd.append("interests", JSON.stringify(mergedInterests));
            fd.append("socialLinks", JSON.stringify(profile.socialLinks));
            fd.append("image", profile.image);

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
                avatarUrl: data.profile?.avatarUrl || p.avatarUrl, // just in case backend sends it
                interests: Array.isArray(data.profile?.interests) ? data.profile.interests : [],
                socialLinks: {
                    github: data.profile?.socialLinks?.github || "",
                    linkedin: data.profile?.socialLinks?.linkedin || "",
                    twitter: data.profile?.socialLinks?.twitter || "",
                    website: data.profile?.socialLinks?.website || ""
                },
                image: "" // reset file after successful upload
            }));
            setRawInterests("");
            setPreviewUrl("");
            setProfileSuccess("Profile updated successfully.");
        } catch (e) {
            setProfileError(e.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const deleteInterest = (index) => {
        setProfile(prev => ({ ...prev, interests: prev.interests.filter((_, idx) => idx !== index) }));
    };

    return (
        <Card className="shadow-sm card-elevated">
            <Card.Header className="fw-semibold d-flex align-items-center justify-content-between">
                <span>Edit Profile</span>
                <span className="small text-muted">Make it yours ✨</span>
            </Card.Header>

            <Card.Body>
                {profileError && <Alert variant="danger">{profileError}</Alert>}
                {profileSuccess && <Alert variant="success">{profileSuccess}</Alert>}

                <Form onSubmit={saveProfile} className="profile-form">
                    <Row className="g-3">
                        {/* Names */}
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

                        {/* Username + Email */}
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

                        {/* Phone + Address */}
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

                        {/* Avatar upload + preview */}
                        <Col md={12}>
                            <Form.Group className="avatar-upload">
                                <Form.Label>Profile Photo</Form.Label>
                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setProfile(p => ({ ...p, image: e.target.files?.[0] }))}
                                    />
                                    {(previewUrl || profile.avatarUrl) && (
                                        <div className="avatar-mini">
                                            <img src={previewUrl || profile.avatarUrl} alt="preview" />
                                        </div>
                                    )}
                                </div>
                                <Form.Text className="text-muted">PNG/JPG up to ~2MB works best.</Form.Text>
                            </Form.Group>
                        </Col>

                        {/* Bio */}
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

                        {/* Interests */}
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
                                    <div className="mt-2 interests-wrap">
                                        {profile.interests.map((i, index) => (
                                            <span key={`${i}-${index}`} className="chip">
                                                {i}
                                                <button
                                                    type="button"
                                                    className="chip-close"
                                                    aria-label="Remove"
                                                    onClick={() => deleteInterest(index)}
                                                    title="Remove"
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Form.Group>
                        </Col>

                        {/* Socials */}
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
                            <Button type="submit" disabled={saving} className="btn-gradient">
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default ProfileForm;
