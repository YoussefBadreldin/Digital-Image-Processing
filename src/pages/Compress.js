import React, { useState } from "react";

const Compress = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImage, setResultImage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("action", "compress");

    const response = await fetch(
      "https://digital-image-processing-backend.vercel.app/compress",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    setResultImage(data.result);
  };

  return (
    <div className="page-container">
      <h1>Compress a Photo</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Compress</button>
      </form>

      {resultImage && (
        <div>
          <h3>Compressed Image:</h3>
          <img src={resultImage} alt="Compressed" />
        </div>
      )}
    </div>
  );
};

export default Compress;
