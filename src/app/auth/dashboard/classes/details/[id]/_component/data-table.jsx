"use client";
import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewStudentClass from "./new-form";
import { getColumns } from "./columns";
import useAuthAxios from "@/hooks/use-auth-axios";
import { useParams } from "next/navigation";

const API_URL = "https://si-erte-production.up.railway.app";

export function DataTable() {
  const params = useParams();
  const id = params.id;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const a = useAuthAxios();
  const fetchStudentClass = async () => {
    try {
      const response = await a.get(
        `${API_URL}/auth/dashboard/classes/details/${id}`
      );

      setData(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        "Gagal mengambil data tahun akademik. Pastikan Anda sudah login."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudentClass();
  }, []);

const [studentOptions, setStudentOptions] = useState([]);
const fetchStudents = async () => {

  try {
    const response = await a.get("/auth/dashboard/student");
    const options = response.data.data.map((student) => ({
      id: student.id,
      name: student.student_name,
    }));
    setStudentOptions(options);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchStudents();
  fetchStudentClass();
}, []);


  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns: getColumns(fetchStudentClass),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Cari nama siswa..."
          value={table.getColumn("student_name")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("student_name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Siswa di Kelas</DialogTitle>
            </DialogHeader>
            <NewStudentClass
              callback={() => {
                setIsDialogOpen(false);
                fetchStudentClass();
              }}
              classId={id}
              studentOptions={studentOptions}
            />
          </DialogContent>
        </Dialog>
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
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                Tidak ada data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
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
