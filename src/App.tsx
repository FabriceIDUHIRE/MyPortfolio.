import { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Playground from './pages/Playground';
import CaseStudyPage from './pages/CaseStudy';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120); return; }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

const titles: Record<string, string> = {
  '/': 'Fabrice Iduhire · Product designer',
  '/about': 'About · Fabrice Iduhire',
  '/playground': 'Playground · Fabrice Iduhire',
};

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (titles[pathname]) document.title = titles[pathname];
  }, [pathname]);
  return (
    <>
      <ScrollToTop />
      <Nav />
      <main id="top">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/work/:slug" element={<CaseStudyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
