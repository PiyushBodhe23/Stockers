import { Routes, Route } from "react-router-dom";

import Signup from "./landingpage/signup/Signup";
import Login from "./landingpage/signup/login";
import Homepage from "./landingpage/home/Homepage";

import Navbar from "./landingpage/Navbar";
import Footer from "./landingpage/Footer";
import Notfound from "./landingpage/Notfound";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* fallback */}
        <Route path="*" element={<Notfound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;