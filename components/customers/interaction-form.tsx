"use client"

import { useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface InteractionFormProps {
    customerId: string
}

export function InteractionForm({ customerId }: InteractionFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState<string>("call")
    const [notes, setNotes] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const supabase = createClient()
        const { error } = await supabase
            .from("interactions")
            .insert({
                customer_id: customerId,
                type,
                notes,
                date: new Date().toISOString(),
            })

        setLoading(false)

        if (error) {
            console.error("Error creating interaction:", error)
            alert("Failed to create interaction")
            return
        }

        setNotes("")
        router.refresh()
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Log Interaction</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="call">Call</SelectItem>
                                <SelectItem value="visit">Visit</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="note">Note</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Enter interaction details..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Interaction
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
