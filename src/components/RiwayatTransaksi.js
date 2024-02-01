import React, { Component } from "react";
import LaundryOutput from "./LaundryOutput";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from "react-bootstrap";

const Api_Url = process.env.REACT_APP_API_URL;


class RiwayatTransaksi extends Component {

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
          });
    
          this.fetchLaundries();
        } catch (error) {
          console.error("Error deleting laundry:", error);
        }
      };

      exportToExcel = () => {
        const { laundries } = this.state;
    
        const worksheet = XLSX.utils.json_to_sheet(laundries);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "RiwayatTransaksi");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = "riwayat_transaksi.xlsx";
        a.click();
      };

  render() {
    return (
      <div as={Link} to="riwayat-transaksi">
        <h2>Riwayat Transaksi</h2>
        <Button onClick={this.exportToExcel}>Export to Excel</Button>
        <LaundryOutput
          laundries={this.state.laundries}
          editLaundry={this.editLaundry}
          deleteLaundry={this.deleteLaundry}
        />
      </div>
    );
  }
}

export default RiwayatTransaksi;
