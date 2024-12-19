import React, { useState } from "react";

const Enhance = () => {
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
    formData.append("action", "enhance");

    const response = await fetch(
      "https://digital-image-processing-backend.vercel.app/enhance",
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
      <h1>Enhance a Photo</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Enhance</button>
      </form>

      {resultImage && (
        <div>
          <h3>Enhanced Image:</h3>
          <img src={resultImage} alt="Enhanced" />
        </div>
      )}
    </div>
  );
};

export default Enhance;
