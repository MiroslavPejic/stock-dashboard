import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Stocks from "./pages/Stocks/Stocks";
import About from "./pages/About/About";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Favourites from "./pages/Favourites/Favourites";


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