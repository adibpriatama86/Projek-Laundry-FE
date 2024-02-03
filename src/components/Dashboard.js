import React from "react";
import { Button, Container, Row, Col, Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/Dashboard.css";
import OrderLogo from "../images/order.png";
import KaryawanLogo from "../images/karyawan.png";
import PenghasilanLogo from "../images/penghasilan.png";

const Dashboard = ({ karyawans, laundries }) => {
  const totalOrder = laundries.length;
  const totalKaryawan = karyawans.length;
  const totalPenghasilan = laundries.reduce((total, laundry) => {
    return total + parseFloat(laundry.totalHarga);
  }, 0);

  return (
    <div className="container-dashboard">
      <div className="dashboard-container">
        <Container fluid>
            <div className="dashboard-card-container">
              <Row className="mt-4 ">
                <Col xs={12}>
                  <p className="welcome-message">Selamat Datang!</p>
                  <h2 className="dashboard-title">DASHBOARD</h2>
                </Col>
                <Col>
                  <Card className="dashboard-card">
                    <Card.Body className="dashboard-card-body">
                      <Image src={OrderLogo} alt="Order Logo" className="dashboard-card-icon" />
                      <div className="dashboard-card-text">
                        <Card.Title className="dashboard-card-text">Total Order</Card.Title>
                        <Card.Text className="dashboard-card-text-funct">{totalOrder}</Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card className="dashboard-card">
                    <Card.Body className="dashboard-card-body">
                      <Image src={KaryawanLogo} alt="Order Logo" className="dashboard-card-icon" />
                      <div className="dashboard-card-text">
                        <Card.Title className="dashboard-card-text">Total Karyawan</Card.Title>
                        <Card.Text className="dashboard-card-text-funct">{totalKaryawan}</Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col>
                  <Card className="dashboard-card">
                    <Card.Body className="dashboard-card-body">
                      <Image src={PenghasilanLogo} alt="Order Logo" className="dashboard-card-icon" />
                      <div className="dashboard-card-text">
                        <Card.Title className="dashboard-card-text">Total Pendapatan</Card.Title>
                        <Card.Text className="dashboard-card-text-funct">Rp {totalPenghasilan.toLocaleString()}</Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
            
          <div className="dashboard-btn-container">
          {/* <Row className="mb-3"> */}
            <Col className="d-grid gap-2">
              <Button as={Link} to="/laundries" size="lg" className="dashboard-btn">
                <p className="dashboard-btn-text">
                  Input Laundry
                </p>
              </Button>
            </Col>
            <Col className="d-grid gap-2">
              <Button as={Link} to="/karyawans" size="lg" className="dashboard-btn">
                Input Karyawan
              </Button>
            </Col>
          {/* </Row> */}
          {/* <Row> */}
            <Col className="d-grid gap-2">
              <Button as={Link} to="/riwayat-transaksi" size="lg" className="dashboard-btn">
                Riwayat Transaksi
              </Button>
            </Col>
            <Col className="d-grid gap-2">
              <Button as={Link} to="/daftar-karyawan" size="lg" className="dashboard-btn">
                Daftar Karyawan
              </Button>
            </Col>
          {/* </Row> */}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
