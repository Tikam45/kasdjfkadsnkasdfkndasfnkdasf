"use client"
import { Trash } from "lucide-react";

export default function Queries({
    selectedQuery,
    setSelectedQuery,
    savedQueries,
}: {
    selectedQuery: string,
    setSelectedQuery: React.Dispatch<React.SetStateAction<string>>
    savedQueries: string[],
}){

    return(
        <>
            <select value={selectedQuery} onChange={(e) => setSelectedQuery(e.target.value)}>
                <option value="empty" >Select any saved Query</option>
                {
                    savedQueries.map((query, index) => (
                        <option value={query}>{query}</option>
                    ))
                }
            </select>
        </>
    )
}