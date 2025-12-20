import { NavLink, Link } from "react-router";
import { useContext, useState } from "react";
import Logo from "../../components/logo/Logo";
import { AuthContext } from "../../contexts/authcontexts/AuthContext";

const NavBar = () => {
  const { user, signOutUser } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOutUser();
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-gray-900 font-medium px-3 py-1.5 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900"
      : "text-gray-600 hover:text-gray-900 px-3 py-1.5 transition-colors duration-200";

  const links = (
    <>
      <li>
        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/all-issues" className={navLinkClass}>
          All Issues
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" className={navLinkClass}>
          About
        </NavLink>
      </li>
      <li>
        <NavLink to="/contact" className={navLinkClass}>
          Contact
        </NavLink>
      </li>
    </>
  );

  return (
    <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/50">
      <div className="px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1">{links}</ul>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Auth Buttons - Desktop Only */}
            {!user ? (
              <div className="hidden lg:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-all"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative group hidden lg:block">
                <button className="flex items-center gap-2 px-2 py-2 rounded-full hover:bg-gray-50 transition-colors">
                  <img
                    src={user.photoURL || "https://i.ibb.co/2yZ4Z3b/user.png"}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200"
                  />
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-sm text-gray-900">{user.displayName}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200/50">
          <div className="px-6 py-4 space-y-1">
            <ul className="space-y-1">{links}</ul>

            {!user ? (
              <div className="pt-4 space-y-2 border-t border-gray-200 mt-4">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 mt-4 space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <img
                    src={user.photoURL || "https://i.ibb.co/2yZ4Z3b/user.png"}
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{user.displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;