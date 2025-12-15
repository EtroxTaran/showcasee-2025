import { Interaction } from "@/types/customer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Phone, Mail, FileText, MapPin } from "lucide-react"

interface InteractionListProps {
    interactions: Interaction[]
}

export function InteractionList({ interactions }: InteractionListProps) {
    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'call': return <Phone className="h-4 w-4" />;
            case 'email': return <Mail className="h-4 w-4" />;
            case 'visit': return <MapPin className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Interaction History</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                    {interactions.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">No interactions recorded.</p>
                    )}
                    <div className="space-y-6">
                        {interactions.map((interaction) => (
                            <div key={interaction.id} className="flex gap-4">
                                <div className="mt-1 bg-muted p-2 rounded-full h-fit">
                                    {getIcon(interaction.type)}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium leading-none capitalize">{interaction.type}</p>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(interaction.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {interaction.notes && (
                                        <div className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                                            {interaction.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
