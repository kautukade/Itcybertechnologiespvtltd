-- ═══════════════════════════════════════════════════════════════════════
-- ITCYBER — initial content seed
-- Run AFTER migrations 0001–0004. Idempotent: real upserts keyed on
-- unique slugs/titles (0004 adds the missing unique constraints).
--
-- Contact details are intentionally left empty: the admin must set real
-- values in Admin → Settings before phone/WhatsApp CTAs appear publicly.
-- Jobs seed as UNPUBLISHED — publish them from Admin → Jobs once genuinely open.
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────── site settings (single row) ─────────────────────────
insert into public.site_settings
  (id, company_name, legal_name, tagline, description,
   email, sales_email, careers_email, phone, whatsapp_number, address, business_hours,
   default_og_image)
values
  ('11111111-1111-4111-8111-111111111111',
   'ITCYBER',
   'ITCYBER TECHNOLOGIES PVT LTD',
   'AI, custom software, websites, apps and automation — engineered as one connected system.',
   'ITCYBER designs and develops custom software, intelligent web applications, business websites, mobile-ready platforms, AI agents and automated workflows — connecting everything into one scalable digital system.',
   null, null, null, null, null,          -- ⚠ set these in Admin → Settings
   'India · Serving clients nationwide & remotely',
   'Mon–Sat, 10:00–19:00 IST',
   '/og/itcyber-default.svg')
on conflict (id) do update set
  company_name = excluded.company_name,
  legal_name = excluded.legal_name,
  tagline = excluded.tagline,
  description = excluded.description;

-- ───────────────────────── services (five canonical categories) ─────────────────────────
-- category ∈ ai | software | web | apps | automation (same vocabulary as the admin CMS)
insert into public.services (slug, title, short_description, category, featured, published, sort_order) values
 -- AI & Intelligent Systems
 ('ai-agents',              'AI Agents',                     'Autonomous workers across sales, support and operations.',                     'ai', true,  true, 101),
 ('ai-chatbots-assistants', 'AI Chatbots & Assistants',      'Conversational interfaces grounded in your business.',                       'ai', false, true, 102),
 ('ai-integrated-apps',     'AI-Integrated Apps',            'Intelligence embedded where your team already works.',                       'ai', false, true, 103),
 ('document-ai',            'Document AI & Processing',      'Extract, classify and summarise documents at scale.',                        'ai', false, true, 104),
 ('ai-search-knowledge',    'AI Search & Knowledge Bases',   'Answers from your own data, with sources.',                                  'ai', false, true, 105),
 ('ai-analytics',           'AI Analytics & Recommendations','Signals and next-best actions from live data.',                              'ai', false, true, 106),
 ('ai-lead-qualification',  'AI Lead Qualification',         'Every enquiry scored and routed automatically.',                             'ai', false, true, 107),
 ('ai-workflow-systems',    'AI Workflow Systems',           'Multi-step AI processes with policy checks.',                                'ai', false, true, 108),
 ('custom-ai-agents',       'Custom AI Agents',              'Designed around your exact business logic.',                                 'ai', true,  true, 109),
 -- Custom Software Development
 ('custom-business-software','Custom Business Software',     'Systems shaped around your operations, not the reverse.',                    'software', true,  true, 201),
 ('saas-platforms',         'SaaS Platforms',                'Multi-tenant products built to scale and bill.',                             'software', true,  true, 202),
 ('crm-systems',            'CRM Systems',                   'Pipeline, contacts and activity your team will actually use.',               'software', false, true, 203),
 ('erp-style-systems',      'ERP-Style Systems',             'Inventory, orders, billing and ops in one place.',                           'software', false, true, 204),
 ('business-dashboards',    'Business Dashboards',           'Live operational visibility across every system.',                           'software', false, true, 205),
 ('client-vendor-portals',  'Client & Vendor Portals',       'Self-service that removes the status-call traffic.',                         'software', false, true, 206),
 ('internal-tools',         'Internal Management Tools',     'Replace the spreadsheet that runs your business.',                           'software', false, true, 207),
 ('workflow-platforms',     'Workflow Platforms',            'Approvals, tasks and handoffs on rails.',                                    'software', false, true, 208),
 ('custom-apis',            'Custom APIs & Backends',        'Documented, versioned APIs for your ecosystem.',                             'software', false, true, 209),
 -- Web & Digital Products
 ('custom-websites',        'Custom Websites',               'Corporate, business and institutional sites, engineered.',                   'web', true,  true, 301),
 ('web-applications',       'Web Applications',              'Fast, secure, mobile-ready business apps.',                                  'web', true,  true, 302),
 ('ai-websites',            'AI-Integrated Websites',        'Sites with assistants, search and routing built in.',                        'web', true,  true, 303),
 ('ecommerce',              'E-Commerce Experiences',        'Stores with inventory, payments and automation.',                            'web', false, true, 304),
 ('cms-websites',           'CMS-Enabled Websites',          'Your team publishes; engineering stays out of the way.',                     'web', false, true, 305),
 ('booking-websites',       'Booking-Enabled Websites',      'Appointments and site visits booked straight from the site.',                'web', false, true, 306),
 ('interactive-3d-web',     'Interactive 3D Web Experiences','Premium WebGL moments where they earn attention.',                           'web', false, true, 307),
 ('web-client-portals',     'Client Portals',                'Private areas wired to your backend.',                                       'web', false, true, 308),
 ('lead-gen-websites',      'Lead-Generation Websites',      'Every visit captured, scored and routed.',                                   'web', false, true, 309),
 -- Mobile & PWA Applications
 ('cross-platform-apps',    'Cross-Platform Apps',           'One codebase, every screen your users carry.',                               'apps', true,  true, 401),
 ('customer-apps',          'Customer Apps',                 'Booking, tracking and self-service in one place.',                           'apps', false, true, 402),
 ('employee-ops-apps',      'Employee & Operations Apps',    'Field teams, approvals and updates from anywhere.',                          'apps', false, true, 403),
 ('booking-service-apps',   'Booking & Service Apps',        'Scheduling with reminders that actually reduce no-shows.',                   'apps', false, true, 404),
 ('pwa',                    'Progressive Web Apps',          'Installable, offline-ready web experiences.',                                'apps', false, true, 405),
 ('ai-powered-apps',        'AI-Powered Apps',               'Chat, voice, scan and recommendations on-device.',                           'apps', true,  true, 406),
 ('mobile-dashboards',      'Mobile Dashboards',             'The numbers that matter, in a pocket.',                                      'apps', false, true, 407),
 -- Automation & Integrations
 ('crm-automation',         'CRM Automation',                'Records, stages and tasks that maintain themselves.',                        'automation', true,  true, 501),
 ('whatsapp-automation',    'WhatsApp Automation',           'Broadcasts, journeys and two-way AI conversations.',                         'automation', true,  true, 502),
 ('email-automation',       'Email & Outreach Automation',   'Routing, responses and sequences tied to behaviour.',                        'automation', false, true, 503),
 ('sales-lead-automation',  'Sales & Lead Automation',       'Speed-to-lead, scoring, nurturing, stall alerts.',                           'automation', false, true, 504),
 ('reporting-automation',   'Reporting Automation',          'Daily summaries generated and delivered automatically.',                     'automation', false, true, 505),
 ('operations-automation',  'Operations Automation',         'HR, documents, invoices and approvals on rails.',                            'automation', false, true, 506),
 ('api-integrations',       'API & Webhook Integrations',    'Event-driven bridges between any two systems.',                              'automation', false, true, 507),
 ('erp-integrations',       'ERP & Billing Integrations',    'Tally, Marg and custom ERPs brought into the loop.',                         'automation', false, true, 508),
 ('payment-integrations',   'Payment & Workspace Integrations','Razorpay, Google Workspace and the SaaS long tail.',                       'automation', false, true, 509)
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  category = excluded.category,
  sort_order = excluded.sort_order;

-- ───────────────────────── AI agents ─────────────────────────
-- demo_type ∈ chat | score | ticket | calendar | report | build (public micro-demos)
insert into public.ai_agents (slug, name, role, description, demo_type, featured, published, sort_order) values
 ('sales',         'AI Sales Agent',             'Sales',      'Talks with leads, qualifies prospects and schedules meetings — then hands hot opportunities to your team.', 'chat',     true, true, 1),
 ('support',       'AI Support Agent',           'Support',    'Handles repetitive support queries instantly and escalates complex cases with full context.',                'ticket',   true, true, 2),
 ('qualification', 'AI Lead Qualification Agent','Sales',      'Analyses every enquiry, scores it against your criteria and routes high-priority opportunities first.',      'score',    true, true, 3),
 ('appointment',   'AI Appointment Agent',       'Operations', 'Checks live availability and schedules, reschedules and confirms appointments automatically.',               'calendar', true, true, 4),
 ('operations',    'AI Operations Assistant',    'Operations', 'Produces reports, alerts and summaries so your team starts the day already briefed.',                        'report',   true, true, 5),
 ('custom',        'Custom AI Agent',            'Custom',     'Designed around your specific business logic, systems and decision rules.',                                  'build',    true, true, 6)
on conflict (slug) do update set
  name = excluded.name,
  role = excluded.role,
  description = excluded.description,
  demo_type = excluded.demo_type;

-- ───────────────────────── automations ─────────────────────────
insert into public.automations (slug, name, category, description, published, sort_order) values
 ('sales-pipeline',   'Sales Pipeline Automation',  'sales',      'New enquiry → AI qualification → CRM record → personalised follow-up → booking → dashboard.', true, 1),
 ('support-triage',   'Support Triage Automation',  'support',    'Incoming ticket → AI categorisation → priority routing → suggested reply → resolution log.',  true, 2),
 ('appointment-flow', 'Appointment Booking Flow',   'appointment','Booking request → availability check → confirmation → calendar hold → reminder sequence.',    true, 3),
 ('lead-management',  'Lead Management Automation', 'lead',       'Lead capture → dedupe → scoring → assignment → nurture → sales notification.',                true, 4),
 ('ops-reporting',    'Operations Reporting',       'operations', 'Scheduled data pull → consolidation → anomaly detection → daily brief to managers.',          true, 5)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description;

-- ───────────────────────── industries ─────────────────────────
insert into public.industries (slug, name, short_description, published, sort_order) values
 ('real-estate',           'Real Estate',           'Speed-to-lead, site-visit booking and buyer follow-up on autopilot.',    true, 1),
 ('healthcare',            'Healthcare',            'Patient appointment handling, reminders and front-desk relief.',         true, 2),
 ('education',             'Education',             'Enquiry qualification, admission follow-up and counsellor support.',     true, 3),
 ('ecommerce',             'E-commerce',            'Order support, cart recovery and review generation across channels.',    true, 4),
 ('agencies',              'Agencies',              'Client reporting, lead routing and delivery workflows for agencies.',    true, 5),
 ('professional-services', 'Professional Services', 'Intake, scheduling and matter tracking for consultancies and firms.',    true, 6),
 ('startups',              'Startups',              'Lean revenue and support operations that scale without headcount.',      true, 7),
 ('sme',                   'SMEs',                  'Practical automation for small teams that removes busywork first.',      true, 8)
on conflict (slug) do update set
  name = excluded.name,
  short_description = excluded.short_description;

-- ───────────────────────── jobs (seed UNPUBLISHED — publish from Admin when genuinely open) ─────────────────────────
insert into public.jobs (title, department, location, employment_type, experience, published, applications_open, sort_order) values
 ('AI Automation Engineer',         'Engineering', 'Remote (India)', 'Full-time',  '2–5 years', false, false, 1),
 ('Full-stack Developer',           'Engineering', 'Remote (India)', 'Full-time',  '2–5 years', false, false, 2),
 ('AI Solutions Architect',         'Engineering', 'Remote (India)', 'Full-time',  '4–8 years', false, false, 3),
 ('Business Development Executive', 'Business',    'Remote (India)', 'Full-time',  '1–4 years', false, false, 4),
 ('Automation Intern',              'Automation',  'Remote (India)', 'Internship', '0–1 years', false, false, 5),
 ('Content & Growth Marketer',      'Business',    'Remote (India)', 'Full-time',  '1–3 years', false, false, 6)
on conflict (title) do update set
  department = excluded.department,
  location = excluded.location,
  employment_type = excluded.employment_type,
  experience = excluded.experience;

-- ───────────────────────── technologies ─────────────────────────
insert into public.technologies (name, category, published, sort_order) values
 ('OpenAI / LLMs', 'ai', true, 1), ('Anthropic Claude', 'ai', true, 2),
 ('n8n / Make', 'automation', true, 3), ('Zapier', 'automation', true, 4),
 ('WhatsApp Business API', 'communication', true, 5), ('Twilio', 'communication', true, 6),
 ('HubSpot', 'crm', true, 7), ('Zoho CRM', 'crm', true, 8), ('Salesforce', 'crm', true, 9),
 ('Supabase', 'cloud', true, 10), ('PostgreSQL', 'database', true, 11),
 ('Google Workspace', 'productivity', true, 12),
 ('React', 'development', true, 13), ('Node.js', 'development', true, 14)
on conflict (name, category) do update set sort_order = excluded.sort_order;

-- ───────────────────────── announcement (idempotent, no unique constraint needed) ─────────────────────────
insert into public.announcements (text, cta_label, cta_to, active)
select 'AI agents that work with your existing business systems', 'Explore AI Agents', '/ai-agents', true
where not exists (
  select 1 from public.announcements
  where text = 'AI agents that work with your existing business systems'
);

-- ───────────────────────── social links ─────────────────────────
insert into public.social_links (label, href, sort_order) values
 ('LinkedIn',  'https://www.linkedin.com/company/itcyber-technologies', 1),
 ('Instagram', 'https://www.instagram.com/itcyber.tech', 2),
 ('X',         'https://x.com/itcybertech', 3)
on conflict (label) do update set href = excluded.href, sort_order = excluded.sort_order;
