import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLoginSuccess }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Mengambil data pengguna dari localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    
    // Mencari pengguna dengan email yang sesuai
    const user = storedUsers.find((user) => user.email === loginEmail);

    // Validasi login
    if (user && user.password === loginPassword) {
      // Berhasil login
      setError("");
      navigate("/dashboard");
      onLoginSuccess();
      window.location.reload();
    } else {
      setError("Email atau password salah");
    }
  };

  return (
    <Container>
      <h2>Login Page</h2>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </Form.Group>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button variant="primary" onClick={handleLogin}>
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
