import React, { useState } from "react";
import '../styles/Enhance.css';

const Enhancement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [enhancementType, setEnhancementType] = useState("gray_level_slicing");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setOriginalImage(URL.createObjectURL(file));
  };

  const handleEnhancementTypeChange = (e) => {
    setEnhancementType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("action", enhancementType);

    const response = await fetch(
      `https://digital-image-processing-backend.vercel.app/enhancement/${enhancementType}`,
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
        <label>Choose Enhancement Type:</label>
        <select value={enhancementType} onChange={handleEnhancementTypeChange}>
          <option value="gray_level_slicing">Gray Level Slicing</option>
          <option value="histogram_equalization">Histogram Equalization</option>
        </select>

        <label>Upload Photo:</label>
        <input type="file" onChange={handleFileChange} />
        <p>Accepted file types: .jpg, .jpeg, .png</p>
        <button type="submit">Enhance</button>
      </form>

      {originalImage && (
        <div>
          <h3>Original Image:</h3>
          <img src={originalImage} alt="Original" />
        </div>
      )}

      {resultImage && (
        <div>
          <h3>Enhanced Image:</h3>
          <img src={resultImage} alt="Enhanced" />
          <a href={resultImage} download="enhanced_image.png">
            <button>Download Enhanced Image</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Enhancement;
