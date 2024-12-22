import React, { useState } from "react";
import '../styles/Enhance.css'; 

const Enhance = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState("");
  const [resultImages, setResultImages] = useState([]);
  const [enhancementTypes, setEnhancementTypes] = useState({
    gray_slicing: false,
    histogram_equalization: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (file && validTypes.includes(file.type)) {
      setSelectedFile(file);
      setError(""); // Clear any previous errors
    } else {
      setError("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      setSelectedFile(null);
    }
  };

  const handleEnhancementTypeChange = (e) => {
    const { name, checked } = e.target;
    setEnhancementTypes((prevTypes) => ({
      ...prevTypes,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true); // Show loading spinner
    setOriginalImage(URL.createObjectURL(selectedFile)); // Set original image here

    let formData = new FormData();
    formData.append("image", selectedFile);

    const newResultImages = [];

    // Loop through the selected enhancement types (gray-level slicing, histogram equalization)
    for (const [enhancementType, isSelected] of Object.entries(enhancementTypes)) {
      if (isSelected) {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/enhance/${enhancementType === "gray_slicing" ? "gray-slice" : "histogram"}`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          const imageURL = URL.createObjectURL(blob);
          newResultImages.push({
            type: enhancementType === "gray_slicing" ? "Gray-Level Slicing" : "Histogram Equalization",
            url: imageURL,
          });
        } catch (error) {
          console.error("Error fetching API:", error);
          setError("Failed to process the image. Please try again.");
        }
      }
    }

    setResultImages(newResultImages);
    setLoading(false); // Hide loading spinner
  };

  return (
    <div className="page-container">
      <h1>Enhance a Photo</h1>
      <form onSubmit={handleSubmit}>
        <label>Choose Enhancement Techniques:</label>
        <div>
          <label>
            <input
              type="checkbox"
              name="gray_slicing"
              checked={enhancementTypes.gray_slicing}
              onChange={handleEnhancementTypeChange}
            />
            Gray-Level Slicing
          </label>
          <label>
            <input
              type="checkbox"
              name="histogram_equalization"
              checked={enhancementTypes.histogram_equalization}
              onChange={handleEnhancementTypeChange}
            />
            Histogram Equalization
          </label>
        </div>

        <label>Upload Photo:</label>
        <input type="file" onChange={handleFileChange} />
        <p>Accepted file types: .jpg, .jpeg, .png, .webp</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Enhance</button>
      </form>

      {loading && <div className="loading-spinner"></div>}

      <div className="image-display">
        {!loading && originalImage && (
          <div className="original-image">
            <h3>Original Image</h3>
            <img src={originalImage} alt="Original" />
          </div>
        )}

        {!loading && resultImages.length > 0 && resultImages.map((image, index) => (
          <div className="enhanced-image" key={index}>
            <h3>{image.type}</h3>
            <img src={image.url} alt={`${image.type}`} />
            <a href={image.url} download={`${image.type}_enhanced_image`}>
              <button>Download</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Enhance;
