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
import NewClassForm from "./new-form";
import { getColumns } from "./columns";
import useAuthAxios from "@/hooks/use-auth-axios";
import { useRouter } from "next/navigation";

const API_URL = "https://si-erte-production.up.railway.app";

export function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const a = useAuthAxios()
  const fetchClass = async () => {
    try {
      const response = await a.get(
        `${API_URL}/auth/dashboard/classes`,
      );

      setData(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal mengambil data tahun akademik. Pastikan Anda sudah login.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchClass();
  }, []);

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns: getColumns(fetchClass),
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
          placeholder="Cari nama kelas..."
          value={table.getColumn("grade_name")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("grade_name")?.setFilterValue(e.target.value)
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
              <DialogTitle>Tambah Tahun Akademik Baru</DialogTitle>
            </DialogHeader>
            <NewClassForm
              callback={() => {
                setIsDialogOpen(false);
                fetchClass();
              }}
            />
          </DialogContent>
        </Dialog>
        <Button onClick={() => router.push("/auth/dashboard/classes/grade")}>
          Lihat Daftar Kelas
        </Button>
        <Button
          onClick={() => router.push("/auth/dashboard/classes/academic-year")}
        >
          Lihat Tahun Akademik
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
