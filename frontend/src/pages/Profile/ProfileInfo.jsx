import React from 'react'
import { Card ,Badge} from "react-bootstrap";
function ProfileInfo({ profile,user }) {
    return (
        <>
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
        </>
    )
}

export default ProfileInfo