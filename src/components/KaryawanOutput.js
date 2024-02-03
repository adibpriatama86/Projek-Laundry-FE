import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import QRCode from "qrcode.react";
import "../css/KaryawanOutput.css";

const KaryawanOutput = ({ karyawans }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [selectedKaryawan, setSelectedKaryawan] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState("");
  const [displayQRCode, setDisplayQRCode] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const handleShowPasswordModal = (karyawan) => {
    setSelectedKaryawan(karyawan);
    setShowPasswordModal(true);
    setShowQRCodeModal(false);
  };

  const handleShowQRCodeModal = (karyawan) => {
    setSelectedKaryawan(karyawan);
    setConfirmPassword(""); // Reset password sebelum menampilkan modal
    setShowQRCodeModal(true);
    setShowPasswordModal(false);
  };

  const handleClosePasswordModal = () => {
    setSelectedKaryawan(null);
    setConfirmPassword("");
    setShowPasswordModal(false);
    setDisplayPassword("");
  };

  const handleCloseQRCodeModal = () => {
    setSelectedKaryawan(null);
    setShowQRCodeModal(false);
    setDisplayQRCode("");
  };

  const handleConfirmPassword = () => {
    if (confirmPassword === selectedKaryawan.password) {
      setDisplayPassword(selectedKaryawan.password);
      // Tidak perlu menampilkan QR Code di sini
    } else {
      setShowAlert(true);
    }
  };

  const handleConfirmPasswordQR = () => {
    if (confirmPassword === selectedKaryawan.password) {
      // Menampilkan QR Code setelah konfirmasi password berhasil
      setDisplayQRCode(`ID: ${selectedKaryawan.id}, Nama: ${selectedKaryawan.nama}`);
    } else {
      setShowAlert(true);
    }
  };

  return (
    <div className="table-responsive">
      <Table className="karyawan-output-table-container">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Tanggal Lahir</th>
            <th>Email</th>
            <th>Alamat</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {karyawans.map((karyawan) => (
            <tr key={karyawan.id}>
              <td>{karyawan.id}</td>
              <td>{karyawan.nama}</td>
              <td>{new Date(karyawan.tanggalLahir).toLocaleDateString('id-ID')}</td>
              <td>{karyawan.email}</td>
              <td>{karyawan.alamat}</td>
              <td>
                <div className="karyawan-output-btn-container">
                  <Button
                    onClick={() => handleShowPasswordModal(karyawan)}
                    className="karyawan-output-table-btn1"
                  >
                    Lihat Password
                  </Button>
                  <Button
                    onClick={() => handleShowQRCodeModal(karyawan)}
                    className="karyawan-output-table-btn2"
                  >
                    QR Code
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* QR Code Modal */}
      <Modal show={showQRCodeModal} onHide={handleCloseQRCodeModal}>
        <Modal.Header closeButton>
          <Modal.Title>QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {displayQRCode ? (
            <div>
              <p>QR Code untuk {selectedKaryawan.nama}:</p>
              <QRCode value={displayQRCode} />
            </div>
          ) : (
            <div>
              <Form.Group controlId="confirmPasswordQR">
                <Form.Label>Konfirmasi Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleConfirmPasswordQR}>
                OK
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Password Modal */}
      <Modal show={showPasswordModal} onHide={handleClosePasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {displayPassword ? (
            <div>
              <p>Password:</p>
              <p>{displayPassword}</p>
            </div>
          ) : (
            <div>
              <Form.Group controlId="confirmPassword">
                <Form.Label>Konfirmasi Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleConfirmPassword}>
                OK
              </Button>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Alert Modal */}
      <Modal show={showAlert} onHide={() => setShowAlert(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Password Konfirmasi Tidak Cocok</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Mohon pastikan password konfirmasi sesuai dengan akun karyawan.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAlert(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KaryawanOutput;
