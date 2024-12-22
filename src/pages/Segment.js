import React, { useState } from "react";
import '../styles/Segment.css';

const Segmentation = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState("");
  const [resultImage, setResultImage] = useState("");
  const [segmentationType, setSegmentationType] = useState("thresholding_segmentation");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setOriginalImage(URL.createObjectURL(file));
  };

  const handleSegmentationTypeChange = (e) => {
    setSegmentationType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("action", segmentationType);

    const response = await fetch(
      `https://digital-image-processing-backend.vercel.app/segmentation/${segmentationType}`,
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
        <label>Choose Segmentation Type:</label>
        <select value={segmentationType} onChange={handleSegmentationTypeChange}>
          <option value="thresholding_segmentation">Thresholding Segmentation</option>
          <option value="watershed_segmentation">Watershed Segmentation</option>
        </select>

        <label>Upload Photo:</label>
        <input type="file" onChange={handleFileChange} />
        <p>Accepted file types: .jpg, .jpeg, .png</p>
        <button type="submit">Segment</button>
      </form>

      {originalImage && (
        <div>
          <h3>Original Image:</h3>
          <img src={originalImage} alt="Original" />
        </div>
      )}

      {resultImage && (
        <div>
          <h3>Segmented Image:</h3>
          <img src={resultImage} alt="Segmented" />
          <a href={resultImage} download="segmented_image.png">
            <button>Download Segmented Image</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default Segmentation;
