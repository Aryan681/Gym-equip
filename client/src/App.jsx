import React from 'react'
import './App.css'
import Home from "./page/Home";
import Navbar from "./component/common/bais/Navbar";
import Footer from "./component/common/bais/Footer";

function App() {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  const scrollToFooter = () => {
    const footerSection = document.getElementById('footer');
    if (footerSection) {
      footerSection.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar scrollToFeatures={scrollToFeatures} scrollToFooter={scrollToFooter} />
      <main className="flex-grow pt-16">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App
