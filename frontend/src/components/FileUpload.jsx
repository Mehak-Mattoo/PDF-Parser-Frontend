import React, { useState } from "react";
import axios from "axios";
import Translator from "./Translator";

export default function FileUploadComponent() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [result, setResult] = useState(null);
  const backendUrl = import.meta.env.VITE_AUTH_BACKEND; // Get backend URL

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError(true);
      setMessage("Please select a file.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError(true);
      setMessage("Only PDF files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post(
        `${backendUrl}/upload-pdf`, // Ensure backend endpoint is correct
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle success response
      if (response.data.success) {
        setError(false);
        setResult(response.data.text); // Assuming 'data' is the parsed content from PDF
        setMessage("File uploaded successfully!");
        console.log(response.data)
      }
    } catch (err) {
      setError(true);
      setMessage("There was an error uploading the file.");
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
        <button type="submit">Upload</button>
      </form>
      {message && (
        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            color: error ? "red" : "green",
            border: `1px solid ${error ? "red" : "green"}`,
            borderRadius: "4px",
          }}
        >
          {message}
        </div>
      )}

      {result && <Translator parsedText={result} />}
      {result && (
        <div>
          <h2>Parsed Data</h2>
          {/* If result is an object, stringify it or access specific properties */}
          {/* <p>{JSON.stringify(result)}</p> Converts object to a readable string */}

          {/* Alternatively, if you want to display specific fields */}
          {result.success && (
            <p>
              <strong>Success:</strong> {result.success ? "Yes" : "No"}
            </p>
          )}
          {result.text && (
            <p>
              <strong>Extracted Text:</strong> {result.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
