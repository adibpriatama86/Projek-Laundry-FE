import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../images/logo.png";
import "../css/NavbarComponent.css";
import LogOutBtn from "../images/logout.png";

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
    return null;
  }

  return (
    <Navbar expand="lg" className="navbar-container">
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
              className="dropdown"
            >
              <Nav.Link as={Link} to="/" className="navbar-link-item">
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/laundries" className="navbar-link-item">
                Input Laundry
              </Nav.Link>
              <Nav.Link as={Link} to="/karyawans" className="navbar-link-item">
                Input Karyawan
              </Nav.Link>
              <Nav.Link as={Link} to="/riwayat-transaksi" className="navbar-link-item">
                Riwayat Transaksi
              </Nav.Link>
              <Nav.Link as={Link} to="/daftar-karyawan" className="navbar-link-item">
                Daftar Karyawan
              </Nav.Link>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link>
              <Button className="navbar-btn" onClick={handleLogout}>
                <span className="button-icon">
                  <img src={LogOutBtn} alt="Logout" height="25" />
                </span>
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
