"use client";
import React, { Suspense } from "react";
import Editor from "./textarea";
import Queries from "./queries";
import Copilot from "./copilot";
const Result = React.lazy(() => import("./result"));

interface QueryEditorProps {
    savedQueries: string[];
    query: string;
    queryName: string;
    nameToQueries: Map<string, string>;
    showResult: string;
    setSavedQueries: React.Dispatch<React.SetStateAction<string[]>>;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    setQueryName: React.Dispatch<React.SetStateAction<string>>;
    setNameToQueries: React.Dispatch<React.SetStateAction<Map<string, string>>>;
    setShowResult: React.Dispatch<React.SetStateAction<string>>;
    sortColumn: string;
    sortOrder: "asc" | "desc";
    currentPage: number;
    rowsPerPage: number;
    setSortColumn: (newCol: string) => void;
    setSortOrder: (newOrder: "asc" | "desc") => void;
    setCurrentPage: (newPage: number) => void;
    setRowsPerPage: (newRows: number) => void;
  }
  

export default function QueryEditor({
    savedQueries,
    query,
    queryName,
    nameToQueries,
    showResult,
    setSavedQueries,
    setQuery,
    setQueryName,
    setNameToQueries,
    setShowResult,
    sortColumn,
    sortOrder,
    currentPage,
    rowsPerPage,
    setSortColumn,
    setSortOrder,
    setCurrentPage,
    setRowsPerPage
  }: QueryEditorProps) {


  return (
    <>
      <div style={{ backgroundColor: "black", height: "100%" }}>
        <div
          style={{
            display: "flex",
            flexGrow: "inherit",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Editor
            query={query}
            queryName={queryName}
            setQueryName={setQueryName}
            setQuery={setQuery}
            savedQueries={savedQueries}
            setSavedQueries={setSavedQueries}
            NameToQueries={nameToQueries}
            setNameToQueries={setNameToQueries}
            setShowResult={setShowResult}
          />
          <Queries
            setQueryName={setQueryName}
            setQuery={setQuery}
            savedQueries={savedQueries}
            setSavedQueries={setSavedQueries}
            NameToQueries={nameToQueries}
            setNameToQueries={setNameToQueries}
          />
          <Copilot setQuery={setQuery} />
        </div>
        {showResult && (
          <Suspense fallback={<p>Loading...</p>}>
            <Result sortColumn={sortColumn} setCurrentPage={setCurrentPage} setRowsPerPage={setRowsPerPage} rowsPerPage={rowsPerPage}
            sortOrder={sortOrder} currentPage={currentPage} setSortColumn={setSortColumn} setSortOrder={setSortOrder} showResult={showResult} />
          </Suspense>
        )}
      </div>
    </>
  );
}
