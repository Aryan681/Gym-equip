import React from 'react'
import './App.css'
import Home from "./page/Home";
import Navbar from "./component/common/bais/Navbar";
import Footer from "./component/common/bais/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App
