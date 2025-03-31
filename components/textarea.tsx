
"use client"
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
    const getResult = () =>{
        if(!query){
            toast.error("Enter a query first");
            return;
        }
        setShowResult(query);
    }
    const saveQuery = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        e.preventDefault();
        console.log("f", query)
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
        }
        else{
            console.log("e", query);
            setSavedQueries((prev) => [...prev, queryName]);
            setNameToQueries(new Map(NameToQueries).set(queryName, query));
        }
    }
    return(
        <div style={{display: "flex", flexDirection:"column"}}>
            <form action="" style={{display: "flex", flexDirection: "column" , gap: "5px"}}>
                <input style={{backgroundColor: "gainsboro",border:"2px rounded", color: "black"}} value={queryName} onChange={(e) => setQueryName(e.target.value)}/>
                <textarea style={{backgroundColor:"gray"}} value={query} onChange={(e) => setQuery(e.target.value)}/>
            </form>
            <div style={{display: "flex", flexDirection: "column", marginTop:"5px"}}>
                <button style={{backgroundColor:"purple", borderRadius:"4px", marginBottom: "4px", cursor: "pointer"}}  onClick={getResult}>Run</button>
                <button style={{backgroundColor:"green", borderRadius:"4px", cursor: "pointer"}} onClick={(e) =>saveQuery(e)}>Save this query</button>
            </div>
        </div>
    )
}