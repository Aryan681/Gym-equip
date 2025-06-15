import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import UploadForm from "../component/Upload";
import ExerciseCard from "../component/cards/Excersice";
import Loader from "../component/common/loading/Loader";
import FeatureCard from "../component/common/FeatureCard";
import axios from "axios";

// Register GSAP plugins
gsap.registerPlugin(MotionPathPlugin, TextPlugin, ScrollTrigger);

const Home = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Refs for GSAP animations
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const resultsRef = useRef(null);
  const heroIconRef = useRef(null);

  // Create refs for floating orbs (fixed number of refs)
  const orb0Ref = useRef(null);
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const orb4Ref = useRef(null);
  const orb5Ref = useRef(null);
  const orb6Ref = useRef(null);
  const orb7Ref = useRef(null);

  // Create floating orbs data
  const floatingOrbsData = useRef([]);
  
  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    const orbRefs = [orb0Ref, orb1Ref, orb2Ref, orb3Ref, orb4Ref, orb5Ref, orb6Ref, orb7Ref];

    floatingOrbsData.current = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      ref: orbRefs[i],
      size: Math.random() * 30 + 20,
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: Math.random() * 0.2 + 0.1
    }));
  }, []);

  // Initial animations
  useEffect(() => {
    // Hero icon floating animation
    gsap.to(heroIconRef.current, {
      y: 10,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    // Floating orbs animation
    floatingOrbsData.current.forEach((orb) => {
      gsap.to(orb.ref.current, {
        x: `+=${(Math.random() - 0.5) * 100}`,
        y: `+=${(Math.random() - 0.5) * 100}`,
        duration: orb.speed * 50,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        repeatRefresh: true
      });
    });

    // Title typing animation
    gsap.to(titleRef.current, {
      text: {
        value: "Gym Equipment AI Assistant",
        speed: 0.5,
        delimiter: ""
      },
      duration: 1.5,
      ease: "power2.in"
    });

    // Subtitle animation with floating letters
    const subtitleChars = subtitleRef.current.textContent.split(/(\s+)/);
  subtitleRef.current.textContent = "";
  
  subtitleChars.forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    
    // Only apply inline-block to non-whitespace characters
    if (char.trim() !== "") {
      span.style.display = "inline-block";
      
      gsap.from(span, {
        y: 40,
        opacity: 0,
        rotation: 10,
        duration: 0.6,
        delay: i * 0.03,
        ease: "back.out(3)"
      });
    } else {
      // For whitespace, just add a normal space
      span.style.whiteSpace = "pre";
    }
    
    subtitleRef.current.appendChild(span);
  });

  
    
  }, []);

  // Results animation
  useEffect(() => {
    if (data && resultsRef.current) {
      setIsLoading(false);
      
      // Results container animation
      gsap.from(resultsRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      // Exercise cards animation with 3D flip effect
      const cards = resultsRef.current.querySelectorAll('.exercise-card');
      gsap.from(cards, {
        opacity: 0,
        y: 50,
        rotationX: 90,
        transformOrigin: "50% 50% -50px",
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: cards[0],
          start: "top 80%"
        }
      });
    }
  }, [data]);

  const handleUpload = async (file) => {
    setIsLoading(true);
    setUploadProgress(0);
    
    console.log('Uploading file:', file?.name);
    console.log('Loading state:', isLoading);
    
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${BASE_URL}/api/combo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
          console.log('Upload progress:', progress);
        }
      });

      setUploadProgress(100);
      console.log('Upload complete, setting data');
      
      // Ensure we have an array of exercises
      if (res.data && Array.isArray(res.data)) {
        setData(res.data);
      } else if (res.data && res.data.exercises && Array.isArray(res.data.exercises)) {
        // If the API returns an object with an exercises array
        setData(res.data.exercises);
      } else {
        // If the response is not in the expected format, set a default array
        console.warn('API response not in expected format:', res.data);
        setData([
          { 
            name: "No exercises found", 
            muscles: ["Please try another image"], 
            tip: "Make sure the image contains clear gym equipment",
            video: null
          }
        ]);
      }
      setIsLoading(false); // Set loading to false after data is set

    } catch (error) {
      console.error("Upload failed:", error);
      setIsLoading(false);
      // Set a default error state
      setData([
        { 
          name: "Error processing image", 
          muscles: ["Please try again"], 
          tip: "Make sure the image is clear and contains gym equipment",
          video: null
        }
      ]);
    }
  };

  // Add a useEffect to monitor loading state changes
  useEffect(() => {
    console.log('Loading state changed:', isLoading);
  }, [isLoading]);

  return (
    <div
      className="min-h-screen bg-white relative overflow-hidden"
    >
      {/* Floating orbs */}
      {floatingOrbsData.current.map((orb) => (
        <div
          key={orb.id}
          ref={orb.ref}
          className="absolute rounded-full opacity-10 mix-blend-multiply pointer-events-none"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `radial-gradient(circle, ${orb.id % 2 === 0 ? '#2563eb' : '#7c3aed'} 0%, transparent 70%)`,
            filter: 'blur(12px)'
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-12 mt-4 mb-20 md:mb-32">
          {/* Left Column - Text Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <div 
              ref={heroIconRef}
              className="inline-block md:inline-flex mb-10 p-6 bg-white rounded-3xl shadow-xl transform transition-all duration-1000 ease-in-out hover:scale-105"
            >
              <div className="w-24 h-24 flex items-center justify-center mx-auto md:mx-0">
                <img src="/icon.jpg" alt="Gym Equipment AI Assistant Icon" className="w-20 h-20 object-contain" />
              </div>
            </div>
            
            <h1
              ref={titleRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight"
            >
              Your Ultimate <br className="hidden sm:inline"/> <span className="text-gradient">AI Gym Partner</span>
            </h1>
            
            <p
              ref={subtitleRef}
              className="text-xl sm:text-2xl text-gray-600 max-w-xl mx-auto md:mx-0 leading-relaxed mb-8"
            >
              Intelligent workout recommendations powered by computer vision. Generate personalized exercise suggestions in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <button className="btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">Start Analyzing Now</button>
              <p className="text-gray-500 text-sm italic">*No credit card required</p>
            </div>
          </div>

          {/* Right Column - Upload Form */}
          <div className="md:w-1/2 max-w-2xl mx-auto md:mx-0">
            <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
              <UploadForm onUpload={handleUpload} isLoading={isLoading} progress={uploadProgress} onResult={setData} />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4 mb-20">
            <Loader size="large" />
            <p className="text-xl font-medium text-gray-700">Analyzing your equipment...</p>
          </div>
        )}

        {/* Results Section */}
        {data && (
          <div ref={resultsRef} className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Personalized Workout Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.map((exercise, index) => (
                <ExerciseCard key={index} exercise={exercise} />
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div id="features-section" className="features-section m-20 grid grid-cols-1 md:grid-cols-3 gap-8 scroll-mt-20">
          <FeatureCard
            iconBgColor="#e0f2fe" // Light Blue
            icon={(
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            title="AI-Powered Analysis"
            description="Advanced computer vision technology to identify gym equipment and suggest optimal exercises."
          />

          <FeatureCard
            iconBgColor="#ede9fe" // Light Indigo
            icon={(
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            )}
            title="Personalized Workouts"
            description="Get customized exercise recommendations based on your available equipment and fitness goals."
          />

          <FeatureCard
            iconBgColor="#f3e8ff" // Light Purple
            icon={(
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            title="Instant Results"
            description="Receive immediate feedback and exercise suggestions to optimize your workout routine."
          />
        </div>
      </div>
    </div>
  );
};

export default Home;