import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

import { Suspense, lazy } from 'react';

// Lazy loaded Pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const ExperiencesPage = lazy(() => import('./pages/ExperiencesPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const Contact = lazy(() => import('./pages/Contact'));
const Store = lazy(() => import('./pages/Store'));
const Blog = lazy(() => import('./pages/Blog'));
const Admin = lazy(() => import('./pages/Admin'));
const BookingPage = lazy(() => import('./pages/BookingPage'));

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

const SiteFooter = () => {
  const { pathname } = useLocation();
  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/store') || 
    pathname.startsWith('/gallery')
  ) {
    return null;
  }
  return <Footer />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <ScrollToTop />
        <SiteHeader />
        <main>
          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
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
          </Suspense>
        </main>
        <SiteFooter />
      </div>
    </Router>
  );
}

export default App;
