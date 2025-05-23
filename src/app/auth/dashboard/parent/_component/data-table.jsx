"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
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
  DialogDescription,
} from "@/components/ui/dialog";
import NewParentForm from "./new-form";
import { getColumns } from "./columns";

const API_URL = "https://si-erte-production.up.railway.app";

export function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchParent = async () => {
    try {
      const { access_token: token } = parseCookies();
      if (!token)
        throw new Error("Token tidak ditemukan. Silakan login ulang.");

      const response = await axios.get(
        `${API_URL}/auth/dashboard/parent`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal mengambil data orangtua. Pastikan Anda sudah login.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchParent();
  }, []);

  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns: getColumns(fetchParent),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-full space-y-4">
      {/* Search */}
      <div className="flex items-center">
        <Input
          placeholder="Cari nama orangtua..."
          value={table.getColumn("parent_name")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("parent_name")?.setFilterValue(e.target.value)
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
              <DialogTitle>Tambah Orangtua Baru</DialogTitle>
            </DialogHeader>
            <NewParentForm
              callback={() => {
                setIsDialogOpen(false);
                fetchParent();
              }}
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
