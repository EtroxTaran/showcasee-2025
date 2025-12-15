import { ContactProtocol } from "@/types/customer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Phone, Mail, FileText, MapPin } from "lucide-react"

interface InteractionListProps {
    interactions: ContactProtocol[]
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
                                    {getIcon(interaction.contact_type)}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium leading-none">{interaction.contact_type}</p>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(interaction.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: interaction.summary_html || "" }} />
                                    {interaction.next_action && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <Badge variant="secondary" className="text-xs">Next: {interaction.next_action}</Badge>
                                            {interaction.next_action_deadline && (
                                                <span className="text-xs text-red-500">Due: {new Date(interaction.next_action_deadline).toLocaleDateString()}</span>
                                            )}
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
