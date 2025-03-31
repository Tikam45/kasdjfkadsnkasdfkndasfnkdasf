"use client"

import React, { useState } from "react"
import Editor from "./textarea";
import { Toaster } from "react-hot-toast";
import ChangeQueries from "./ChangeQueries";
const Result = React.lazy(() => import('./result'));

export default function QueryEditor(){
    const [savedQueries, setSavedQueries] = useState<string[]>([]);
    const [query, setQuery] = useState("");
    const [queryName, setQueryName] = useState("");
    const [NameToQueries, setNameToQueries] = useState(new Map<string, string>());
    const [showResult, setShowResult] = useState("");

    return(
        <>
            <Toaster />
            <div style={{backgroundColor: "black", height: "100%"}}>
                <div style={{display: "flex", flexGrow:"initial", flexDirection: "row", justifyContent:"space-between"}}>
                    <Editor query={query} queryName={queryName} setQueryName={setQueryName} setQuery={setQuery}
                    savedQueries={savedQueries} setSavedQueries={setSavedQueries} NameToQueries={NameToQueries} 
                    setNameToQueries={setNameToQueries} setShowResult={setShowResult} 
                    />
                    <ChangeQueries setQueryName={setQueryName} setQuery={setQuery}
                    savedQueries={savedQueries} setSavedQueries={setSavedQueries} NameToQueries={NameToQueries} 
                    setNameToQueries={setNameToQueries}/>
                </div>
                 {
                    showResult && <Result showResult={showResult}/>
                 }
            </div>
        </>
    )
}