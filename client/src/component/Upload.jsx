import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const UploadForm = ({ onUpload, isLoading, progress }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState(null);

  // Refs for GSAP animations
  const dropZoneRef = useRef(null);
  const uploadButtonRef = useRef(null);
  const errorRef = useRef(null);
  const previewRef = useRef(null);
  const containerRef = useRef(null);

  // GSAP animations on mount
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    )
    .fromTo(dropZoneRef.current,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
      "-=0.2"
    );
  }, []);

  // Handle file selection and preview
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);

        // Animate preview appearance
        gsap.fromTo(previewRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
        );
      };
      reader.readAsDataURL(file);

      // Animate button
      gsap.to(uploadButtonRef.current, {
        scale: 1.02,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    } else {
      setError("Please select a valid image file");
      animateError();
    }
  };

  const handleClickUpload = (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image first");
      animateError();
      return;
    }
    // Call the onUpload prop with the actual image file
    onUpload(image);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) {
      setIsDragOver(true);
      gsap.to(dropZoneRef.current, {
        scale: 1.01,
        borderColor: "#2563eb",
        backgroundColor: "#eff6ff",
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    gsap.to(dropZoneRef.current, {
      scale: 1,
      borderColor: "#e5e7eb",
      backgroundColor: "#ffffff",
      duration: 0.2,
      ease: "power2.out"
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
    gsap.to(dropZoneRef.current, {
      borderColor: "#e5e7eb",
      backgroundColor: "#ffffff",
      duration: 0.2,
      ease: "power2.out"
    });
  };

  // Error animation
  const animateError = () => {
    if (errorRef.current) {
      gsap.fromTo(errorRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <div
        ref={dropZoneRef}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div ref={previewRef} className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={() => {
                setPreview(null);
                setImage(null);
                setError(null);
              }}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 mb-4 text-gray-400">
              <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your image here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-colors"
            >
              Select Image
            </label>
          </div>
        )}
      </div>

      {error && (
        <div
          ref={errorRef}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {preview && (
        <div className="mt-6">
          <button
            ref={uploadButtonRef}
            onClick={handleClickUpload}
            disabled={isLoading}
            className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing Image...
              </>
            ) : (
              'Analyze Equipment'
            )}
          </button>
          
          {isLoading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadForm;
