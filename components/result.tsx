import { useEffect, useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const csvUrl =
  "https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/csv/customers.csv";

export default function Result({
  showResult
}:{
  showResult: string
}){
  const [data, setData] = useState<object[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  useEffect(() => {
    setLoading(true);
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      worker: true, 
      step: function (row: { data: object }) {
        setData((prev) => [...prev, row.data]); 
      },
      complete: function () {
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


  return (
    <div style={{marginTop: '25px'}}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div style={{marginBottom:"15px"}}>
          <button style={{backgroundColor:"purple", marginRight:"4px", padding:"3px", borderRadius:"4px"}} onClick={downloadCSV}>Download CSV</button>
          <button style={{backgroundColor:"purple", marginRight:"4px", padding:"3px", borderRadius:"4px"}} onClick={downloadExcel}>Download Excel</button>
          <button style={{backgroundColor:"purple", marginRight:"4px", padding:"3px", borderRadius:"4px"}} onClick={downloadPDF}>Download PDF</button>
          </div>
          <table border={1}>
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((val, i) => (
                  <td key={i}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display:"flex", justifyContent: "space-between", margin: "15px"}}>
        <button style={{backgroundColor:"purple", marginRight:"4px", padding:"3px", borderRadius:"4px"}} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button style={{backgroundColor:"purple", marginRight:"4px", padding:"3px", borderRadius:"4px"}} onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage * rowsPerPage >= data.length}>
          Next
        </button>
        </div>
        </div>
      )}
    </div>
  );
};

