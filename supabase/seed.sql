-- ═══════════════════════════════════════════════════════════════════════
-- ITCYBER — initial content seed
-- Run AFTER migrations 0001 + 0002. Safe to re-run (uses on-conflict).
-- Contact details are intentionally left empty: the admin must set real
-- values in Admin → Settings before phone/WhatsApp CTAs appear publicly.
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
   'AI agents, automation and business software — engineered around your systems.',
   'ITCYBER designs and deploys custom AI agents, intelligent automation systems, business software and AI-powered digital infrastructure for businesses.',
   null, null, null, null, null,          -- ⚠ set these in Admin → Settings
   'India · Serving clients nationwide & remotely',
   'Mon–Sat, 10:00–19:00 IST',
   '/og/itcyber-default.svg')
on conflict (id) do nothing;

-- ───────────────────────── services ─────────────────────────
insert into public.services (slug, title, short_description, category, featured, published, sort_order) values
 ('ai-agents',    'AI Agents',            'Autonomous AI agents that work across your business systems — sales, support, qualification and operations.', 'ai-agents', true,  true, 1),
 ('automation',   'Intelligent Automation','Connect your business applications and eliminate repetitive workflows end to end.',                         'automation', true, true, 2),
 ('integrations', 'Business Integrations','CRM, WhatsApp, email, ERP, calendars and payments — wired together so data flows once.',                      'integrations', true, true, 3),
 ('software',     'Custom Software',      'Dashboards, portals and AI-enabled applications built around your exact business processes.',                'software', true,  true, 4)
on conflict (slug) do nothing;

-- ───────────────────────── AI agents ─────────────────────────
insert into public.ai_agents (slug, name, role, description, demo_type, featured, published, sort_order) values
 ('sales',         'AI Sales Agent',           'Sales',       'Talks with leads, qualifies prospects and schedules meetings — then hands hot opportunities to your team.', 'chat',      true, true, 1),
 ('support',       'AI Support Agent',         'Support',     'Handles repetitive support queries instantly and escalates complex cases with full context.',                'chat',      true, true, 2),
 ('qualification', 'AI Lead Qualification Agent','Sales',    'Analyses every enquiry, scores it against your criteria and routes high-priority opportunities first.',      'pipeline',  true, true, 3),
 ('appointment',   'AI Appointment Agent',     'Operations',  'Checks live availability and schedules, reschedules and confirms appointments automatically.',               'calendar',  true, true, 4),
 ('operations',    'AI Operations Assistant',  'Operations',  'Produces reports, alerts and summaries so your team starts the day already briefed.',                        'report',    true, true, 5),
 ('custom',        'Custom AI Agent',          'Custom',      'Designed around your specific business logic, systems and decision rules.',                                  'workflow',  true, true, 6)
on conflict (slug) do nothing;

-- ───────────────────────── automations ─────────────────────────
insert into public.automations (slug, name, category, description, published, sort_order) values
 ('sales-pipeline',     'Sales Pipeline Automation',   'sales',       'New enquiry → AI qualification → CRM record → personalised follow-up → booking → dashboard.', true, 1),
 ('support-triage',     'Support Triage Automation',   'support',     'Incoming ticket → AI categorisation → priority routing → suggested reply → resolution log.',  true, 2),
 ('appointment-flow',   'Appointment Booking Flow',    'appointment', 'Booking request → availability check → confirmation → calendar hold → reminder sequence.',     true, 3),
 ('lead-management',    'Lead Management Automation',  'lead',        'Lead capture → dedupe → scoring → assignment → nurture → sales notification.',                 true, 4),
 ('ops-reporting',      'Operations Reporting',        'operations',  'Scheduled data pull → consolidation → anomaly detection → daily brief to managers.',           true, 5)
on conflict (slug) do nothing;

-- ───────────────────────── industries ─────────────────────────
insert into public.industries (slug, name, short_description, published, sort_order) values
 ('real-estate',           'Real Estate',           'Speed-to-lead, site-visit booking and buyer follow-up on autopilot.',      true, 1),
 ('healthcare',            'Healthcare',            'Patient appointment handling, reminders and front-desk relief.',           true, 2),
 ('education',             'Education',             'Enquiry qualification, admission follow-up and counsellor support.',       true, 3),
 ('ecommerce',             'E-commerce',            'Order support, cart recovery and review generation across channels.',      true, 4),
 ('agencies',              'Agencies',              'Client reporting, lead routing and delivery workflows for agencies.',      true, 5),
 ('professional-services', 'Professional Services', 'Intake, scheduling and matter tracking for consultancies and firms.',      true, 6),
 ('startups',              'Startups',              'Lean revenue and support operations that scale without headcount.',        true, 7),
 ('sme',                   'SMEs',                  'Practical automation for small teams that removes busywork first.',        true, 8)
on conflict (slug) do nothing;

-- ───────────────────────── jobs ─────────────────────────
insert into public.jobs (title, department, location, employment_type, experience, published, applications_open, sort_order) values
 ('AI Automation Engineer',        'Engineering', 'Remote (India)', 'Full-time', '2–5 years', true, true, 1),
 ('Full-stack Developer',          'Engineering', 'Remote (India)', 'Full-time', '2–5 years', true, true, 2),
 ('AI Solutions Architect',        'Engineering', 'Remote (India)', 'Full-time', '4–8 years', true, true, 3),
 ('Business Development Executive','Business',    'Remote (India)', 'Full-time', '1–4 years', true, true, 4),
 ('Automation Intern',             'Automation',  'Remote (India)', 'Internship','0–1 years', true, true, 5),
 ('Content & Growth Marketer',     'Business',    'Remote (India)', 'Full-time', '1–3 years', true, true, 6)
on conflict do nothing;

-- ───────────────────────── technologies ─────────────────────────
insert into public.technologies (name, category, published, sort_order) values
 ('OpenAI / LLMs', 'ai', true, 1), ('Anthropic Claude', 'ai', true, 2),
 ('n8n / Make', 'automation', true, 3), ('Zapier', 'automation', true, 4),
 ('WhatsApp Business API', 'communication', true, 5), ('Twilio', 'communication', true, 6),
 ('HubSpot', 'crm', true, 7), ('Zoho CRM', 'crm', true, 8), ('Salesforce', 'crm', true, 9),
 ('Supabase', 'cloud', true, 10), ('PostgreSQL', 'database', true, 11),
 ('Google Workspace', 'productivity', true, 12),
 ('React', 'development', true, 13), ('Node.js', 'development', true, 14)
on conflict do nothing;

-- ───────────────────────── announcement ─────────────────────────
insert into public.announcements (text, cta_label, cta_to, active) values
 ('AI agents that work with your existing business systems', 'Explore AI Agents', '/ai-agents', true);

-- ───────────────────────── social links ─────────────────────────
insert into public.social_links (label, href, sort_order) values
 ('LinkedIn',  'https://www.linkedin.com/company/itcyber-technologies', 1),
 ('Instagram', 'https://www.instagram.com/itcyber.tech', 2),
 ('X',         'https://x.com/itcybertech', 3)
on conflict do nothing;
