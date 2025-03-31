"use client";
import { useState } from "react";
import QueryEditor from "./tab"; 
import { Plus, X } from "lucide-react";
import { Toaster } from "react-hot-toast";

interface QueryTab {
  id: number;
  query: string;
  queryName: string;
  showResult: string;
  sortColumn: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  rowsPerPage: number;
}

export default function SQLEditors() {
  const [savedQueries, setSavedQueries] = useState<string[]>([]);
  const [nameToQueries, setNameToQueries] = useState(new Map<string, string>());

  const [tabs, setTabs] = useState<QueryTab[]>([
    {
      id: 1,
      query: "",
      queryName: "",
      showResult: "",
      sortColumn: "",
      sortOrder: "asc",
      currentPage: 1,
      rowsPerPage: 50,
    },
  ]);
  
  const [selectedTab, setSelectedTab] = useState<number>(1);

  const updateTab = (id: number, updatedData: Partial<QueryTab>) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === id ? { ...tab, ...updatedData } : tab))
    );
  };

  const closeTab = (id: number) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(updatedTabs);
    if (selectedTab === id) {
      setSelectedTab(updatedTabs.length ? updatedTabs[0].id : 0);
    }
  };

  const addTab = () => {
    const newId = tabs.length + 1;
    setTabs([
      ...tabs,
      {
        id: newId,
        query: "",
        queryName: "",
        showResult: "",
        sortColumn: "",
        sortOrder: "asc",
        currentPage: 1,
        rowsPerPage: 50,
      },
    ]);
    setSelectedTab(newId);
  };
  

  const currentTab = tabs.find((tab) => tab.id === selectedTab);

  return (
    <>
      <Toaster/>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #ccc",
          marginBottom: "10px",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              borderBottom: selectedTab === tab.id ? "2px solid blue" : "none",
            }}
          >
            <div style={{display: "flex", alignItems: "center"}}>
              Tab {tab.id}
              <span
                onClick={(e) => {
                  e.stopPropagation(); 
                  closeTab(tab.id);
                }}
                style={{
                  marginLeft: "8px",
                  color: "red",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                <X size={14} />
              </span>
            </div>
          </div>
        ))}
        <div onClick={addTab} style={{ padding: "10px", cursor: "pointer" }}>
          <Plus />
        </div>
      </div>

      {currentTab && (
        <QueryEditor
            savedQueries={savedQueries}
            setSavedQueries={setSavedQueries}
            nameToQueries={nameToQueries}
            setNameToQueries={setNameToQueries}
            query={currentTab.query}
            queryName={currentTab.queryName}
            showResult={currentTab.showResult}
            setQuery={(newQuery) =>
            updateTab(selectedTab, { query: typeof newQuery === "function" ? newQuery(currentTab?.query || "") : newQuery })
            }
            setQueryName={(newQueryName) =>
            updateTab(selectedTab, { queryName: typeof newQueryName === "function" ? newQueryName(currentTab?.queryName || "") : newQueryName })
            }
            setShowResult={(newShowResult) =>
            updateTab(selectedTab, { showResult: typeof newShowResult === "function" ? newShowResult(currentTab?.showResult || "") : newShowResult })
            }
            sortColumn={currentTab.sortColumn}
            sortOrder={currentTab.sortOrder}
            currentPage={currentTab.currentPage}
            rowsPerPage={currentTab.rowsPerPage}
            setSortColumn={(newCol) =>
            updateTab(selectedTab, { sortColumn: newCol })
            }
            setSortOrder={(newOrder) =>
            updateTab(selectedTab, { sortOrder: newOrder })
            }
            setCurrentPage={(newPage) =>
            updateTab(selectedTab, { currentPage: newPage })
            }
            setRowsPerPage={(newRows) =>
            updateTab(selectedTab, { rowsPerPage: newRows })
            }
        />
        )}

    </>
  );
}
