import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home.js"
import Room from "./pages/Room.js"
import PrivacyPolicy from "./pages/PrivacyPolicy.js"
import Contact from "./pages/Contact.js"
import About from "./pages/About.js"
import HowToPlay from "./pages/HowToPlay.js"
import NotFound from "./pages/NotFound.js"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:code" element={<Room />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-to-play" element={<HowToPlay />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
