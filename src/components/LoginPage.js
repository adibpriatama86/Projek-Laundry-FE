import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Logo from "../images/laundrygo-high-resolution-logo (1)-modified.png";
import "../css/LoginPage.css";

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
    <div className="form-login-container">
      <div className="logo-login-container">
        <img src={Logo} className="logo-login" alt="logo" />
      </div>
      <h2 className="title-login">Login</h2>
      <Form>
        <Form.Group controlId="formBasicEmail" className="form-group-login">
          <Form.Label className="form-label-login">Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Masukkan Alamat Email Anda"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            className="form-control-login"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="form-group-login">
          <Form.Label className="form-label-login">Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Masukkan Password Anda"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            className="form-control-login"
          />
        </Form.Group>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="btn-login-container">
          <Button className="btn-login" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
