import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NavbarComponent from './components/NavbarComponent';
import LaundryForm from "./components/LaundryForm";
import KaryawanForm from "./components/KaryawanForm";
import RiwayatTransaksi from "./components/RiwayatTransaksi";
import DaftarKaryawan from "./components/DaftarKaryawan";
import Dashboard from "./components/Dashboard";
import RegisterForm from "./components/RegisterForm";
import LoginPage from "./components/LoginPage";

const Api_Url = process.env.REACT_APP_API_URL;

const App = () => {
  const [laundries, setLaundries] = useState([]);
  const [karyawans, setKaryawans] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchLaundries = async () => {
      try {
        const response = await fetch(`${Api_Url}/api/laundries`);
        if (!response.ok) {
          throw new Error("Failed to fetch laundries");
        }
        const data = await response.json();
        setLaundries(data);
      } catch (error) {
        console.error("Error fetching laundries:", error.message);
      }
    };

    const fetchKaryawans = async () => {
      try {
        const response = await fetch(`${Api_Url}/api/karyawans`);
        if (!response.ok) {
          throw new Error("Failed to fetch karyawans");
        }
        const data = await response.json();
        setKaryawans(data);
      } catch (error) {
        console.error("Error fetching karyawans:", error.message);
      }
    };

    fetchLaundries();
    fetchKaryawans();
  }, []);

  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    setIsLoggedIn(true); // Jika registrasi berhasil, user dianggap langsung login
    localStorage.setItem("isRegistered", "true");
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };
  
  useEffect(() => {
    const storedIsRegistered = localStorage.getItem("isRegistered");
    if (storedIsRegistered === "true") {
      setIsRegistered(true);
      // setIsLoggedIn(true); 
    }
  }, []);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div>
      {(isRegistered || isLoggedIn) && <NavbarComponent />}
      <Routes>
        <Route
          path="/"
          element={
            (isLoggedIn || isRegistered) ? <Navigate to="/dashboard" /> : <RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />
          }
        />
        <Route
          path="/dashboard"
          element={<Dashboard laundries={laundries} karyawans={karyawans} />}
        />
          <Route path="/laundries" element={<LaundryForm />} />
          <Route path="/karyawans" element={<KaryawanForm />} />
          <Route path="/riwayat-transaksi" element={<RiwayatTransaksi />} />
          <Route path="/daftar-karyawan" element={<DaftarKaryawan />} />
          <Route path="/register" element={<RegisterForm onRegistrationSuccess={handleRegistrationSuccess} />} />
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
