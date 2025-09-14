import React, { useState } from "react";
import api from "../../api/axios";
import { Card, Form, Button, Alert } from "react-bootstrap";

function ResetPassword() {
    const [pwSuccess, setPwSuccess] = useState(false);
    const [pwError, setPwError] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [pwForm, setPwForm] = useState({
        currentPassword: "", password: "", confirmPassword: ""
    });

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

    return (
        <Card className="shadow-sm mt-4 card-elevated">
            <Card.Header className="fw-semibold">Change Password</Card.Header>
            <Card.Body>
                {pwError && <Alert variant="danger">{pwError}</Alert>}
                {pwSuccess && <Alert variant="success">{pwSuccess}</Alert>}
                <Form onSubmit={savePassword} className="profile-form">
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
                        <Button type="submit" variant="outline-primary" disabled={pwSaving} className="btn-outline-soft">
                            {pwSaving ? "Updating..." : "Update Password"}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default ResetPassword;
