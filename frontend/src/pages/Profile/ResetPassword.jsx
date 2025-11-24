import React, { useState } from "react";
import api from "../../api/axios";
import { Card, Form, Button, Alert } from "react-bootstrap";

function ResetPassword() {
    const [pwSuccess, setPwSuccess] = useState(false);
    const [pwError, setPwError] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [validated, setValidated] = useState(false);

    const [pwForm, setPwForm] = useState({
        currentPassword: "",
        password: "",
        confirmPassword: ""
    });

    const savePassword = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setValidated(true);
        setPwError(""); 
        setPwSuccess("");

        // ❗ Bootstrap HTML validation
        if (form.checkValidity() === false) {
            e.stopPropagation();
            return;
        }

        // ❗ Custom password match validation
        if (pwForm.password !== pwForm.confirmPassword) {
            setPwError("New password and confirm password do not match.");
            return;
        }

        setPwSaving(true);

        try {
            await api.patch("/user/change-password", pwForm);
            setPwSuccess("Password updated successfully.");

            setPwForm({
                currentPassword: "",
                password: "",
                confirmPassword: ""
            });

            setValidated(false);
        } catch (e) {
            setPwError(e.response?.data?.message || "Failed to update password");
        } finally {
            setPwSaving(false);
        }
    };

    return (
        <Card className="shadow-sm mt-4 card-elevated">
            <Card.Header className="fw-semibold">Change Password</Card.Header>

            <Card.Body>
                {pwError && <Alert variant="danger">{pwError}</Alert>}
                {pwSuccess && <Alert variant="success">{pwSuccess}</Alert>}

                <Form noValidate validated={validated} onSubmit={savePassword} className="profile-form">
                    
                    {/* Current Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="currentPassword"
                            value={pwForm.currentPassword}
                            onChange={(e) =>
                                setPwForm(f => ({ ...f, currentPassword: e.target.value }))
                            }
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Current password is required.
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* New Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            minLength={8}
                            value={pwForm.password}
                            onChange={(e) =>
                                setPwForm(f => ({ ...f, password: e.target.value }))
                            }
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            New password must be at least 8 characters.
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Confirm Password */}
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            minLength={8}
                            value={pwForm.confirmPassword}
                            onChange={(e) =>
                                setPwForm(f => ({ ...f, confirmPassword: e.target.value }))
                            }
                            required
                            isInvalid={
                                validated &&
                                pwForm.confirmPassword &&
                                pwForm.password !== pwForm.confirmPassword
                            }
                        />
                        <Form.Control.Feedback type="invalid">
                            {pwForm.password !== pwForm.confirmPassword
                                ? "Passwords do not match."
                                : "Confirm password is required."}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {/* Button */}
                    <div className="d-grid">
                        <Button
                            type="submit"
                            variant="outline-primary"
                            disabled={pwSaving}
                            className="btn-outline-soft"
                        >
                            {pwSaving ? "Updating..." : "Update Password"}
                        </Button>
                    </div>

                </Form>
            </Card.Body>
        </Card>
    );
}

export default ResetPassword;
