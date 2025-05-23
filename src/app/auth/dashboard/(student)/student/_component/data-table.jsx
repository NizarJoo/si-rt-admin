"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Import, Plus, FileDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewStudentForm from "./new-form";
import { getColumns } from "./columns";
import NewUserBulkForm from "./bulk-form";
import { exportToPDF } from "@/lib/export";

const API_URL = "https://si-erte-production.up.railway.app";

export function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setisDialogOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const fetchStudent = async () => {
    try {
      const { access_token: token } = parseCookies();
      if (!token)
        throw new Error("Token tidak ditemukan. Silakan login ulang.");

      const response = await axios.get(`${API_URL}/auth/dashboard/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal mengambil data siswa. Pastikan Anda sudah login.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudent();
  }, []);

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns: getColumns(fetchStudent),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleExportPDF = () => {
    const title = "Laporan Data Siswa";
    const headers = ["Nama", "NIS", "No. Telepon", "Orangtua", "Kelas", "Tahun"];
    const rows = data.map((item) => [
      item.student_name,
      item.nis,
      item.phone_number,
      item.parent_name,
      item.grade_name,
      item.year_start && item.year_end
        ? `${item.year_start} / ${item.year_end}`
        : "-",
    ]);

    const fileName = "data_siswa.pdf";

    exportToPDF(title, headers, rows, fileName);
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Cari nama siswa..."
          value={table.getColumn("student_name")?.getFilterValue() ?? ""}
          onChange={(student) =>
            table
              .getColumn("student_name")
              ?.setFilterValue(student.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className=" flex items-center gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setisDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Siswa Baru</DialogTitle>
            </DialogHeader>
            <NewStudentForm
              callback={() => {
                setisDialogOpen(false);
                fetchStudent();
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
          <DialogTrigger asChild>
            <Button>
              <Import />
              Import CSV
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Tambah Siswa Baru
                <DialogDescription>
                  Upload File .CSV Untuk Menambahan Data Siswa.
                </DialogDescription>
              </DialogTitle>
            </DialogHeader>
            <NewUserBulkForm
              callback={() => {
                setIsBulkOpen(false);
                fetchStudent;
              }}
            />
          </DialogContent>
        </Dialog>

        <Button onClick={() => handleExportPDF(data)}>
          <FileDown />
          Export PDF
        </Button>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Tidak ada data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-end py-4 space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
