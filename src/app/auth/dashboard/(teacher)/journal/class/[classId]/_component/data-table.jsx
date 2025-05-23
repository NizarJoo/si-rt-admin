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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getColumns } from "./columns";
import useAuthAxios from "@/hooks/use-auth-axios";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import NewJournalForm from "./new-form";

const API_URL = "https://si-erte-production.up.railway.app";

export function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { classId } = useParams();
  const axios = useAuthAxios();

  const fetchJournalByClass = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/auth/dashboard/journal/classes/${classId}`
      );
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal mengambil data jurnal. Pastikan Anda sudah login.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalByClass();
  }, [classId]);

  const table = useReactTable({
    data,
    columns: getColumns(classId, fetchJournalByClass),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="h-6 bg-muted animate-pulse rounded" />
        <div className="h-6 bg-muted animate-pulse rounded" />
        <div className="h-6 bg-muted animate-pulse rounded" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4 border border-red-500 rounded bg-red-50 text-red-700">
        {error}
      </div>
    );
  }
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Cari mata pelajaran..."
          value={table.getColumn("mata_pelajaran")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("mata_pelajaran")?.setFilterValue(e.target.value)
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
              <DialogTitle>Tambah Jurnal Baru</DialogTitle>
            </DialogHeader>
            <NewJournalForm
              classId={classId}
              callback={() => {
                setIsDialogOpen(false);
                fetchJournalByClass();
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
