import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Why from "../components/Why";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Stats from "../components/Stats";
import Footer from "../components/Footer";

import "../styles/landing.css";

function LandingPage() {
  return (
    <main className="landing-page">
      <Navbar />
      <Hero />
      <Why />
      <HowItWorks />
      <Features />
      <Stats />
      <Footer />
    </main>
  );
}

export default LandingPage;