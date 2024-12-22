import React, { useState } from "react";
import '../styles/Segment.css'; // Ensure to add the related styles

const Segment = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState("");
  const [segmentedImages, setSegmentedImages] = useState([]);
  const [segmentationTypes, setSegmentationTypes] = useState({
    watershed_segmentation: false,
    thresholding: false,
  });
  const [thresholdValue, setThresholdValue] = useState(128); // Default threshold value
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

  const handleSegmentationTypeChange = (e) => {
    const { name, checked } = e.target;
    setSegmentationTypes((prevTypes) => ({
      ...prevTypes,
      [name]: checked,
    }));
  };

  const handleThresholdChange = (e) => {
    setThresholdValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true); // Show loading spinner
    setOriginalImage(URL.createObjectURL(selectedFile)); // Set original image here

    let formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("threshold", thresholdValue); // Pass threshold value for thresholding technique

    const newSegmentedImages = [];

    // Loop through the selected segmentation types (Watershed Segmentation and Thresholding)
    for (const [segmentationType, isSelected] of Object.entries(segmentationTypes)) {
      if (isSelected) {
        try {
          const endpoint = segmentationType === "watershed_segmentation" ? "watershed" : "thresholding";
          const response = await fetch(
            `http://127.0.0.1:5000/segment/${endpoint}`,
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
          newSegmentedImages.push({
            type: segmentationType === "watershed_segmentation" ? "Watershed Segmentation" : "Thresholding",
            url: imageURL,
          });
        } catch (error) {
          console.error("Error fetching API:", error);
          setError("Failed to process the image. Please try again.");
        }
      }
    }

    setSegmentedImages(newSegmentedImages);
    setLoading(false); // Hide loading spinner
  };

  return (
    <div className="page-container">
      <h1>Segment a Photo</h1>
      <form onSubmit={handleSubmit}>
        <label>Choose Segmentation Techniques:</label>
        <div>
          <label>
            <input
              type="checkbox"
              name="watershed_segmentation"
              checked={segmentationTypes.watershed_segmentation}
              onChange={handleSegmentationTypeChange}
            />
            Watershed
          </label>
          <label>
            <input
              type="checkbox"
              name="thresholding"
              checked={segmentationTypes.thresholding}
              onChange={handleSegmentationTypeChange}
            />
            Thresholding
          </label>
        </div>

        {segmentationTypes.thresholding && (
          <div>
            <label>
              Set Threshold Value:
              <input
                type="range"
                min="0"
                max="255"
                value={thresholdValue}
                onChange={handleThresholdChange}
              />
              <span>{thresholdValue}</span>
            </label>
          </div>
        )}

        <label>Upload Photo:</label>
        <input type="file" onChange={handleFileChange} />
        <p>Accepted file types: .jpg, .jpeg, .png, .webp</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Segment</button>
      </form>

      {loading && <div className="loading-spinner"></div>}

      <div className="image-display">
        {!loading && originalImage && (
          <div className="original-image">
            <h3>Original Image</h3>
            <img src={originalImage} alt="Original" />
          </div>
        )}

        {!loading && segmentedImages.length > 0 && segmentedImages.map((image, index) => (
          <div className="segmented-image" key={index}>
            <h3>{image.type} Result</h3>
            <img src={image.url} alt={`${image.type} Result`} />
            <a href={image.url} download={`${image.type}_segmented_image`}>
              <button>Download</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Segment;
