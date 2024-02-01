import React, { Component } from "react";
import KaryawanOutput from "./KaryawanOutput";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from "react-bootstrap";

const Api_Url = process.env.REACT_APP_API_URL;

class DaftarKaryawan extends Component {
        constructor(props) {
          super(props);
          this.state = {
            karyawans: [],
            newKaryawan: {
              nama: "",
              tanggalLahir: new Date(),
              email: "",
              alamat: "",
            },
            editingId: null,
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
      
            this.setState({
              newKaryawan: {
                nama: "",
                tanggalLahir: new Date(),
                email: "",
                alamat: "",
              },
              editingId: null,
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
                email: selectedKaryawan.email,
                alamat: selectedKaryawan.alamat,
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
                email: "",
                alamat: "",
              },
              editingId: null,
            });
      
            this.fetchKaryawans();
          } catch (error) {
            console.error("Error deleting karyawan:", error.message);
          }
        };

        exportToExcel = () => {
          const { karyawans } = this.state;
      
          const worksheet = XLSX.utils.json_to_sheet(karyawans);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "DaftarKaryawan");
          const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          const data = new Blob([excelBuffer], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = URL.createObjectURL(data);
          const a = document.createElement("a");
          a.href = url;
          a.download = "daftar_karyawan.xlsx";
          a.click();
        };

        render() {
            return (
                <div as={Link} to="daftar-karyawan">
                    <h2>Daftar Karyawan</h2>
                    <Button onClick={this.exportToExcel}>Export to Excel</Button>
                    <KaryawanOutput
                        karyawans={this.state.karyawans}
                        editKaryawan={this.editKaryawan}
                        deleteKaryawan={this.deleteKaryawan}
                    />
                </div>
            )
        }
}

export default DaftarKaryawan;