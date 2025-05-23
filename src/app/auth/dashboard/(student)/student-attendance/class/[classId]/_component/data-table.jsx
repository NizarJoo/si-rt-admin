"use client";
import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, FileDown } from "lucide-react";
import { format } from "date-fns";
import { exportToPDF } from "@/lib/export";


// Helper aman
const safeFormat = (date) =>
  date instanceof Date && !isNaN(date) ? format(date, "yyyy-MM-dd") : "-";

export function DataTable({
  data,
  getColumns,
  dateRange,
  setDateRange,
  viewMode,
  refetch,
}) {
  const table = useReactTable({
    data: Array.isArray(data) ? data : [],
    columns: getColumns(dateRange, refetch),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: {
      dateRange,
    },
  });

  
const handleExportPDF = () => {
  const title = "Laporan Presensi Siswa";
  const headers = ["Nama", "Tanggal", "Status"];
  const rows = data.map((item) => [item.student_name, item.date, item.status]);

  const fileName = "laporan_presensi_siswa.pdf";

  exportToPDF(title, headers, rows, fileName);
};

  return (
    <div className="w-full space-y-4">
      {/* Header filter */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Cari nama siswa..."
          value={table.getColumn("student_name")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("student_name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={() => handleExportPDF(data)}><FileDown/>Export PDF</Button>

        {viewMode === "daily" ? (
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.startDate}
                  onSelect={(date) => {
                    if (date) setDateRange({ startDate: date, endDate: date });
                  }}
                />
              </PopoverContent>
            </Popover>
            <span className="text-sm">{safeFormat(dateRange.startDate)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Dari:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.startDate}
                    onSelect={(date) => {
                      if (date)
                        setDateRange((prev) => ({ ...prev, startDate: date }));
                    }}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-sm">{safeFormat(dateRange.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sampai:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.endDate}
                    onSelect={(date) => {
                      if (date)
                        setDateRange((prev) => ({ ...prev, endDate: date }));
                    }}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-sm">{safeFormat(dateRange.endDate)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
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
          {table.getRowModel().rows.length ? (
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
