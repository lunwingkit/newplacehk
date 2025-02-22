"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { useToast } from "@/components/ui/use-toast"
import { fetchUsers, fetchEvents, fetchNews, deleteUser, deleteEvent, deleteNews } from "@/lib/api"

interface GenericTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  type: "users" | "events" | "news"
  onEdit: (item: TData) => void
  onAdd: () => void
  idAccessor: (item: TData) => string
}

type DataType = 'users' | 'events' | 'news'

const apiFunctions = {
  users: { fetch: fetchUsers, delete: deleteUser },
  events: { fetch: fetchEvents, delete: deleteEvent },
  news: { fetch: fetchNews, delete: deleteNews },
}

export function GenericTable<TData>({
  columns,
  type,
  onEdit,
  onAdd,
  idAccessor,
}: GenericTableProps<TData>) {
  const { toast } = useToast()

  const { fetch: fetchFunction, delete: deleteFunction } = apiFunctions[type]

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [type],
    queryFn: fetchFunction,
  })

  const handleDelete = async (item: TData) => {
    try {
      await deleteFunction(idAccessor(item))
      toast({
        title: "Item deleted",
        description: "The item has been successfully deleted.",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the item. Please try again.",
        variant: "destructive",
      })
    }
  }

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const renderPaginationButtons = () => {
    const currentPage = table.getState().pagination.pageIndex + 1
    const totalPages = table.getPageCount()
    const buttons = []

    buttons.push(
      <Button key="prev" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
        Prev
      </Button>,
    )

    // Always show first page
    buttons.push(
      <Button key={1} onClick={() => table.setPageIndex(0)} variant={currentPage === 1 ? "default" : "outline"}>
        1
      </Button>,
    )

    // Show ellipsis if current page is far from the start
    if (currentPage > 3) {
      buttons.push(<span key="ellipsis1">...</span>)
    }

    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue // Skip first and last page as they're always shown
      buttons.push(
        <Button key={i} onClick={() => table.setPageIndex(i - 1)} variant={currentPage === i ? "default" : "outline"}>
          {i}
        </Button>,
      )
    }

    // Show ellipsis if current page is far from the end
    if (currentPage < totalPages - 2) {
      buttons.push(<span key="ellipsis2">...</span>)
    }

    // Always show last page
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          onClick={() => table.setPageIndex(totalPages - 1)}
          variant={currentPage === totalPages ? "default" : "outline"}
        >
          {totalPages}
        </Button>,
      )
    }

    buttons.push(
      <Button key="next" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        Next
      </Button>,
    )

    return buttons
  }

  return (
    <div>
      <Button onClick={onAdd} className="mb-4">
        Add New
      </Button>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-4 animate-spin mr-2" />
                    <span>Loading...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center text-red-500">
                  Error loading data. Please try again.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={idAccessor(row.original)} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4">{renderPaginationButtons()}</div>
    </div>
  )
}
