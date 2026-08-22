import React, { Suspense, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { ScrollToTop, ScrollProgress, WhatsAppFloat, CursorGlow } from "./components/layout/Chrome";
import { site } from "./data/site";
import { applyPageMeta, orgSchema } from "./lib/seo";
import { Guard } from "./admin/Guard";

/* ── public pages (lazy) ── */
const Home = React.lazy(() => import("./pages/Home"));
const Services = React.lazy(() => import("./pages/Services"));
const Agents = React.lazy(() => import("./pages/Agents"));
const Automations = React.lazy(() => import("./pages/Automations"));
const Software = React.lazy(() => import("./pages/Software"));
const WebDevelopment = React.lazy(() => import("./pages/WebDevelopment"));
const AppDevelopment = React.lazy(() => import("./pages/AppDevelopment"));
const SolutionsIndex = React.lazy(() => import("./pages/Solutions"));
const Work = React.lazy(() => import("./pages/Work"));
const About = React.lazy(() => import("./pages/About"));
const Careers = React.lazy(() => import("./pages/Careers"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Resources = React.lazy(() => import("./pages/Resources"));
const Legal = React.lazy(() => import("./pages/Legal"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Industry = React.lazy(() => import("./pages/Solutions").then((m) => ({ default: m.IndustryPage })));

/* ── admin (lazy, separate chunks — never referenced from public nav/footer/sitemap) ── */
const AdminLogin = React.lazy(() => import("./admin/Login"));
const AdminLayout = React.lazy(() => import("./admin/AdminLayout"));
const AdminDashboard = React.lazy(() => import("./admin/Dashboard"));
const AdminLeads = React.lazy(() => import("./admin/Leads"));
const AdminAssessments = React.lazy(() => import("./admin/Assessments"));
const AdminMedia = React.lazy(() => import("./admin/Media"));
const AdminCms = React.lazy(() => import("./admin/Cms").then((m) => ({ default: m.CmsManager })));
const AdminJobs = React.lazy(() => import("./admin/Careers").then((m) => ({ default: m.JobsAdmin })));
const AdminApplications = React.lazy(() => import("./admin/Careers").then((m) => ({ default: m.ApplicationsAdmin })));
const AdminSettings = React.lazy(() => import("./admin/System").then((m) => ({ default: m.SettingsAdmin })));
const AdminUsers = React.lazy(() => import("./admin/System").then((m) => ({ default: m.UsersAdmin })));
const AdminAudit = React.lazy(() => import("./admin/System").then((m) => ({ default: m.AuditAdmin })));
const AdminSeo = React.lazy(() => import("./admin/System").then((m) => ({ default: m.SeoAdmin })));
const AdminLegal = React.lazy(() => import("./admin/System").then((m) => ({ default: m.LegalAdmin })));
const AdminNav = React.lazy(() => import("./admin/System").then((m) => ({ default: m.NavAdmin })));
const AdminPages = React.lazy(() => import("./admin/System").then((m) => ({ default: m.PagesAdmin })));

function PageFallback() {
  return (
    <div className="bg-ink-950 min-h-[60vh] flex items-center justify-center">
      <div className="flex items-center gap-3 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink-300">
        <span className="w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" aria-hidden />
        loading module…
      </div>
    </div>
  );
}

function AdminFallback() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="flex items-center gap-3 text-[0.82rem] text-slate-500">
        <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden />
        loading admin…
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError)
      return (
        <div className="bg-ink-950 min-h-[70vh] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <p className="eyebrow text-rose-ic">system exception</p>
            <h1 className="font-display font-bold text-white text-2xl mt-3 tracking-tight">This run stopped safely.</h1>
            <p className="text-ink-300 mt-3 text-sm leading-relaxed">
              Something unexpected broke on this page — no data was lost. Reload usually fixes it;
              if it persists{site.contact.email ? `, email us at ${site.contact.email}` : ", reach out via the contact page"}.
            </p>
            <button onClick={() => window.location.reload()} className="mt-6 bg-brand-500 text-white font-display font-semibold px-6 h-11 clip-corner hover:bg-brand-400 transition-colors">
              Reload page
            </button>
          </div>
        </div>
      );
    return this.props.children;
  }
}

const META: Record<string, [string, string]> = {
  "/": ["ITCYBER — AI, Custom Software, Web & App Development", "ITCYBER builds AI systems, custom software, business websites, web applications, mobile & PWA apps, automation and integrations — one engineering team, one connected digital system."],
  "/services": ["Services — AI, Software, Web, Apps & Automation | ITCYBER", "Five engineering capabilities: AI & intelligent systems, custom software, web products, mobile & PWA applications, and automation & integrations — delivered as one connected system."],
  "/ai-agents": ["AI Agents for Business — Sales, Support, Appointment & Custom | ITCYBER", "Custom AI agent development in India: sales, support, qualification, appointment and operations agents wired to your systems."],
  "/automations": ["Business Process Automation — WhatsApp, CRM, Billing & More | ITCYBER", "Business automation in India: lead capture, CRM, follow-up, WhatsApp, invoicing and reporting automation with human approval gates."],
  "/custom-software": ["Custom AI Software, Dashboards & SaaS Development | ITCYBER", "Custom software development: internal tools, business dashboards, portals, SaaS products and AI-enabled web applications."],
  "/web-development": ["Custom Website & Web Application Development | ITCYBER", "Custom websites, web applications, portals and AI-integrated web experiences — CMS, admin panels, CRM and WhatsApp integrations engineered in."],
  "/app-development": ["Mobile App & PWA Development | ITCYBER", "Cross-platform mobile applications and progressive web apps: customer, employee and operations apps with AI features, offline sync and secure backends."],
  "/solutions": ["Industry Solutions — Real Estate, Healthcare, Education & More | ITCYBER", "AI and automation playbooks for real estate, healthcare, education, e-commerce, agencies, professional services, startups and SMEs."],
  "/work": ["Work — Reference Architectures & Case Studies | ITCYBER", "How ITCYBER systems are architected: reference architectures with challenge, solution architecture and integrations."],
  "/about": ["About ITCYBER — Practical AI Systems for Real Businesses", "ITCYBER Technologies Pvt Ltd: business-first AI engineering. Our story, beliefs, mission and delivery method."],
  "/careers": ["Careers at ITCYBER — AI Automation & Engineering Roles", "Join ITCYBER: open roles in AI automation engineering, full-stack development, solutions architecture and business development."],
  "/contact": ["Contact ITCYBER — Discuss Your Website, App, Software or AI Project", "Tell us what you want to build. Free consultation and a 2-minute project assessment for websites, web apps, custom software, mobile apps, AI systems and automation."],
  "/resources": ["Resources — AI, Automation & Software Field Notes | ITCYBER", "Practical field notes on AI agents, automation, software, websites and business systems."],
  "/privacy-policy": ["Privacy Policy | ITCYBER", "How ITCYBER Technologies collects, uses and protects your data."],
  "/terms-of-service": ["Terms of Service | ITCYBER", "Terms governing use of itcyber.in and ITCYBER services."],
  "/cookie-policy": ["Cookie Policy | ITCYBER", "The minimal, honest cookies used on itcyber.in and how to control them."],
};

function MetaBridge() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    if (pathname.startsWith("/itcyberadmin")) {
      applyPageMeta({ title: "ITCYBER Admin", description: "Restricted area", path: pathname, robots: "noindex, nofollow" });
      return;
    }
    const pageOwnsMeta = pathname === "/" || pathname === "/web-development" || pathname === "/app-development" || pathname === "/careers" || pathname === "/contact" || pathname === "/resources" || pathname.startsWith("/resources/");
    if (pageOwnsMeta) return;
    let entry = META[pathname];
    if (!entry && pathname.startsWith("/solutions/")) {
      const slug = pathname.split("/")[2] ?? "";
      entry = [`${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — AI & Automation Solutions | ITCYBER`, "Industry-specific AI and automation playbook from ITCYBER."];
    }
    const [title, description] = entry ?? ["ITCYBER — AI Agents, Automation & Business Software", site.description];
    applyPageMeta({ title, description, path: pathname, schema: pathname === "/" ? orgSchema : undefined });
  }, [pathname]);
  return null;
}

function PageShell() {
  const location = useLocation();
  const reduce = useReducedMotion();
  const mainRef = useRef<HTMLElement>(null);

  return (
    <div className="relative z-[2] bg-ink-950">
      <ScrollToTop />
      <Navbar />
      <motion.main
        ref={mainRef}
        key={location.pathname}
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/ai-agents" element={<Agents />} />
            <Route path="/automations" element={<Automations />} />
            <Route path="/custom-software" element={<Software />} />
            <Route path="/web-development" element={<WebDevelopment />} />
            <Route path="/app-development" element={<AppDevelopment />} />
            <Route path="/solutions" element={<SolutionsIndex />} />
            <Route path="/solutions/:slug" element={<Industry />} />
            <Route path="/work" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:slug" element={<Resources />} />
            <Route path="/privacy-policy" element={<Legal />} />
            <Route path="/terms-of-service" element={<Legal />} />
            <Route path="/cookie-policy" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </motion.main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <MetaBridge />
        <ScrollProgress />
        <CursorGlow />
        <Routes>
          <Route
            path="/itcyberadmin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/itcyberadmin"
            element={
              <Guard resource="dashboard">
                <Suspense fallback={<AdminFallback />}>
                  <AdminLayout />
                </Suspense>
              </Guard>
            }
          >
            <Route index element={<Guard resource="dashboard"><Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense></Guard>} />
            <Route path="leads" element={<Guard resource="leads"><Suspense fallback={<AdminFallback />}><AdminLeads /></Suspense></Guard>} />
            <Route path="assessments" element={<Guard resource="assessments"><Suspense fallback={<AdminFallback />}><AdminAssessments /></Suspense></Guard>} />
            <Route path="services" element={<Guard resource="services"><Suspense fallback={<AdminFallback />}><AdminCms configKey="services" /></Suspense></Guard>} />
            <Route path="agents" element={<Guard resource="agents"><Suspense fallback={<AdminFallback />}><AdminCms configKey="agents" /></Suspense></Guard>} />
            <Route path="automations" element={<Guard resource="automations"><Suspense fallback={<AdminFallback />}><AdminCms configKey="automations" /></Suspense></Guard>} />
            <Route path="industries" element={<Guard resource="industries"><Suspense fallback={<AdminFallback />}><AdminCms configKey="industries" /></Suspense></Guard>} />
            <Route path="work" element={<Guard resource="work"><Suspense fallback={<AdminFallback />}><AdminCms configKey="work" /></Suspense></Guard>} />
            <Route path="resources" element={<Guard resource="resources"><Suspense fallback={<AdminFallback />}><AdminCms configKey="resources" /></Suspense></Guard>} />
            <Route path="jobs" element={<Guard resource="jobs"><Suspense fallback={<AdminFallback />}><AdminJobs /></Suspense></Guard>} />
            <Route path="applications" element={<Guard resource="applications"><Suspense fallback={<AdminFallback />}><AdminApplications /></Suspense></Guard>} />
            <Route path="media" element={<Guard resource="media"><Suspense fallback={<AdminFallback />}><AdminMedia /></Suspense></Guard>} />
            <Route path="seo" element={<Guard resource="seo"><Suspense fallback={<AdminFallback />}><AdminSeo /></Suspense></Guard>} />
            <Route path="navigation" element={<Guard resource="navigation"><Suspense fallback={<AdminFallback />}><AdminNav /></Suspense></Guard>} />
            <Route path="pages" element={<Guard resource="pages"><Suspense fallback={<AdminFallback />}><AdminPages /></Suspense></Guard>} />
            <Route path="settings" element={<Guard resource="settings"><Suspense fallback={<AdminFallback />}><AdminSettings /></Suspense></Guard>} />
            <Route path="users" element={<Guard resource="users"><Suspense fallback={<AdminFallback />}><AdminUsers /></Suspense></Guard>} />
            <Route path="audit-logs" element={<Guard resource="audit"><Suspense fallback={<AdminFallback />}><AdminAudit /></Suspense></Guard>} />
            <Route path="legal" element={<Guard resource="settings"><Suspense fallback={<AdminFallback />}><AdminLegal /></Suspense></Guard>} />
            <Route path="*" element={<Guard resource="dashboard"><Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense></Guard>} />
          </Route>
          <Route path="/*" element={<PageShell />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
