// src/pages/Home.js
import React, { useState, useRef } from "react";
import '../styles/Home.css';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState("");
  const [resultImages, setResultImages] = useState([]);
  const [selectedTechnique, setSelectedTechnique] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("about");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    if (file && validTypes.includes(file.type)) {
      setSelectedFile(file);
      setError("");
    } else {
      setError("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
      setSelectedFile(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleChangeFile = () => {
    setSelectedFile(null);
    setOriginalImage("");
    setResultImages([]);
    fileInputRef.current.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setError("");
      } else {
        setError("Invalid file type. Please upload a JPEG, PNG, or WebP image.");
        setSelectedFile(null);
      }
    }
  };

  const handleTechniqueChange = (e) => {
    setSelectedTechnique(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedTechnique) return;

    setLoading(true);
    setOriginalImage(URL.createObjectURL(selectedFile));

    let formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/enhance/${selectedTechnique}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.image) {
        const imageURL = `data:image/jpeg;base64,${data.image}`;
        const result = {
          type: getEnhancementTypeName(selectedTechnique),
          description: getEnhancementDescription(selectedTechnique),
          url: imageURL,
        };

        // Add visualization data if available
        if (selectedTechnique === 'histogram_equalization' && data.histogram_original && data.histogram_equalized) {
          result.histogramOriginal = `data:image/png;base64,${data.histogram_original}`;
          result.histogramEqualized = `data:image/png;base64,${data.histogram_equalized}`;
        } else if (selectedTechnique === 'gray_level_slicing' && data.transform_plot && data.histogram_plot) {
          result.transformPlot = `data:image/png;base64,${data.transform_plot}`;
          result.histogramPlot = `data:image/png;base64,${data.histogram_plot}`;
        }

        setResultImages([result]);
      } else {
        throw new Error(data.error || "Failed to process image");
      }
    } catch (error) {
      console.error("Error fetching API:", error);
      setError("Failed to process the image. Please try again.");
    }

    setLoading(false);
  };

  const getEnhancementTypeName = (type) => {
    const names = {
      histogram_equalization: "Histogram Equalization",
      gray_level_slicing: "Gray-level Slicing",
      power_law: "Power-Law (Gamma) Transformation",
      negative: "Negative Transformation"
    };
    return names[type] || type;
  };

  const getEnhancementDescription = (type) => {
    const descriptions = {
      histogram_equalization: "Improves image contrast by spreading out the most frequent intensity values",
      gray_level_slicing: "Highlights specific ranges of gray levels while preserving others",
      power_law: "Applies gamma correction to adjust image brightness and contrast",
      negative: "Inverts the image colors to create a negative effect"
    };
    return descriptions[type] || "";
  };

  return (
    <div className="home-container">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About Project
        </button>
        <button 
          className={`tab ${activeTab === 'enhance' ? 'active' : ''}`}
          onClick={() => setActiveTab('enhance')}
        >
          Image Enhancement
        </button>
      </div>

      {activeTab === 'about' ? (
        <div className="about-section">
          <h1>Image Enhancement Toolkit</h1>
          <div className="project-info">
            <h2>Project Overview</h2>
            <p>This web application implements various image enhancement techniques to improve the quality of low-resolution images. The toolkit includes four different enhancement methods:</p>
            <ul className="techniques-list">
              <li>
                <strong>Histogram Equalization:</strong> Improves image contrast by spreading out the most frequent intensity values.
              </li>
              <li>
                <strong>Gray-level Slicing:</strong> Highlights specific ranges of gray levels while preserving others.
              </li>
              <li>
                <strong>Power-Law (Gamma) Transformation:</strong> Applies gamma correction to adjust image brightness and contrast.
              </li>
              <li>
                <strong>Negative Transformation:</strong> Inverts the image colors to create a negative effect.
              </li>
            </ul>

            <h2>Developed by</h2>
            <ul className="team-list">
              <li>20100294 - Youssef Mohamed Badreldin</li>
              <li>22100951 - Alhassan Mohamed Elsayed</li>
              <li>22100859 - Hicham Hussein Mohamed</li>

            </ul>
          </div>
        </div>
      ) : (
        <div className="enhancement-section">
          <div className="upload-container">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
            {!selectedFile ? (
              <div 
                className="upload-box" 
                onDragOver={(e) => e.preventDefault()} 
                onDrop={handleDrop}
                onClick={handleUploadClick}
              >
                <div className="upload-content">
                  <i className="upload-icon">📁</i>
                  <p>Drag and drop an image here or click to select</p>
                  <p className="file-types">Supported formats: JPG, PNG, WebP</p>
                </div>
              </div>
            ) : (
              <div className="selected-file">
                <div className="selected-file-content">
                  <img src={URL.createObjectURL(selectedFile)} alt="Selected" className="preview-image" />
                  <div className="file-info">
                    <p className="file-name">{selectedFile.name}</p>
                    <button className="change-file-button" onClick={handleChangeFile}>
                      Change File
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="enhancement-options">
            <h3>Select Enhancement Technique</h3>
            <div className="options-grid">
              {[
                { id: 'histogram_equalization', name: 'Histogram Equalization', description: 'Improves image contrast by spreading out the most frequent intensity values' },
                { id: 'gray_level_slicing', name: 'Gray-level Slicing', description: 'Highlights specific ranges of gray levels while preserving others' },
                { id: 'power_law', name: 'Power-Law (Gamma) Transformation', description: 'Applies gamma correction to adjust image brightness and contrast' },
                { id: 'negative', name: 'Negative Transformation', description: 'Inverts the image colors to create a negative effect' }
              ].map((technique) => (
                <label key={technique.id} className="option-card">
                  <input
                    type="radio"
                    name="technique"
                    value={technique.id}
                    checked={selectedTechnique === technique.id}
                    onChange={handleTechniqueChange}
                  />
                  <div className="option-content">
                    <h4>{technique.name}</h4>
                    <p>{technique.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button 
            className="enhance-button"
            onClick={handleSubmit}
            disabled={!selectedFile || !selectedTechnique || loading}
          >
            {loading ? 'Processing...' : 'Enhance Image'}
          </button>

          {loading && <div className="loading-spinner"></div>}

          <div className="results-container">
            {!loading && originalImage && (
              <div className="image-comparison">
                <div className="comparison-row">
                  <div className="image-card">
                    <h3>Original Image</h3>
                    <div className="image-wrapper">
                      <img src={originalImage} alt="Original" />
                    </div>
                    {resultImages[0]?.histogramOriginal && (
                      <div className="histogram-wrapper">
                        <h4>Original Histogram</h4>
                        <img src={resultImages[0].histogramOriginal} alt="Original Histogram" />
                      </div>
                    )}
                  </div>

                  {resultImages.map((image, index) => (
                    <div className="image-card" key={index}>
                      <h3>{image.type}</h3>
                      <div className="image-wrapper">
                        <img src={image.url} alt={image.type} />
                      </div>
                      {image.histogramEqualized && (
                        <div className="histogram-wrapper">
                          <h4>Enhanced Histogram</h4>
                          <img src={image.histogramEqualized} alt="Enhanced Histogram" />
                        </div>
                      )}
                      {image.transformPlot && (
                        <div className="histogram-wrapper">
                          <h4>Transformation Plot</h4>
                          <img src={image.transformPlot} alt="Transformation Plot" />
                        </div>
                      )}
                      {image.histogramPlot && (
                        <div className="histogram-wrapper">
                          <h4>Histogram Comparison</h4>
                          <img src={image.histogramPlot} alt="Histogram Comparison" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {resultImages[0] && (
                  <div className="download-container">
                    <a href={resultImages[0].url} download={`${resultImages[0].type.toLowerCase().replace(/\s+/g, '_')}_enhanced.png`}>
                      <button className="download-button">Download Enhanced Image</button>
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
