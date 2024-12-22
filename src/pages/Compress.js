import React, { useState } from "react";
import '../styles/Compress.css';

const Compress = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState("");
  const [resultImages, setResultImages] = useState([]);
  const [compressionTypes, setCompressionTypes] = useState({
    jpeg_compression: false,
    webp_compression: false,
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

  const handleCompressionTypeChange = (e) => {
    const { name, checked } = e.target;
    setCompressionTypes((prevTypes) => ({
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

    // Loop through the selected compression types
    for (const [compressionType, isSelected] of Object.entries(compressionTypes)) {
      if (isSelected) {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/compress/${compressionType === "jpeg_compression" ? "jpeg" : "webp"}`,
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
            type: compressionType === "jpeg_compression" ? "JPEG" : "WEBP",
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
      <h1>Compress a Photo</h1>
      <form onSubmit={handleSubmit}>
        <label>Choose Compression Technique:</label>
        <div>
          <label>
            <input
              type="checkbox"
              name="jpeg_compression"
              checked={compressionTypes.jpeg_compression}
              onChange={handleCompressionTypeChange}
            />
            JPEG Compression
          </label>
          <label>
            <input
              type="checkbox"
              name="webp_compression"
              checked={compressionTypes.webp_compression}
              onChange={handleCompressionTypeChange}
            />
            WEBP Compression
          </label>
        </div>

        <label>Upload Photo:</label>
        <input type="file" onChange={handleFileChange} />
        <p>Accepted file types: .jpg, .jpeg, .png, .webp</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Compress</button>
      </form>

      {loading && <div className="loading-spinner"></div>}

      <div className="image-display">
        {!loading && originalImage && (
          <div className="compressed-image">
            <h3>Original Image</h3>
            <img src={originalImage} alt="Original" />
          </div>
        )}

        {!loading && resultImages.length > 0 && resultImages.map((image, index) => (
          <div className="compressed-image" key={index}>
            <h3>{image.type} Compressed</h3>
            <img src={image.url} alt={`${image.type} Compressed`} />
            <a href={image.url} download={`${image.type}_compressed_image`}>
              <button>Download</button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compress;
