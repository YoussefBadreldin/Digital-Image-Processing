import React, { useState } from "react";

const Segment = () => {
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
    formData.append("action", "segment");

    const response = await fetch(
      "https://digital-image-processing-backend.vercel.app/segment",
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
      <h1>Segment a Photo</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Segment</button>
      </form>

      {resultImage && (
        <div>
          <h3>Segmented Image:</h3>
          <img src={resultImage} alt="Segmented" />
        </div>
      )}
    </div>
  );
};

export default Segment;
