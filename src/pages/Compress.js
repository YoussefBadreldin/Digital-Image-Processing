import React, { useState } from "react";

const Compress = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [compressionType, setCompressionType] = useState("jpeg_compression");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setOriginalImage(URL.createObjectURL(file));
  };

  const handleCompressionTypeChange = (e) => {
    setCompressionType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("action", compressionType);

    const response = await fetch(
      `https://digital-image-processing-backend.vercel.app/compress/${compressionType}`,
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
        <label>Choose Compression Type:</label>
        <select value={compressionType} onChange={handleCompressionTypeChange}>
          <option value="jpeg_compression">JPEG Compression</option>
          <option value="webp_compression">WEBP Compression</option>
        </select>

        <label>Upload Photo:</label>
        <input type="file" onChange={handleFileChange} />
        <p>Accepted file types: .jpg, .jpeg, .png</p>
        <button type="submit">Compress</button>
      </form>

      {originalImage && (
        <div>
          <h3>Original Image:</h3>
          <img src={originalImage} alt="Original" />
        </div>
      )}

      {resultImage && (
        <div>
          <h3>Compressed Image:</h3>
          <img src={resultImage} alt="Compressed" />
          <a href={resultImage} download="compressed_image.png">
            <button>Download Compressed Image</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Compress;
