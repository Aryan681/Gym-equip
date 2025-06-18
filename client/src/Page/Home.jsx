import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin, TextPlugin, ScrollTrigger } from "gsap/all";
import UploadForm from "../component/Upload";
import ExerciseCard from "../component/cards/Excersice";
import Loader from "../component/common/loading/Loader";
import FeatureCard from "../component/common/FeatureCard";
import AuthPromptModal from "../component/common/AuthPromptModal";
import { useAuth } from "../context/AuthContext";
import axios from "axios";  

gsap.registerPlugin(MotionPathPlugin, TextPlugin, ScrollTrigger);

const Home = ({ homeRef, featuresRef }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const heroIconRef = useRef(null);
  const resultsRef = useRef(null);
  const orbRefs = useRef(Array.from({ length: 8 }, () => useRef(null)));

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    orbRefs.current.forEach((orb, i) => {
      const el = orb.current;
      gsap.to(el, {
        x: `+=${(Math.random() - 0.5) * 100}`,
        y: `+=${(Math.random() - 0.5) * 100}`,
        duration: Math.random() * 10 + 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });

    gsap.to(heroIconRef.current, {
      y: "10%",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const firstLine = "Gym Equipment";
    const secondLine = `<br/><span class='bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 bg-clip-text text-transparent'>AI Assistant</span>`;
    gsap.to(titleRef.current, {
      text: { value: `${firstLine}${secondLine}`, speed: 0.5, delimiter: "" },
      duration: 1.5,
      ease: "power2.in",
    });

    const chars = subtitleRef.current.textContent.split("");
    subtitleRef.current.textContent = "";
    chars.forEach((ch, i) => {
      const span = document.createElement("span");
      span.textContent = ch;
      if (ch.trim()) {
        span.style.display = "inline-block";
        gsap.from(span, {
          y: 40,
          opacity: 0,
          rotation: 10,
          duration: 0.6,
          delay: i * 0.02,
          ease: "back.out(3)",
        });
      } else span.style.whiteSpace = "pre";
      subtitleRef.current.appendChild(span);
    });
  }, []);

  useEffect(() => {
    if (data && resultsRef.current) {
      setIsLoading(false);
      gsap.from(resultsRef.current, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.utils.toArray(".exercise-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          rotationX: 60,
          duration: 0.6,
          ease: "back.out(2)",
          delay: i * 0.1,
        });
      });
    }
  }, [data]);

  const handleUpload = async (file) => {
    if (!user) return setShowAuthModal(true);
    setIsLoading(true);
    setUploadProgress(0);
    const form = new FormData();
    form.append("image", file);
    try {
      const res = await axios.post(`${BASE_URL}/api/combo`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded / e.total) * 100)),
      });
      const arr = Array.isArray(res.data)
        ? res.data
        : res.data.exercises?.filter(Boolean) ?? [
            { name: "No exercises found", muscles: ["Try another image"], tip: "", video: null },
          ];
      setData(arr);
    } catch {
      setData([{ name: "Oops, something went wrong", muscles: [], tip: "Try again", video: null }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <AuthPromptModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {orbRefs.current.map((ref, i) => (
        <div
          key={i}
          ref={ref}
          className="absolute rounded-full opacity-20 mix-blend-soft-light blur-3xl pointer-events-none"
          style={{
            width: `${Math.random() * 40 + 20}px`,
            height: `${Math.random() * 40 + 20}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, ${i % 2 === 0 ? "#2563eb" : "#9333ea"} 0%, transparent 70%)`,
          }}
        />
      ))}

      <header id="hero-section" ref={homeRef}
        className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between px-6 py-16 max-w-6xl mx-auto"
      >
        <div className="w-full md:w-1/2 mt-8 md:mt-0 text-center md:text-left">
          <h1
            ref={titleRef}
            className="font-extrabold text-[clamp(2.5rem,8vw,5rem)] leading-tight mb-6"
          ></h1>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0 mb-8"
          >
            Intelligent workout recommendations powered by computer vision. Generate personalized exercise suggestions in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <button className="btn-primary px-8 py-4 text-lg shadow-lg hover:scale-[1.03] transition-transform">
              Start Analyzing Now
            </button>
            <span className="text-gray-500 text-sm italic">*No credit card required</span>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <div
            ref={heroIconRef}
            className="p-6 bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition-shadow transform"
            role="img"
            aria-label="Animated Gym Assistant Icon"
          >
            <img
              loading="lazy"
              src="/icon.jpg"
              alt="Gym Equipment AI Assistant icon"
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
          <UploadForm onUpload={handleUpload} isLoading={isLoading} uploadProgress={uploadProgress} />
        </div>
      </section>

      {isLoading && (
        <section className="flex flex-col items-center space-y-4 mb-20">
          <Loader size="large" />
          <p className="text-xl font-medium text-gray-700">Analyzing your equipment...</p>
        </section>
      )}

      {data && (
        <section ref={resultsRef} className="max-w-6xl mx-auto px-6 mb-20 space-y-12">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Your Personalized Workout Plan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((ex, i) => (
              <ExerciseCard key={i} exercise={ex} />
            ))}
          </div>
        </section>
      )}

      <section id="features-section" ref={featuresRef} className="py-20 px-6 bg-gradient-to-br from-white to-indigo-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <FeatureCard
            iconBgColor="#e0f2fe"
             icon={(
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            title="AI-Powered Analysis"
            description="Advanced computer vision to identify gym equipment and suggest optimal exercises."
          />
          <FeatureCard
            iconBgColor="#ede9fe"
            icon={(
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            )}
            title="Personalized Workouts"
            description="Customized exercise suggestions based on your equipment and fitness goals."
          />
          <FeatureCard
            iconBgColor="#f3e8ff"
            icon={(
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            title="Instant Feedback"
            description="Get immediate, science-backed tips to optimize your workouts."
          />
        </div>
      </section>
    </main>
  );
};

export default Home;
