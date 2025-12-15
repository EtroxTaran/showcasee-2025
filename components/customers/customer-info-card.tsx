import { Customer } from "@/types/customer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface CustomerInfoCardProps {
    customer: Customer
}

export function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                        <p>{customer.contact_person || "-"}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <p>{customer.phone || "-"}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p>{customer.email || "-"}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Website</p>
                        {customer.website ? (
                            <a
                                href={customer.website.startsWith('http') ? customer.website : `https://${customer.website}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                            >
                                {customer.website} <ExternalLink className="h-3 w-3" />
                            </a>
                        ) : (
                            "-"
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Annual Revenue Target</p>
                        <p>{customer.annual_revenue_target ? `$${customer.annual_revenue_target.toLocaleString()}` : "-"}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Billing Address</p>
                        <p>{customer.billing_address || "-"}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground">Internal Notes</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{customer.notes || "No notes."}</p>
                </div>
            </CardContent>
        </Card>
    )
}
