import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";


function Navbar() {

  const { user, signOut } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);


  /*
   * Close the dropdown when clicking elsewhere.
   */

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  /*
   * Logout
   */

  const handleLogout = async () => {

    const { error } = await signOut();

    if (error) {
      console.error("Logout error:", error);
    }

    setMenuOpen(false);

  };


  /*
   * Get a friendly name from the email.
   *
   * For example:
   * miki.pejic@example.com
   *
   * becomes:
   * Miki Pejic
   */

  const getDisplayName = () => {

    if (!user?.email) {
      return "Account";
    }


    const emailName = user.email
      .split("@")[0]
      .replace(/[._-]/g, " ");


    return emailName
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");

  };


  return (

    <nav className="navbar">

      <div className="navbar-container">

        {/* Logo */}

        <NavLink
          to="/"
          className="navbar-logo"
        >

          <span className="navbar-logo-icon">
            S
          </span>

          <span className="navbar-logo-text">
            Stock Dashboard
          </span>

        </NavLink>


        {/* Navigation */}

        <div className="navbar-links">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Home
          </NavLink>


          <NavLink
            to="/stocks"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            Stocks
          </NavLink>


          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            About
          </NavLink>


          {/* Logged out */}

          {!user && (

            <>

              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                Login
              </NavLink>


              <NavLink
                to="/signup"
                className="nav-signup"
              >
                Sign Up
              </NavLink>

            </>

          )}


          {/* Logged in */}

          {user && (

            <div
              className="navbar-account"
              ref={menuRef}
            >

              <button
                type="button"
                className="account-button"
                onClick={() =>
                  setMenuOpen(!menuOpen)
                }
              >

                <span className="account-avatar">
                  {getDisplayName()
                    .charAt(0)
                    .toUpperCase()}
                </span>


                <span className="account-name">
                  {getDisplayName()}
                </span>


                <span
                  className={`account-chevron ${
                    menuOpen ? "open" : ""
                  }`}
                >
                  ▾
                </span>

              </button>


              {menuOpen && (

                <div className="account-dropdown">

                  <div className="account-dropdown-header">

                    <span className="account-dropdown-name">
                      {getDisplayName()}
                    </span>

                    <span className="account-dropdown-email">
                      {user.email}
                    </span>

                  </div>


                  <div className="account-dropdown-divider" />


                  <Link
                    to="/dashboard"
                    className="account-dropdown-link"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    <span>▣</span>
                    My Dashboard
                  </Link>


                  <Link
                    to="/favourites"
                    className="account-dropdown-link"
                    onClick={() =>
                      setMenuOpen(false)
                    }
                  >
                    <span>★</span>
                    Favourite Stocks
                  </Link>


                  <div className="account-dropdown-divider" />


                  <button
                    type="button"
                    className="account-dropdown-logout"
                    onClick={handleLogout}
                  >
                    <span>↪</span>
                    Log out
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </nav>

  );
}


export default Navbar;