import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Stocks from "./pages/Stocks";
import About from "./pages/About";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Favourites from "./pages/Favourites";


function App() {
  return (
    <BrowserRouter>

      <div className="app">

        <Navbar />

        <div className="page-content">

          <Routes>

            {/* Public pages */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/stocks"
              element={<Stocks />}
            />

            <Route
              path="/about"
              element={<About />}
            />


            {/* Authentication */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/favourites"
              element={<Favourites />}
            />

          </Routes>

        </div>

        <Footer />

      </div>

    </BrowserRouter>
  );
}


export default App;