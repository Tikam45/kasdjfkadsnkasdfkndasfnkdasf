import { useState } from "react";
import toast from "react-hot-toast";

export default function Copilot({
    setQuery
}:{
    setQuery: React.Dispatch<React.SetStateAction<string>>
}) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

    const  getResult = async() => {
    if(!input) return;

    const response = await fetch("/api/cloudflare", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: input }),
    });

    const data = await response.json();
    console.log(data);
    setResult(data?.result?.response);
  };

  const acceptResult = () => {
    setQuery(result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  return (
    <div style={{maxWidth:"300px", marginRight: "10px", marginTop: "15px"}} >
        <h2 style={{marginBottom: "20px", backgroundColor: "blue", textAlign: "center", borderRadius: "10px"}}>Get Assistance with the AI Copilot</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text here"
        style={{border: "1px solid white"}}
    />
    <button 
      style={{
        backgroundColor: "purple",
        marginRight: "4px",
        padding: "3px",
        borderRadius: "4px",
        cursor: "pointer"
        }} 
        onClick={getResult}>Get Result
    </button>

      {result && <p style={{border: "1px solid white", maxHeight: "250px", overflow: "scroll"}}>{result}</p>}

      <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "25px"}}>
        <button 
            style={{
                backgroundColor: "purple",
                marginRight: "4px",
                padding: "3px",
                borderRadius: "4px",
                cursor: "pointer"
            }}
        onClick={acceptResult} disabled={!result}>
            Accept
        </button>
        <button 
        style={{
            backgroundColor: "purple",
            marginRight: "4px",
            padding: "3px",
            borderRadius: "4px",
            cursor: "pointer"
        }} onClick={copyToClipboard} disabled={!result}>
            Copy
        </button>
      </div>
    </div>
  );
}
