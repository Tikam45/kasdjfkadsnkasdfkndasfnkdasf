"use client";

import { Pencil, Trash, Check, X, Replace } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DroppableProvided, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";

export default function Queries({
  setQueryName,
  setQuery,
  savedQueries,
  setSavedQueries,
  NameToQueries,
  setNameToQueries
}: {
  setQueryName: React.Dispatch<React.SetStateAction<string>>
  setQuery: React.Dispatch<React.SetStateAction<string>>
  savedQueries: string[];
  setSavedQueries: React.Dispatch<React.SetStateAction<string[]>>;
  NameToQueries: Map<string, string>;
  setNameToQueries: React.Dispatch<React.SetStateAction<Map<string, string>>>;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newQuery, setNewQuery] = useState("");
  const [newQueryName, setNewQueryName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedQueries = Array.from(savedQueries);
    const [movedItem] = reorderedQueries.splice(result.source.index, 1);
    reorderedQueries.splice(result.destination.index, 0, movedItem);

    setSavedQueries(reorderedQueries);
  };

  const handleEdit = (index: number, query: string) => {
    setEditingIndex(index);
    setNewQuery(query);
    setNewQueryName(NameToQueries.get(query) || "");
  };

  const handleSave = (index: number) => {
    const updatedQueries = [...savedQueries];
    const oldQuery = updatedQueries[index];
    updatedQueries[index] = newQuery;

    const updatedMap = new Map(NameToQueries);
    updatedMap.delete(oldQuery);
    updatedMap.set(newQuery, newQueryName);

    setSavedQueries(updatedQueries);
    setNameToQueries(updatedMap);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    const updatedQueries = savedQueries.filter((_, i) => i !== index);
    const updatedMap = new Map(NameToQueries);
    updatedMap.delete(savedQueries[index]);

    setSavedQueries(updatedQueries);
    setNameToQueries(updatedMap);
  };

  const filteredQueries = savedQueries.filter(q =>
    q.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{height:"300px", maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "5px", borderRadius: "4px" }}>
      <input
        type="text"
        placeholder="Search queries"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "100%", color: "white" }}
      />
      {searchTerm === "" ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="queries">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {savedQueries.map((q, index) => (
                  <Draggable key={q} draggableId={q} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          padding: "8px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          backgroundColor: "#f3f3f3",
                          color: "black",
                          ...provided.draggableProps.style
                        }}
                      >
                        {editingIndex === index ? (
                          <div>
                            <input
                              type="text"
                              value={newQuery}
                              onChange={(e) => setNewQuery(e.target.value)}
                              style={{ border: "1px solid #ccc", padding: "4px", borderRadius: "4px", marginRight: "5px", color: "black" }}
                              placeholder="Query Name"
                            />
                            <input
                              type="text"
                              value={newQueryName}
                              onChange={(e) => setNewQueryName(e.target.value)}
                              style={{ border: "1px solid #ccc", padding: "4px", borderRadius: "4px", marginRight: "5px", color: "black" }}
                              placeholder="Query"
                            />
                            <div style={{ display: "flex", gap: "15px" }}>
                              <Check size={20} cursor="pointer" onClick={() => handleSave(index)} style={{ color: "green" }} />
                              <X size={20} cursor="pointer" onClick={() => setEditingIndex(null)} style={{ color: "red" }} />
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", justifyContent: "space-between", width: "640px" }}>
                            <span style={{ color: "black" }}>{q}</span>
                            <div style={{ display: "flex", gap: "13px", color: "black" }}>
                              <Replace
                                cursor="pointer"
                                onClick={() => {
                                  const a = savedQueries[index];
                                  setQuery(NameToQueries.get(a) ?? "");
                                  setQueryName(savedQueries[index]);
                                }}
                              />
                              <Pencil size={20} cursor="pointer" onClick={() => handleEdit(index, q)} />
                              <Trash size={20} cursor="pointer" onClick={() => handleDelete(index)} style={{ color: "red" }} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filteredQueries.map((q) => {
            const originalIndex = savedQueries.indexOf(q);
            return (
              <div key={q} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#f3f3f3",
                cursor:"pointer",
                color:"black"
              }}>
                {editingIndex === originalIndex ? (
                  <div>
                    <input
                      type="text"
                      value={newQuery}
                      onChange={(e) => setNewQuery(e.target.value)}
                      style={{ border: "1px solid #ccc", padding: "4px", borderRadius: "4px", marginRight: "5px", color:"black" }}
                      placeholder="Query Name"
                    />
                    <input
                      type="text"
                      value={newQueryName}
                      onChange={(e) => setNewQueryName(e.target.value)}
                      style={{ border: "1px solid #ccc", padding: "4px", borderRadius: "4px", marginRight: "5px", color:"black" }}
                      placeholder="Query"
                    />
                    <div style={{ display: "flex", gap: "15px" }}>
                      <Check size={20} cursor="pointer" onClick={() => handleSave(originalIndex)} style={{ color: "green" }} />
                      <X size={20} cursor="pointer" onClick={() => setEditingIndex(null)} style={{ color: "red" }} />
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", width: "640px" }}>
                    <span style={{ color: "black" }}>{q}</span>
                    <div style={{ display: "flex", gap: "13px", color: "black" }}>
                      <Replace
                        cursor="pointer"
                        onClick={() => {
                          const a = savedQueries[originalIndex];
                          setQuery(NameToQueries.get(a) ?? "");
                          setQueryName(savedQueries[originalIndex]);
                        }}
                      />
                      <Pencil size={20} cursor="pointer" onClick={() => handleEdit(originalIndex, q)} />
                      <Trash size={20} cursor="pointer" onClick={() => handleDelete(originalIndex)} style={{ color: "red" }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
