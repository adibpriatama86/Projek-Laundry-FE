import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../images/logo.png";

const NavbarComponent = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isRegistered");
    setIsLoggedOut(true);
    navigate("/register");
  };

  if (isLoggedOut) {
    return null; // Render nothing if logged out
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={Logo} alt="Logo" height="30" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown
              title="Aksi"
              id="basic-nav-dropdown"
              show={dropdownOpen}
              onMouseEnter={handleDropdownToggle}
              onMouseLeave={handleDropdownClose}
            >
              <Nav.Link as={Link} to="/">
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/laundries">
                Input Laundry
              </Nav.Link>
              <Nav.Link as={Link} to="/karyawans">
                Input Karyawan
              </Nav.Link>
              <Nav.Link as={Link} to="/riwayat-transaksi">
                Riwayat Transaksi
              </Nav.Link>
              <Nav.Link as={Link} to="/daftar-karyawan">
                Daftar Karyawan
              </Nav.Link>
              {/* Tambahkan tautan lainnya jika diperlukan */}
            </NavDropdown>
          </Nav>
          <Nav>
            {/* Tombol Log Out di ujung kanan */}
            <Nav.Link>
              <Button variant="danger" onClick={handleLogout}>
                Log Out
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
