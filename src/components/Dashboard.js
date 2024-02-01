import React from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/Dashboard.css";

const Dashboard = ({ karyawans, laundries }) => {
  const totalOrder = laundries.length;
  const totalKaryawan = karyawans.length;
  const totalPenghasilan = laundries.reduce((total, laundry) => {
    return total + parseFloat(laundry.totalHarga);
  }, 0);

  return (
    <div>
      <Container fluid>
        <Row className="mt-4">
          <Col xs={12}>
            <p className="welcome-message">Selamat Datang</p>
            <h2 className="dashboard-title">DASHBOARD</h2>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Total Order</Card.Title>
                <Card.Text>{totalOrder}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card>
              <Card.Body>
                <Card.Title>Total Karyawan</Card.Title>
                <Card.Text>{totalKaryawan}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
          <Card>
              <Card.Body>
                <Card.Title>Total Penghasilan</Card.Title>
                <Card.Text>Rp {totalPenghasilan.toLocaleString()}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col className="d-grid gap-2">
            <Button as={Link} to="/laundries" variant="primary" size="lg">
              Input Laundry
            </Button>
          </Col>
          <Col className="d-grid gap-2">
            <Button as={Link} to="/karyawans" variant="primary" size="lg">
              Input Karyawan
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-grid gap-2">
            <Button as={Link} to="/riwayat-transaksi" variant="primary" size="lg">
              Riwayat Transaksi
            </Button>
          </Col>
          <Col className="d-grid gap-2">
            <Button as={Link} to="/daftar-karyawan" variant="primary" size="lg">
              Daftar Karyawan
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
