"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable, type PaginationState } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface GenericTableProps<TData> {
  columns: ColumnDef<TData, any>[]
  type: string
  onEdit: (item: TData) => void
  onAdd: () => void
  idAccessor: (item: TData) => string
  fetchFunction: (params: { page: number; pageSize: number }) => Promise<{
    items: TData[]
    totalPages: number
    totalCount: number
  }>
  deleteFunction: (id: string) => Promise<void>
  renderCustomActions?: (item: TData) => React.ReactNode
  disableAdd?: boolean
  disableEdit?: boolean
  disableDelete?: boolean
}

export function GenericTable<TData>({
  columns,
  type,
  onEdit,
  onAdd,
  idAccessor,
  fetchFunction,
  deleteFunction,
  renderCustomActions,
  disableAdd = false,
  disableEdit = false,
  disableDelete = false,
}: GenericTableProps<TData>) {
  const { toast } = useToast()
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [paginationInfo, setPaginationInfo] = useState("")
  const [itemToDelete, setItemToDelete] = useState<TData | null>(null)

  const { data, isLoading, isRefetching, error, refetch } = useQuery({
    queryKey: [type, pageIndex, pageSize],
    queryFn: () => fetchFunction({ page: pageIndex + 1, pageSize }),
    staleTime: 0,
  })

  useEffect(() => {
    if (isLoading || isRefetching) {
      setPaginationInfo("")
    } else if (data) {
      const { items, totalCount } = data
      if (totalCount === 0) {
        setPaginationInfo("No entries to show")
      } else {
        const startIndex = pageIndex * pageSize + 1
        const endIndex = startIndex + items.length - 1
        setPaginationInfo(`Showing ${startIndex} to ${endIndex} of ${totalCount} entries`)
      }
    } else {
      setPaginationInfo("No entries to show")
    }
  }, [data, isLoading, isRefetching, pageIndex, pageSize])

  const handleDelete = async () => {
    if (!itemToDelete) return
    try {
      await deleteFunction(idAccessor(itemToDelete))
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
    setItemToDelete(null)
  }

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    pageCount: data?.totalPages ?? 1,
    state: {
      pagination: { pageIndex, pageSize },
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < (data?.totalPages ?? 1) - 1 && (data?.totalCount ?? 0) > 0

  const renderPaginationButtons = () => {
    const currentPage = pageIndex + 1
    const totalPages = data?.totalPages ?? 1
    const buttons = []

    buttons.push(
      <Button key="prev" onClick={() => table.previousPage()} disabled={!canPreviousPage}>
        Prev
      </Button>,
    )

    // Always show first page
    buttons.push(
      <Button
        key={1}
        onClick={() => table.setPageIndex(0)}
        variant={currentPage === 1 ? "default" : "outline"}
        disabled={currentPage === 1}
      >
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
        <Button
          key={i}
          onClick={() => table.setPageIndex(i - 1)}
          variant={currentPage === i ? "default" : "outline"}
          disabled={currentPage === i}
        >
          {i}
        </Button>,
      )
    }

    // Show ellipsis if current page is far from the end
    if (currentPage < totalPages - 2) {
      buttons.push(<span key="ellipsis2">...</span>)
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          onClick={() => table.setPageIndex(totalPages - 1)}
          variant={currentPage === totalPages ? "default" : "outline"}
          disabled={currentPage === totalPages}
        >
          {totalPages}
        </Button>,
      )
    }

    buttons.push(
      <Button key="next" onClick={() => table.nextPage()} disabled={!canNextPage}>
        Next
      </Button>,
    )

    return buttons
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {!disableAdd && <Button onClick={onAdd}>Add New</Button>}
          <Button onClick={() => refetch()} variant="outline" disabled={isLoading || isRefetching}>
            {isLoading || isRefetching ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
        <Select value={pageSize.toString()} onValueChange={(value) => table.setPageSize(Number(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
            {isLoading || isRefetching ? (
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
            ) : data?.items && data?.items.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={idAccessor(row.original)} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {!disableEdit && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {!disableDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setItemToDelete(row.original)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the selected item from our
                                servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {renderCustomActions && renderCustomActions(row.original)}
                    </div>
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div>{paginationInfo}</div>
        <div className="flex space-x-2">{renderPaginationButtons()}</div>
      </div>
    </div>
  )
}

