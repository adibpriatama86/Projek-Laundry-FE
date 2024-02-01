import React, { useState } from "react";
import { Form, Button, Modal, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Api_Url = process.env.REACT_APP_API_URL;

const RegisterForm = ({ onRegistrationSuccess }) => {
  const navigate = useNavigate();

  const [newKaryawan, setNewKaryawan] = useState({
    nama: "",
    tanggalLahir: new Date(),
    jenisKelamin: "",
    alamat: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPasswordMismatchPopup, setShowPasswordMismatchPopup] = useState(false);
  const [showMissingFieldPopup, setShowMissingFieldPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);


  const handleKaryawanChange = (e) => {
    const { name, value } = e.target;
    setNewKaryawan((prevKaryawan) => ({
      ...prevKaryawan,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setNewKaryawan((prevKaryawan) => ({
      ...prevKaryawan,
      tanggalLahir: date,
    }));
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const addKaryawan = async () => {
    const {
      nama,
      tanggalLahir,
      jenisKelamin,
      alamat,
      email,
      password,
      confirmPassword,
    } = newKaryawan;

    // Validasi formulir
    if (!nama || !tanggalLahir || !alamat || !email || !password || !confirmPassword) {
      setShowMissingFieldPopup(true);
      return;
    }

    // Validasi password dan konfirmasi password
    if (password !== confirmPassword) {
      setShowPasswordMismatchPopup(true);
      return;
    }

    try {
      const response = await fetch(`${Api_Url}/api/karyawans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newKaryawan),
      });

      if (!response.ok) {
        throw new Error("Failed to add karyawan");
      }

      // Mengambil data pengguna yang sudah ada dari localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

      // Menambahkan pengguna baru ke array existingUsers
      const updatedUsers = [...existingUsers, { email: newKaryawan.email, password: newKaryawan.password }];

      // Menyimpan array updatedUsers ke localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      setNewKaryawan({
        nama: "",
        tanggalLahir: new Date(),
        jenisKelamin: "",
        alamat: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setShowSuccessPopup(true);
      setShowMissingFieldPopup(false); // Reset popup peringatan jika sebelumnya ditampilkan
      setShowPasswordMismatchPopup(false);

      // Panggil fungsi onRegistrationSuccess yang diterima dari prop
      onRegistrationSuccess();

      // Alihkan ke halaman Dashboard setelah registrasi berhasil
      onRegistrationSuccess();
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      console.error("Error adding karyawan:", error.message);
    }
  };


  return (
    <div>
      <h2>Registrasi Karyawan</h2>

      <div className="form-container">
        <Form>
          <Form.Group controlId="formNama">
            <Form.Label>Nama Lengkap:</Form.Label>
            <Form.Control
              type="text"
              name="nama"
              value={newKaryawan.nama}
              onChange={handleKaryawanChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="">
            <Form.Label>Tanggal Lahir</Form.Label>
            <DatePicker
              selected={newKaryawan.tanggalLahir}
              onChange={(date) => handleDateChange(date)}
              dateFormat="dd/MM/yyyy"
              className="form-control"
            />
            {newKaryawan.tanggalLahir === null && (
              <div className="text-danger">Tanggal Lahir harus diisi.</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formKaryawanKelamin">
            <Form.Label>Jenis Kelamin:</Form.Label>
            <Form.Control
              as="select"
              name="jenisKelamin"
              value={newKaryawan.jenisKelamin}
              onChange={handleKaryawanChange}
            >
              <option value="" disabled>Silahkan Pilih Jenis Kelamin Anda</option>
              <option value="Pria">Pria</option>
              <option value="Wanita">Wanita</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Label>Alamat:</Form.Label>
            <Form.Control
              type="text"
              name="alamat"
              value={newKaryawan.alamat}
              onChange={handleKaryawanChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={newKaryawan.email}
              onChange={handleKaryawanChange}
              required
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" // Pola validasi email
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password:</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                value={newKaryawan.password}
                onChange={handleKaryawanChange}
                required
              />
              <InputGroup.Text>
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={toggleShowPassword}
                />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Konfirmasi Password:</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={newKaryawan.confirmPassword}
                onChange={handleKaryawanChange}
                required
              />
              <InputGroup.Text>
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={toggleShowPassword}
                />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="button" onClick={addKaryawan}>
            Tambah Karyawan
          </Button>
        </Form>
        <div>
        Sudah punya akun?{" "}
        <Link to="/login" >
          Login
        </Link>
      </div>
      </div>

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Form login */}
          <Form>
            <Form.Group controlId="formEmailLogin">
              <Form.Label>Email:</Form.Label>
              <Form.Control type="email" placeholder="Masukkan email" />
            </Form.Group>

            <Form.Group controlId="formPasswordLogin">
              <Form.Label>Password:</Form.Label>
              <InputGroup>
                <Form.Control type={showPassword ? "text" : "password"} placeholder="Masukkan password" />
                <InputGroup.Text>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} onClick={toggleShowPassword} />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Pop-up Keberhasilan */}
      <Modal show={showSuccessPopup} onHide={() => setShowSuccessPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrasi Berhasil!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Registrasi Karyawan Telah Berhasil!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessPopup(false)}>
            OK
          </Button>{" "}
        </Modal.Footer>
      </Modal>

      {/* Pop-up Password Tidak Cocok */}
      <Modal
        show={showPasswordMismatchPopup}
        onHide={() => setShowPasswordMismatchPopup(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Password dan Konfirmasi Password Tidak Cocok</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Mohon pastikan password dan konfirmasi password cocok.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowPasswordMismatchPopup(false)}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pop-up Kolom yang Kosong */}
      <Modal
        show={showMissingFieldPopup}
        onHide={() => setShowMissingFieldPopup(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Peringatan!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Silakan isi semua kolom formulir sebelum menambahkan karyawan.</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RegisterForm;