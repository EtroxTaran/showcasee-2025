import { Customer } from "@/types/customer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Edit, MapPin } from "lucide-react"

interface CustomerDetailHeaderProps {
    customer: Customer
}

export function CustomerDetailHeader({ customer }: CustomerDetailHeaderProps) {
    return (
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={customer.image_url || ""} alt={customer.name} />
                    <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-2xl font-bold">{customer.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{customer.address || "No address provided"}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{customer.category}</Badge>
                        <Badge>{customer.status}</Badge>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                    <a href={`tel:${customer.phone}`}>
                        <Phone className="h-4 w-4" />
                    </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                    <a href={`mailto:${customer.email}`}>
                        <Mail className="h-4 w-4" />
                    </a>
                </Button>
                <Button>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
            </div>
        </div>
    )
}
