import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './component/common/bais/Navbar';
import Footer from './component/common/bais/Footer';
import { useRef } from 'react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './page/Home';

// Protected Route component


const AppRoutes = () => {
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const footerRef = useRef(null);

  const scrollToHome = () => {
    homeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

 return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar
            scrollToHome={scrollToHome}
            scrollToFeatures={scrollToFeatures}
            scrollToFooter={scrollToFooter}
          />
          <div className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <Home
                    homeRef={homeRef}
                    featuresRef={featuresRef}
                    
                  />
                }
              />
            </Routes>
          </div>
          <Footer scrollToHome={scrollToHome}
            scrollToFeatures={scrollToFeatures}
            scrollToFooter={scrollToFooter}
            footerRef={footerRef} /> 
        </div>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;
