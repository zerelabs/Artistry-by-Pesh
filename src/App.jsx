import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Components
import Header from './components/Header';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import ExperiencesPage from './pages/ExperiencesPage';
import GalleryPage from './pages/GalleryPage';
import Contact from './pages/Contact';
import Store from './pages/Store';
import Blog from './pages/Blog';
import Admin from './pages/Admin';
import BookingPage from './pages/BookingPage';

gsap.registerPlugin(ScrollTrigger);

// ScrollToTop component to handle route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Refresh ScrollTrigger on route change
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
};

const SiteHeader = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  return <Header />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <ScrollToTop />
        <SiteHeader />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/store" element={<Store />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
