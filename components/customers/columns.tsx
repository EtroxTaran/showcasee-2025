"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Customer } from "@/types/customer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Eye, Phone, Mail } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium ml-4">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.getValue("category") as string
            return <Badge variant="outline">{category}</Badge>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const color = status === "Deal" ? "default" : status === "Lost" ? "destructive" : "secondary"
            return <Badge variant={color}>{status}</Badge>
        },
    },
    {
        accessorKey: "last_contact_date",
        header: "Last Contact",
        cell: ({ row }) => {
            const date = row.getValue("last_contact_date") as string
            if (!date) return <span className="text-muted-foreground">-</span>
            return new Date(date).toLocaleDateString()
        },
    },
    {
        accessorKey: "email",
        header: "Contact",
        cell: ({ row }) => {
            const email = row.getValue("email") as string
            const phone = row.original.phone
            return (
                <div className="flex gap-2">
                    {email && (
                        <a href={`mailto:${email}`} className="text-muted-foreground hover:text-primary">
                            <Mail className="h-4 w-4" />
                        </a>
                    )}
                    {phone && (
                        <a href={`tel:${phone}`} className="text-muted-foreground hover:text-primary">
                            <Phone className="h-4 w-4" />
                        </a>
                    )}
                </div>
            )
        }
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const customer = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(customer.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/crm/customers/${customer.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
