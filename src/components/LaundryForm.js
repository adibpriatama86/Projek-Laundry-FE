import React, { Component } from "react";
import { Form, Button, Modal, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../css/LaundryForm.css";
import { Link } from "react-router-dom";

const Api_Url = process.env.REACT_APP_API_URL;

const formatToRupiah = (number) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  return formatter.format(number);
};



class LaundryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      laundries: [],
      newLaundry: {
        nama: "",
        tanggalMasuk: new Date(),
        tanggalKeluar: new Date(),
        jenisLaundry: "",
        tipeLaundry: "",
        hargaPerKG: "0.00",
        berat: "",
        totalHarga: "",
      },
      editingId: null,
      showPopup: false,
      confirmationModalShow: false,
      confirmationModalLaundryId: null,

    };
  }
  

  componentDidMount() {
    this.fetchLaundries();
  }
  

  fetchLaundries = async () => {
    try {
      const response = await fetch(`${Api_Url}/api/laundries`);
      if (!response.ok) {
        throw new Error("Failed to fetch laundries");
      }
      const laundries = await response.json();
      this.setState({ laundries });
    } catch (error) {
      console.error("Error fetching laundries:", error.message);
    }
  };

  handleLaundryChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      (prevState) => ({
        newLaundry: { ...prevState.newLaundry, [name]: value },
      }),
      () => {
        if (name === 'jenisLaundry' || name === 'tipeLaundry') {
          this.calculateHargaAwal();
        }
      }
    );
  };

  calculateHargaAwal = () => {
    const { jenisLaundry, tipeLaundry } = this.state.newLaundry;
    let hargaAwal = 0;

    if (jenisLaundry === 'Cuci Satuan') {
      if (tipeLaundry === 'Reguler') {
        hargaAwal = 8000;
      } else if (tipeLaundry === 'Kilat') {
        hargaAwal = 10000;
      }
    } else if (jenisLaundry === 'Cuci Kering') {
      if (tipeLaundry === 'Reguler') {
        hargaAwal = 7000;
      } else if (tipeLaundry === 'Kilat') {
        hargaAwal = 9000;
      }
    } else if (jenisLaundry === 'Cuci Komplit') {
      if (tipeLaundry === 'Reguler') {
        hargaAwal = 9000;
      } else if (tipeLaundry === 'Kilat') {
        hargaAwal = 11000;
      }
    }

    this.setState((prevState) => ({
      newLaundry: { ...prevState.newLaundry, hargaPerKG: hargaAwal.toFixed(2) },
    }));
  };

  handleDateChange = (date, fieldName) => {
    this.setState((prevState) => ({
      newLaundry: { ...prevState.newLaundry, [fieldName]: date },
    }));
  };

  calculateTotalHarga = () => {
    const { hargaPerKG, berat } = this.state.newLaundry;
    const totalHarga = parseFloat(hargaPerKG) * parseFloat(berat);
    this.setState((prevState) => ({
      newLaundry: { ...prevState.newLaundry, totalHarga: totalHarga.toFixed(2) },
    }));
  };

  addLaundry = async () => {
    const { newLaundry, editingId } = this.state;
    this.setState({ showPopup: true });

    try {
      console.log("Data yang akan dikirim ke server:", newLaundry);
      if (editingId !== null) {
        await fetch(`${Api_Url}/api/laundries/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLaundry),
        });
      } else {
        await fetch(`${Api_Url}/api/laundries`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLaundry),
        });
      }

      this.setState({
        newLaundry: {
          nama: "",
          tanggalMasuk: new Date(),
          tanggalKeluar: new Date(),
          jenisLaundry: "",
          tipeLaundry: "",
          hargaPerKG: "0.00",
          berat: "",
          totalHarga: "",
        },
        editingId: null,
      });

      this.fetchLaundries();
    } catch (error) {
      console.error("Error adding/editing laundry:", error);
    }
  };

  editLaundry = async (id) => {
    try {
      const response = await fetch(`${Api_Url}/api/laundries/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch laundry for editing");
      }
  
      const selectedLaundry = await response.json();
      this.setState({
        newLaundry: { ...selectedLaundry },
        editingId: id,
      });
    } catch (error) {
      console.error("Error fetching laundry for editing:", error);
    }
  };
  

  deleteLaundry = async (id) => {
    try {
      await fetch(`${Api_Url}/api/laundries/${id}`, {
        method: "DELETE",
      });

      this.setState({
        newLaundry: {
          nama: "",
          tanggalMasuk: new Date(),
          tanggalKeluar: new Date(),
          jenisLaundry: "",
          tipeLaundry: "",
          hargaPerKG: "0.00",
          berat: "",
          totalHarga: "",
        },
        editingId: null,
        confirmationModalLaundryId: id,
        confirmationModalShow: true,
      });

      this.fetchLaundries();
    } catch (error) {
      console.error("Error deleting laundry:", error);
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
    this.setState({ showPopup: false });
    window.location.reload();
  };


  render() {
    return (
      <div as={Link} to="laundries">
        

        <div className="laundry-form-container">
        <h2 className="laundry-form-title">Input Data Laundry</h2>
          <Form>
            <Form.Group className="laundry-form-group" controlId="formLaundryName">
              <Form.Label className="laundry-form-label">Nama:</Form.Label>
              <Form.Control
                className="laundry-form-control"
                type="text"
                name="nama"
                value={this.state.newLaundry.nama}
                onChange={this.handleLaundryChange}
                placeholder="Masukkan Nama Pelanggan"
              />
            </Form.Group>

            <Form.Group className="laundry-form-group" controlId="">
              <Form.Label className="laundry-form-label">Tanggal Masuk:</Form.Label>
              <div className="datepicker">
                <DatePicker
                  selected={new Date(this.state.newLaundry.tanggalMasuk)}
                  onChange={(date) => this.handleDateChange(date, 'tanggalMasuk')}
                  dateFormat="dd/MM/yyyy"
                  className="laundry-form-control-date"
                />
              </div>
            </Form.Group>

            <Form.Group className="laundry-form-group" controlId="">
              <Form.Label className="laundry-form-label">Tanggal Keluar:</Form.Label>
              <div className="datepicker">
                <DatePicker
                  selected={new Date(this.state.newLaundry.tanggalKeluar)}
                  onChange={(date) => this.handleDateChange(date, 'tanggalKeluar')}
                  dateFormat="dd/MM/yyyy"
                  className="laundry-form-control-date"
                />
              </div>
            </Form.Group>


            <Form.Group className="laundry-form-group" controlId="formLaundryType">
              <Form.Label className="laundry-form-label">Jenis Laundry:</Form.Label>
              <Form.Control
                className="laundry-form-control"
                as="select"
                name="jenisLaundry"
                value={this.state.newLaundry.jenisLaundry}
                onChange={this.handleLaundryChange}
              >
                <option value="" disabled>Silahkan Pilih Opsi</option>
                <option value="Cuci Satuan">Cuci Satuan</option>
                <option value="Cuci Kering">Cuci Kering</option>
                <option value="Cuci Komplit">Cuci Komplit</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="laundry-form-group" controlId="formLaundryCategory">
              <Form.Label className="laundry-form-label">Tipe Laundry:</Form.Label>
              <Form.Control
                className="laundry-form-control"
                as="select"
                name="tipeLaundry"
                value={this.state.newLaundry.tipeLaundry}
                onChange={this.handleLaundryChange}
              >
                <option value="" disabled>Silahkan Pilih Opsi</option>
                <option value="Reguler">Reguler</option>
                <option value="Kilat">Kilat</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="laundry-form-group" controlId="formLaundryPrice">
              <Form.Label className="laundry-form-label">Harga per KG:</Form.Label>
              <Form.Control
                className="laundry-form-control"
                type="text"
                name="hargaPerKG"
                value={formatToRupiah(parseFloat(this.state.newLaundry.hargaPerKG))}
                disabled
              />
            </Form.Group>

            <Form.Group className="laundry-form-group" controlId="formLaundryWeight">
              <Form.Label className="laundry-form-label">Berat:</Form.Label>
              <Form.Control
                className="laundry-form-control"
                type="text"
                name="berat"
                placeholder="Masukkan Berat Laundry"
                value={this.state.newLaundry.berat}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/[^0-9.]/g, '');

                  const noMultipleDots = onlyNums.replace(/(\..*)\./g, '$1');

                  this.setState(
                    (prevState) => ({
                      newLaundry: { ...prevState.newLaundry, berat: noMultipleDots },
                    }),
                    this.calculateTotalHarga
                );
              }}
              />
            </Form.Group>


            <Form.Group className="laundry-form-group" controlId="formLaundryTotalPrice">
              <Form.Label className="laundry-form-label">Total Harga:</Form.Label>
              <Form.Control
                className="laundry-form-control"
                type="text"
                name="totalHarga"
                value={formatToRupiah(parseFloat(this.state.newLaundry.totalHarga))}
                onChange={this.handleLaundryChange}
                disabled
              />
            </Form.Group>

            <div className="laundry-form-btn-container">
              <Button onClick={this.addLaundry} className="laundry-form-btn">
                {this.state.editingId !== null
                  ? "Simpan Perubahan"
                  : "Tambah Laundry"}
              </Button>
            </div>
          </Form>{" "}
        </div>

        <div className="table-responsive">
          <Table className="laundry-form-table-container">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Tanggal Masuk</th>
                <th>Tanggal Keluar</th>
                <th>Jenis Laundry</th>
                <th>Tipe Laundry</th>
                <th>Harga per KG</th>
                <th>Berat</th>
                <th>Total Harga</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.laundries.map((laundry) => (
                <tr key={laundry.id}>
                  <td>{laundry.id}</td>
                  <td>{laundry.nama}</td>
                  <td>{new Date(laundry.tanggalMasuk).toLocaleDateString('id-ID')}</td>
                  <td>{new Date(laundry.tanggalKeluar).toLocaleDateString('id-ID')}</td>
                  <td>{laundry.jenisLaundry}</td>
                  <td>{laundry.tipeLaundry}</td>
                  <td>{formatToRupiah(parseFloat(laundry.hargaPerKG))}</td>
                  <td>{laundry.berat} Kg</td>
                  <td>{formatToRupiah(parseFloat(laundry.totalHarga))}</td>
                  <td>
                    <div className="laundry-btn-container">
                      <Button
                        onClick={() => this.editLaundry(laundry.id)}
                        className="laundry-form-btn-table1"
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        onClick={() => this.deleteLaundry(laundry.id)}
                        className="laundry-form-btn-table2"
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

        
        {/* Pop-up */}
        <Modal show={this.state.showPopup} onHide={this.handleClosePopup}>
          <Modal.Header closeButton>
            <Modal.Title>Konfirmasi Input</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Input Laundry Berhasil!
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleClosePopup}>
              OK
            </Button>{" "}
            <Button
              variant="secondary"
              as={Link} to="/riwayat-transaksi"
            >
              Pergi ke Riwayat Transaksi
            </Button>
          </Modal.Footer>
        </Modal>
      
      </div>
    );
  }
}

export default LaundryForm;
