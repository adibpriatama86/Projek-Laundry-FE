import React, { Component } from "react";
import { Form, Button, Modal, InputGroup, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../css/KaryawanForm.css";

const Api_Url = process.env.REACT_APP_API_URL;

class KaryawanForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      karyawans: [],
      newKaryawan: {
        nama: "",
        tanggalLahir: new Date(),
        jenisKelamin: "",
        alamat: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      editingId: null,
      showPopup: false,
      showPassword: false,
      showSuccessPopup: false,
      showPasswordMismatchPopup: false,
      confirmationModalShow: false,
      confirmationModalKaryawanId: null,
      showMissingFieldPopup: false,
    };
  }

  componentDidMount() {
    this.fetchKaryawans();
  }

  fetchKaryawans = async () => {
    try {
      const response = await fetch(`${Api_Url}/api/karyawans`);
      if (!response.ok) {
        throw new Error("Failed to fetch karyawans");
      }
      const karyawans = await response.json();
      this.setState({ karyawans });
    } catch (error) {
      console.error("Error fetching karyawans:", error.message);
    }
  };

  handleKaryawanChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newKaryawan: { ...prevState.newKaryawan, [name]: value },
    }));
  };
  

  handleDateChange = (date, fieldName) => {
    this.setState((prevState) => ({
      newKaryawan: { ...prevState.newKaryawan, [fieldName]: date },
    }));
  };

  addKaryawan = async () => {
    const {
      nama,
      tanggalLahir,
      jenisKelamin,
      alamat,
      email,
      password,
      confirmPassword,
    } = this.state.newKaryawan;
  
    // Validasi formulir
    if (!nama || !tanggalLahir || !alamat || !email || !password || !confirmPassword) {
      this.setState({ showMissingFieldPopup: true });
      return;
    }
  
    // Validasi password dan konfirmasi password
    if (password !== confirmPassword) {
      this.setState({ showPasswordMismatchPopup: true });
      return;
    }
  
    try {
      const { newKaryawan, editingId } = this.state;
  
      const response = await fetch(
        `${Api_Url}/api/karyawans${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newKaryawan),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to add/edit karyawan");
      }
  
      // Mengambil data pengguna yang sudah ada dari localStorage
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  
      // Menambahkan pengguna baru ke array existingUsers
      const updatedUsers = [...existingUsers, { email: newKaryawan.email, password: newKaryawan.password }];
  
      // Menyimpan array updatedUsers ke localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));
  
      this.setState({
        newKaryawan: {
          nama: "",
          tanggalLahir: new Date(),
          jenisKelamin: "",
          alamat: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
        editingId: null,
        showSuccessPopup: true,
        showMissingFieldPopup: false, // Reset popup peringatan jika sebelumnya ditampilkan
      });
  
      this.fetchKaryawans();
    } catch (error) {
      console.error("Error adding/editing karyawan:", error.message);
    }
  };
  
  
  
  

  editKaryawan = async (id) => {
    try {
      const response = await fetch(`${Api_Url}/api/karyawans/${id}`);
      const selectedKaryawan = await response.json();

      this.setState({
        newKaryawan: {
          id: selectedKaryawan.id,
          nama: selectedKaryawan.nama,
          tanggalLahir: new Date(selectedKaryawan.tanggalLahir),
          jenisKelamin: selectedKaryawan.jenisKelamin,
          alamat: selectedKaryawan.alamat,
          email: selectedKaryawan.email,
          password: selectedKaryawan.password,
          confirmPassword: selectedKaryawan.confirmPassword,
        },
        editingId: id,
      });
    } catch (error) {
      console.error("Error fetching karyawan for editing:", error.message);
    }
  };

  deleteKaryawan = async (id) => {
    try {
      await fetch(`${Api_Url}/api/karyawans/${id}`, {
        method: "DELETE",
      });

      this.setState({
        newKaryawan: {
          nama: "",
          tanggalLahir: new Date(),
          jenisKelamin: "",
          alamat: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
        editingId: null,
        confirmationModalKaryawanId: id,
        confirmationModalShow: true,
      });

      this.fetchKaryawans();
    } catch (error) {
      console.error("Error deleting karyawan:", error.message);
    }
  };

  handleCloseConfirmationModal = () => {
    this.setState({
      confirmationModalShow: false,
      confirmationModalLaundryId: null,
    });
  };

  handleClosePopup = () => {
    // Close the pop-up
    this.setState({ showPopup: false, showSuccessPopup: false });
    window.location.reload();
  };
  

  toggleShowPassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  render() {
    return (
      <div>

        <div className="karyawan-form-container">
        <h2 className="karyawan-form-title">Daftar Karyawan</h2>
          <Form>
            <Form.Group controlId="formNama" className="karyawan-form-group">
              <Form.Label className="karyawan-form-label">Nama Lengkap:</Form.Label>
              <Form.Control
                type="text"
                name="nama"
                value={this.state.newKaryawan.nama}
                onChange={this.handleKaryawanChange}
                required
                className="karyawan-form-control"
                placeholder="Masukkan Nama Lengkap Anda"
              />
            </Form.Group>

            <Form.Group className="karyawan-form-group" controlId="" >
              <Form.Label className="karyawan-form-label">Tanggal Lahir</Form.Label>
              <div className="datepicker">
                <DatePicker
                  selected={this.state.newKaryawan.tanggalLahir}
                  onChange={(date) => this.handleDateChange(date, 'tanggalLahir')}
                  dateFormat="dd/MM/yyyy"
                  className="karyawan-form-control-date"

                />
              </div>
              {this.state.newKaryawan.tanggalLahir === null && (
                <div className="text-danger">Tanggal Lahir harus diisi.</div>
              )}
            </Form.Group>


            <Form.Group className="karyawan-form-group" controlId="formKaryawanKelamin">
              <Form.Label className="karyawan-form-label">Jenis Kelamin:</Form.Label>
              <Form.Control
                as="select"
                name="jenisKelamin"
                value={this.state.newKaryawan.jenisKelamin}
                onChange={this.handleKaryawanChange}
                className="karyawan-form-control"
              >
                <option value="" disabled>Silahkan Pilih Jenis Kelamin Anda</option>
                <option value="Pria">Pria</option>
                <option value="Wanita">Wanita</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formAddress" className="karyawan-form-group">
              <Form.Label className="karyawan-form-label">Alamat:</Form.Label>
              <Form.Control
                type="text"
                name="alamat"
                value={this.state.newKaryawan.alamat}
                onChange={this.handleKaryawanChange}
                required
                className="karyawan-form-control"
                placeholder="Masukkan Alamat Domisili Anda"
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="karyawan-form-group">
              <Form.Label className="karyawan-form-label">Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={this.state.newKaryawan.email}
                onChange={this.handleKaryawanChange}
                required
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                className="karyawan-form-control"
                placeholder="Masukkan Alamat Email Anda"
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="karyawan-form-group">
              <Form.Label className="karyawan-form-label">Password:</Form.Label>
              <InputGroup>
                <Form.Control
                  type={this.state.showPassword ? "text" : "password"}
                  name="password"
                  value={this.state.newKaryawan.password}
                  onChange={this.handleKaryawanChange}
                  required
                  className="karyawan-form-control"
                  placeholder="Buat Password Anda"
                />
                <InputGroup.Text>
                  <FontAwesomeIcon
                    icon={this.state.showPassword ? faEyeSlash : faEye}
                    onClick={this.toggleShowPassword}
                    className="form-control-eye"
                  />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="karyawan-form-group">
              <Form.Label className="karyawan-form-label">Konfirmasi Password:</Form.Label>
              <InputGroup>
                <Form.Control
                  type={this.state.showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={this.state.newKaryawan.confirmPassword}
                  onChange={this.handleKaryawanChange}
                  required
                  className="karyawan-form-control"
                  placeholder="Konfirmasi Password Anda"
                />
                <InputGroup.Text>
                  <FontAwesomeIcon
                    icon={this.state.showPassword ? faEyeSlash : faEye}
                    onClick={this.toggleShowPassword}
                className="form-control-eye"
                  />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <div className="karyawan-form-btn-container">
              <Button className="karyawan-form-btn" type="button" onClick={this.addKaryawan}>
                {this.state.editingId !== null
                  ? "Simpan Perubahan"
                  : "Tambah Karyawan"}
              </Button>
            </div>
          </Form>
        </div>

        <div className="table-responsive">
          <Table className="karyawan-form-table-container">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Tanggal Lahir</th>
                <th>Jenis Kelamin</th>
                <th>Email</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {this.state.karyawans.map((karyawan) => (
                <tr key={karyawan.id}>
                  <td>{karyawan.id}</td>
                  <td>{karyawan.nama}</td>
                  <td>{new Date(karyawan.tanggalLahir).toLocaleDateString('id-ID')}</td>
                  <td>{karyawan.jenisKelamin}</td>
                  <td>{karyawan.email}</td>
                  <td>{karyawan.alamat}</td>
                  <td>
                    <div className="karyawan-btn-container">
                      <Button
                        onClick={() => this.editKaryawan(karyawan.id)}
                        className="karyawan-table-btn1"
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        onClick={() => this.deleteKaryawan(karyawan.id)}
                        className="karyawan-table-btn2"
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Modal show={this.state.showMissingFieldPopup} onHide={() => this.setState({ showMissingFieldPopup: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Peringatan!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Silakan isi semua kolom formulir sebelum menambahkan karyawan.</p>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.confirmationModalShow}
          onHide={this.handleCloseConfirmationModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi Hapus</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Data telah berhasil dihapus!
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleCloseConfirmationModal}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>


        {/* Pop-up Keberhasilan */}
        <Modal show={this.state.showSuccessPopup} onHide={() => this.setState({ showSuccessPopup: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Input Karyawan Berhasil!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Input Data Karyawan Telah Berhasil!</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.handleClosePopup}>
              OK
            </Button>{" "}
            <Button
              variant="secondary"
              as={Link} to="/daftar-karyawan"
            >
              Pergi ke Daftar Karyawan
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Pop-up Password Tidak Cocok */}
        <Modal show={this.state.showPasswordMismatchPopup} onHide={() => this.setState({ showPasswordMismatchPopup: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Password dan Konfirmasi Password Tidak Cocok</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Mohon pastikan password dan konfirmasi password cocok.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.setState({ showPasswordMismatchPopup: false })}>
              Tutup
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    );
  }
}

export default KaryawanForm;
