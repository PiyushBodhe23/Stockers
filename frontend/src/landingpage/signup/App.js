import { Routes, Route } from "react-router-dom";
import Signup from "./landingpage/signup/Signup";
import Navbar from "../Navbar";
import Footer from "../Footer";

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
