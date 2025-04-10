import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


interface ResultProps {
  showResult: string;
  sortColumn: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  rowsPerPage: number;
  setSortColumn: (newCol: string) => void;
  setSortOrder: (newOrder: "asc" | "desc") => void;
  setCurrentPage: (newPage: number) => void;
  setRowsPerPage: (newRows: number) => void;
}

const csvUrl =
  "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/customers.csv";

export default function Result({
  showResult,
  sortColumn,
  sortOrder,
  currentPage,
  rowsPerPage,
  setSortColumn,
  setSortOrder,
  setCurrentPage,
  setRowsPerPage,
}: ResultProps) {
  const [data, setData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      worker: true,
      complete: function (results) {
        setData(results.data as object[]);
        setLoading(false);
      },
    });
  }, [showResult]);

  const downloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "data.csv");
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Exported Data", 20, 10);
    autoTable(doc, { head: [Object.keys(data[0] || {})], body: data.map(row => Object.values(row)) });
    doc.save("data.pdf");
  };



  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return [...data].sort((a: any, b: any) => {
      const aVal = a[sortColumn] || "";
      const bVal = b[sortColumn] || "";
      if (!isNaN(aVal) && !isNaN(bVal)) {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === "asc"
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });
  }, [data, sortColumn, sortOrder]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (column: string) => {
    let order: "asc" | "desc" = "asc";
    if (sortColumn === column) {
      order = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortColumn(column);
    setSortOrder(order);
  };


  return (
    <div style={{ marginTop: "25px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div style={{marginBottom:"15px"}}>
          <button style={{backgroundColor:"purple", marginRight:"4px", padding:"3px", borderRadius:"4px"}} onClick={downloadCSV}>Download CSV</button>
          <button style={{backgroundColor:"purple", marginRight:"4px", padding:"3px", borderRadius:"4px"}} onClick={downloadExcel}>Download Excel</button>
          <button style={{backgroundColor:"purple", marginRight:"4px", padding:"3px", borderRadius:"4px"}} onClick={downloadPDF}>Download PDF</button>
          </div>
          <label htmlFor="rows">No. of Rows per page:</label>
          <input
            style={{
              marginLeft: "15px",
              border: "2px solid white",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
            placeholder="Rows Per Page"
            type="number"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            min={1}
            id="rows"
          />
          <table border={1} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {data.length > 0 &&
                  Object.keys(data[0]).map((key) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#f0f0f0",
                        padding: "5px",
                        color: "black",
                      }}
                    >
                      {key}{" "}
                      {sortColumn === key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} style={{ padding: "5px", textAlign: "left" }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "15px",
            }}
          >
            <button
              style={{
                backgroundColor: "purple",
                marginRight: "4px",
                padding: "3px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage}/{Math.ceil(data.length / rowsPerPage)}
            </span>
            <button
              style={{
                backgroundColor: "purple",
                marginRight: "4px",
                padding: "3px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * rowsPerPage >= data.length}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
