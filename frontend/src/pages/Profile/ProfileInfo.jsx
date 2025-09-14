import React from "react";
import { Card, Badge } from "react-bootstrap";

function ProfileInfo({ profile, user }) {
    const initials =
        (user.firstName?.[0] || "") + (user.lastName?.[0] || "");
    return (
        <Card className="shadow-sm card-elevated profile-info">
            <Card.Body className="text-center">
                <div className="avatar-wrap mx-auto mb-3">
                    <div className="avatar-ring">
                        <div className="avatar">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    className="h-100 w-100 object-fit-cover"
                                    alt="avatar"
                                />
                            ) : (
                                <span className="avatar-initials">
                                    {(initials || "U").toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <h5 className="mb-1">{user.firstName} {user.lastName}</h5>
                <div className="text-muted mb-3">@{user.username || "—"}</div>

                <div className="text-start small">
                    <div className="mb-1">
                        <strong>Email:</strong>{" "}
                        <span className="text-muted">{user.email || "—"}</span>{" "}
                        <Badge bg="success" className="badge-soft">verified</Badge>
                    </div>

                    {profile.bio && (
                        <div className="mt-3">
                            <strong>Bio</strong>
                            <div className="text-muted">{profile.bio}</div>
                        </div>
                    )}

                    {/* Quick facts */}
                    <div className="mt-3">
                        <strong>Contact</strong>
                        <div className="text-muted">
                            {profile.phone ? profile.phone : "—"}
                            {profile.address ? ` • ${profile.address}` : ""}
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
}

export default ProfileInfo;
