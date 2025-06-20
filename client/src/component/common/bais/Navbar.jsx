import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { gsap } from "gsap";

const Navbar = ({ scrollToFeatures, scrollToFooter, scrollToHome }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navbarRef = useRef(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    if (menuRef.current) {
      const menuItems = menuRef.current.querySelectorAll("a, button");
      gsap.fromTo(
        menuItems,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 150); // Delay for smoother UX
  };

  const DropdownMenu = () => (
    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border border-gray-100/20 py-1 z-50">
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
      >
        Logout
      </button>
    </div>
  );

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-4 left-1/9 transform-translate-x-1/8 z-50 w-[85%] max-w-6xl mx-auto transition-all duration-300   ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-lg"
          : "bg-white/60 backdrop-blur-md shadow-md"
      } rounded-2xl border border-gray-100/20  `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <img
                src="/icon.jpg"
                alt="Logo"
                className="h-10 w-10 rounded-xl transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                GymAI
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div
            ref={menuRef}
            className="hidden md:flex items-center space-x-8 mx-2"
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                scrollToHome();
              }}
              href="#home-section"
              className="relative px-2 py-1 font-medium text-gray-600 transition duration-300 ease-in-out hover:text-blue-600 focus:outline-none group"
            >
              Home
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 group-hover:w-full"></span>
            </a>

            <a
              onClick={(e) => {
                e.preventDefault();
                scrollToFeatures();
              }}
              href="#features-section"
              className="relative px-2 py-1 font-medium text-gray-600 transition duration-300 ease-in-out hover:text-blue-600 focus:outline-none group"
            >
              Features
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 group-hover:w-full"></span>
            </a>

            <a
              onClick={(e) => {
                e.preventDefault();
                scrollToFooter();
              }}
              href="#footer"
              className="relative px-2 py-1 font-medium text-gray-600 transition duration-300 ease-in-out hover:text-blue-600 focus:outline-none group"
            >
              Contact
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 group-hover:w-full"></span>
            </a>

            {user ? (
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium cursor-pointer">
                  <span>{user.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {showDropdown && <DropdownMenu />}
              </div>
            ) : (
              <div className="relative group cursor-pointer mx-4">
                <span className="relative inline-block text-gray-700 font-semibold transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-[-10px]">
                  Auth
                </span>
                <div className="absolute inset-0 flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-gray-500 text-3xl opacity-0 transform scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 delay-200 p-0.5">
                    [
                  </span>
                  <Link
                    to="/login"
                    className="text-blue-600 font-semibold hover:underline focus:outline-none transition-all duration-500 transform translate-x-0 group-hover:-translate-x-1 delay-100"
                  >
                    Login
                  </Link>
                  <span className="text-gray-400 text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                    /
                  </span>
                  <Link
                    to="/register"
                    className="text-blue-600 font-semibold hover:underline focus:outline-none transition-all duration-500 transform translate-x-0 group-hover:translate-x-1 delay-100"
                  >
                    Signup
                  </Link>
                  <span className="text-gray-500 text-3xl opacity-0 transform scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 delay-200 p-0.5">
                    ]
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-t border-gray-100/20 px-4 pb-4">
          <ul>
           <li><a
              onClick={(e) => {
                e.preventDefault();
                scrollToHome();
              }}
              href="#home-section"
              className="relative px-2 py-1 font-medium text-gray-600 transition duration-300 ease-in-out hover:text-blue-600 focus:outline-none group"
            >
              Home
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 group-hover:w-full"></span>
            </a></li>
            <li>
              {" "}
              <a
                onClick={(e) => {
                  e.preventDefault();
                  scrollToFeatures();
                }}
                href="#features-section"
                className="relative px-2 py-1 font-medium text-gray-600 transition duration-300 ease-in-out hover:text-blue-600 focus:outline-none group"
              >
                Features
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 group-hover:w-full"></span>
              </a>
            </li>

            <li>
              {" "}
              <a
                onClick={(e) => {
                  e.preventDefault();
                  scrollToFooter();
                }}
                href="#footer"
                className="relative px-2 py-1 font-medium text-gray-600 transition duration-300 ease-in-out hover:text-blue-600 focus:outline-none group"
              >
                Contact
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 group-hover:w-full"></span>
              </a>
            </li>
         
           <li> {user ? (
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium cursor-pointer">
                  <span>{user.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {showDropdown && <DropdownMenu />}
              </div>
            ) : (
              <div className="relative group cursor-pointer mx-4">
                <span className="relative inline-block text-gray-700 font-semibold transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-[-10px]">
                  Auth
                </span>
                <div className="absolute inset-0 flex items-center justify-center space-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-gray-500 text-3xl opacity-0 transform scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 delay-200 p-0.5">
                    [
                  </span>
                  <Link
                    to="/login"
                    className="text-blue-600 font-semibold hover:underline focus:outline-none transition-all duration-500 transform translate-x-0 group-hover:-translate-x-1 delay-100"
                  >
                    Login
                  </Link>
                  <span className="text-gray-400 text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300">
                    /
                  </span>
                  <Link
                    to="/register"
                    className="text-blue-600 font-semibold h  over:underline focus:outline-none transition-all duration-500 transform translate-x-0 group-hover:translate-x-1 delay-100"
                  >
                    Signup
                  </Link>
                  <span className="text-gray-500 text-3xl opacity-0 transform scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 delay-200 p-0.5">
                    ]
                  </span>
                </div>
              </div>
            )}</li>
           </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
