"use client"
import { Clock, X } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Editor({
    query,
    queryName,
    setQueryName,
    setQuery,
    savedQueries,
    setSavedQueries,
    NameToQueries,
    setNameToQueries,
    setShowResult
}:{
    query: string,
    queryName: string,
    setQueryName: React.Dispatch<React.SetStateAction<string>>
    setQuery : React.Dispatch<React.SetStateAction<string>>
    savedQueries: string[],
    setSavedQueries: React.Dispatch<React.SetStateAction<string[]>>
    NameToQueries: Map<string, string>
    setNameToQueries: React.Dispatch<React.SetStateAction<Map<string,string>>>
    setShowResult: React.Dispatch<React.SetStateAction<string>>
}){
    const [queryHistory, setQueryHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const saveQuery = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault();
        if(!query || !queryName){
            toast.error("Enter all the fields");
            return;
        }
        if (savedQueries.includes(queryName)) {
            toast.error("This query name already exists");
            return;
        }
        
        let existingKey = "";
        for (const [key, value] of NameToQueries.entries()) {
            if (value === query) {
                existingKey = key;
                break;
            }
        }
        if (existingKey) {
            toast.error(`This query already exists with name ${existingKey}`);
            return;
        } else {
            setSavedQueries((prev) => [...prev, queryName]);
            setNameToQueries(new Map(NameToQueries).set(queryName, query));
        }
    };

    const handleQueryExecution = () => {
        if (!query) {
            toast.error("Enter a query first");
            return;
        }
        setShowResult(query);
        setQueryHistory(prev => [query, ...prev.slice(0, 19)]);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            <button style={{display: "flex", cursor:"pointer"}} onClick={() => setShowHistory(true)} >
            <Clock size={24} cursor="pointer"style={{ marginBottom: "10px" }} />
            <span>Show Previous Queries</span>
            </button>
            {showHistory && (
                <div style={{ 
                    position: "fixed", 
                    top: 0, 
                    left: 0, 
                    width: "100%", 
                    height: "100%", 
                    background: "rgba(0, 0, 0, 0.5)", 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center",
                    zIndex: 1000,
                    color: "black"
                }}>
                    <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: "400px", maxHeight: "80vh", overflowY: "auto", position: "relative" }}>
                        <X size={24} style={{ position: "absolute", top: 10, right: 10, cursor: "pointer" }} onClick={() => setShowHistory(false)} />
                        <h4>Query History</h4>
                        {queryHistory.length > 0 ? (
                            queryHistory.map((q, index) => (
                                <div key={index} 
                                     style={{ padding: "10px", borderBottom: "1px solid #ddd", cursor: "pointer", color:"black" }}
                                     onClick={() => { setQuery(q); setShowHistory(false); }}>
                                    {q}
                                </div>
                            ))
                        ) : (
                            <p>No queries executed yet.</p>
                        )}
                    </div>
                </div>
            )}
            
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <input placeholder="Query Name" style={{ backgroundColor: "gainsboro", border: "2px solid black", color: "black" }} value={queryName} onChange={(e) => setQueryName(e.target.value)} />
                <textarea placeholder="Query" style={{ backgroundColor: "gray" }} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", marginTop: "5px" }}>
                <button style={{ backgroundColor: "purple", borderRadius: "4px", marginBottom: "4px", cursor: "pointer" }} onClick={handleQueryExecution}>Run</button>
                <button style={{ backgroundColor: "green", borderRadius: "4px", cursor: "pointer" }} onClick={saveQuery}>Save this query</button>
            </div>
        </div>
    );
}
