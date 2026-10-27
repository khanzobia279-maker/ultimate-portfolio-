import useTheme from "./lib/useTheme";
import useSmoothScroll from "./lib/useSmoothScroll";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Marquee from "./components/Marquee";
import Contact from "./components/Contact";
import Services from "./components/Services";
import Assistant from "./components/Assistant";
import BackToTop from "./components/BackToTop";

export default function App() {
  const [theme, toggleTheme] = useTheme();
  useSmoothScroll();
  return (
    <>
      <Preloader />
      <Cursor />
      <Navbar theme={theme} onToggle={toggleTheme} />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Projects />
      </main>
      <Contact />
      <BackToTop />
      <Assistant />
    </>
  );
}
