import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const Navbar = ({ scrollToFeatures, scrollToFooter }) => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    // Navbar entrance animation
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    // Logo animation
    gsap.fromTo(
      logoRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
    );

    // Menu items animation
    gsap.fromTo(
      menuRef.current.children,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div ref={logoRef} className="flex-shrink-0 flex items-center">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/icon.jpg"
                alt="GymAI Logo"
                className="w-9 h-9 object-contain"
              />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">GymAI</span>
          </div>

          {/* Navigation Menu */}
          <div ref={menuRef} className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Home
            </a>
            <a
              href="#features-section"
              onClick={(e) => {
                e.preventDefault(); // This prevents the default anchor behavior
                scrollToFeatures();
              }}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#footer"
              onClick={(e) => {
                e.preventDefault(); // This prevents the default anchor behavior
                scrollToFooter();
              }}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
