import { NavLink, Link } from "react-router";
import { useContext, useState } from "react";
import Logo from "../../components/logo/Logo";
import { AuthContext } from "../../contexts/authcontexts/AuthContext";
import useRole from "../../hooks/useRole";

const NavBar = () => {
  const { user, logOut } = useContext(AuthContext);
  const { role, isLoading } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    localStorage.removeItem("access-token");
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-gray-900 font-medium px-3 py-1.5 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900"
      : "text-gray-600 hover:text-gray-900 px-3 py-1.5 transition-colors duration-200";

  // --- Link Groups ---

  const commonLinks = (
    <>
      <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>
      <li><NavLink to="/all-issues" className={navLinkClass}>All Issues</NavLink></li>
      <li><NavLink to="/about" className={navLinkClass}>About</NavLink></li>
      <li><NavLink to="/contact" className={navLinkClass}>Contact</NavLink></li>
    </>
  );

  const citizenLinks = (
    <>
      <li><NavLink to="/citizen/dashboard" className={navLinkClass}>Dashboard</NavLink></li>
      <li><NavLink to="/citizen/issues" className={navLinkClass}>My Issues</NavLink></li>
      <li><NavLink to="/citizen/report" className={navLinkClass}>Report Issue</NavLink></li>
    </>
  );

  const adminLinks = (
    <>
      <li><NavLink to="/admin/dashboard" className={navLinkClass}>Dashboard</NavLink></li>
      <li><NavLink to="/admin/manage-users" className={navLinkClass}>Manage Users</NavLink></li>
      <li><NavLink to="/admin/manage-staff" className={navLinkClass}>Manage Staff</NavLink></li>
      <li><NavLink to="/admin/payments" className={navLinkClass}>Payments</NavLink></li>
      <li><NavLink to="/admin/all-issues" className={navLinkClass}>Manage Issues</NavLink></li>
      <li><NavLink to="/admin/profile" className={navLinkClass}>Profile</NavLink></li>
    </>
  );

  if (isLoading) return null;

  return (
    <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/50">
      <div className="px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1">
              {commonLinks}
              {role === "citizen" && citizenLinks}
              {role === "admin" && adminLinks}
            </ul>
          </div>

          {/* Right Side (User Profile / Auth) */}
          <div className="flex items-center gap-4">
            {!user ? (
              <div className="hidden lg:flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Login</Link>
                <Link to="/register" className="px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800">Register</Link>
              </div>
            ) : (
              <div className="relative group hidden lg:block">
                <button className="flex items-center gap-2 px-2 py-2 rounded-full hover:bg-gray-50">
                  <img 
                    src={user.photoURL || "https://i.ibb.co/2yZ4Z3b/user.png"} 
                    alt="profile" 
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200" 
                  />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-sm">{user.displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {/* Role-Specific Profile/Dashboard Links */}
                    {role === "citizen" && (
                      <>
                        <Link to="/citizen/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                        <Link to="/citizen/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                      </>
                    )}
                    {role === "admin" && (
                      <>
                        <Link to="/admin/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                        <Link to="/admin/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">Logout</button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-6 py-4 space-y-2">
            <ul className="space-y-1">
              {commonLinks}
              {role === "citizen" && citizenLinks}
              {role === "admin" && adminLinks}
            </ul>

            {!user ? (
              <div className="pt-4 space-y-2 border-t">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center border rounded-full py-2">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center bg-gray-900 text-white rounded-full py-2">Register</Link>
              </div>
            ) : (
              <div className="pt-4 border-t space-y-1">
                {role === "citizen" && (
                  <>
                    <Link to="/citizen/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 hover:bg-gray-50 rounded-lg">Profile</Link>
                    <Link to="/citizen/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                  </>
                )}
                {role === "admin" && (
                  <>
                    <Link to="/admin/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 hover:bg-gray-50 rounded-lg">Profile</Link>
                    <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                  </>
                )}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;