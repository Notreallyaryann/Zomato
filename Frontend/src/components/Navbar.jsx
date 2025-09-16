import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/theme.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    window.addEventListener('storage', () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    });
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main">
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">Zomato</Link>
        <div className="navbar__actions">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="navbar__btn">Profile</Link>
              <button className="navbar__btn navbar__btn--primary" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/user/login" className="navbar__btn">Login</Link>
              <Link to="/user/register" className="navbar__btn navbar__btn--primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
