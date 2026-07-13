import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import LoanPage from './pages/LoanPage.jsx';
import Apply from './pages/Apply.jsx';
import EmiCalculator from './pages/EmiCalculator.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import BlogList from './pages/BlogList.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import NotFound from './pages/NotFound.jsx';

import Login from './pages/manage/Login.jsx';
import Dashboard from './pages/manage/Dashboard.jsx';
import LeadDetail from './pages/manage/LeadDetail.jsx';
import AprSettings from './pages/manage/AprSettings.jsx';
import Analytics from './pages/manage/Analytics.jsx';
import ManageBlogList from './pages/manage/ManageBlogList.jsx';
import BlogForm from './pages/manage/BlogForm.jsx';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public site */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/emi-calculator" element={<EmiCalculator />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/loans/:slug" element={<LoanPage />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Staff auth + area (no public chrome) */}
        <Route path="/manage/login" element={<Login />} />
        <Route
          path="/manage"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/lead/:id"
          element={
            <ProtectedRoute>
              <LeadDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/apr-settings"
          element={
            <ProtectedRoute>
              <AprSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/blog"
          element={
            <ProtectedRoute>
              <ManageBlogList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/blog/new"
          element={
            <ProtectedRoute>
              <BlogForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage/blog/:id/edit"
          element={
            <ProtectedRoute>
              <BlogForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
