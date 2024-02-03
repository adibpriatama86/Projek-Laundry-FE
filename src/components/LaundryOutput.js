import React, { useState } from "react";
import { Table, Button, Modal, ListGroup, Container, Row, Col } from "react-bootstrap";
import "../css/LaundryOutput.css";
import BrandingLogo from "../images/logo1.png";

const formatToRupiah = (number) => {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });
  return formatter.format(number);
};

const LaundryOutput = ({ laundries }) => {
  const [detailModalShow, setDetailModalShow] = useState(false);
  const [selectedLaundry, setSelectedLaundry] = useState(null);
  const [isPrinted, setIsPrinted] = useState(false);

  const showDetailModal = (laundry) => {
    setSelectedLaundry(laundry);
    setDetailModalShow(true);
    setIsPrinted(true);
  };

  const hideDetailModal = () => {
    setSelectedLaundry(null);
    setDetailModalShow(false);
  };

  const handleCetak = () => {
    setIsPrinted(true); // Memperbarui status sebelum mencetak
    window.print();
    hideDetailModal();
  };
  

  return (
    <div className="table-responsive">
      <Table className="laundry-output-table-container">
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
          {laundries.map((laundry) => (
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
                <div className="laundry-output-btn-container">
                  <Button
                    onClick={() => showDetailModal(laundry)}
                    className="laundry-output-btn-table"
                  >
                    Detail
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Detail Modal */}
      <Modal show={detailModalShow} onHide={hideDetailModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detail Laundry</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedLaundry && (
          <Container id="printable-area">
            <img src={BrandingLogo} alt="Branding Logo" height="80" className="mb-3" />
            <Row>
              <Col>
                <ListGroup>
                  <ListGroup.Item variant="info">
                    <strong>Informasi Umum</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>ID:</strong> {selectedLaundry.id}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Nama:</strong> {selectedLaundry.nama}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Tanggal Masuk:</strong>{' '}
                    {new Date(selectedLaundry.tanggalMasuk).toLocaleDateString('id-ID')}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Tanggal Keluar:</strong>{' '}
                    {new Date(selectedLaundry.tanggalKeluar).toLocaleDateString('id-ID')}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Jenis Laundry:</strong> {selectedLaundry.jenisLaundry}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Tipe Layanan:</strong> {selectedLaundry.tipeLaundry}
                  </ListGroup.Item>
                  <ListGroup.Item variant="info">
                    <strong>Detail Transaksi</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Harga per KG:</strong>{' '}
                    {formatToRupiah(parseFloat(selectedLaundry.hargaPerKG))}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Berat Laundry (kg):</strong> {selectedLaundry.berat}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Total Harga:</strong>{' '}
                    {formatToRupiah(parseFloat(selectedLaundry.totalHarga))}
                  </ListGroup.Item>
                  
                </ListGroup>
              </Col>
              
            </Row>
            {isPrinted && (
              <p>Dicetak pada {new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
            )}
          </Container>
        )}
      </Modal.Body>
      <Modal.Footer>
        
        <Button variant="primary" onClick={handleCetak}>
          Cetak
        </Button>
      </Modal.Footer>
    </Modal>


    </div>
  );
};

export default LaundryOutput;
