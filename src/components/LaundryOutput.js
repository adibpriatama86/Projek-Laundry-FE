import React, { useState } from "react";
import { Table, Button, Modal, ListGroup, Container, Row, Col } from "react-bootstrap";
import "../css/LaundryOutput.css";

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
  };

  const hideDetailModal = () => {
    setSelectedLaundry(null);
    setDetailModalShow(false);
  };

  const handleCetak = () => {
    window.print();
    hideDetailModal();
    setIsPrinted(true);
  };
  

  return (
    <div className="table-responsive">
      <Table className="table-container">
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
                <Button
                  variant="info"
                  onClick={() => showDetailModal(laundry)}
                >
                  Detail
                </Button>
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
                  {isPrinted && (
                    <p>Dicetak pada {new Date().toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}</p>
                  )}
              </Col>
              
            </Row>
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
