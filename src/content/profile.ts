export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zuhaibkhan.vercel.app").replace(/\/$/, "");

export const profile = {
  name: "Zuhaib Ahmad Khan",
  shortName: "Zuhaib",
  initials: "ZK",
  title: "Agentic Full-Stack Engineer",
  role: "Full-Stack Engineer & Product Lead",
  company: "Surgy Innovation Labs",
  companyUrl: "https://surgy.health",
  location: "Bengaluru, India",
  openTo: "open to remote or relocate",
  availability: "Open to full-time roles in full-stack, applied AI and mobile, remote, in Bengaluru or relocating.",
  headline: "I build hospital software end to end, along with the guardrails that let AI agents build it safely.",
  intro:
    "I'm a full-stack engineer and product lead. I take products from a hospital's first requirement to production: React and TypeScript frontends, PostgreSQL with Row-Level Security, serverless APIs, Flutter apps, AI integrations and the automation that connects them.",
  email: "zuhaibahmadkhan07@gmail.com",
  phone: "+91 63667 51866",
  phoneHref: "tel:+916366751866",
  whatsapp: "https://wa.me/916366751866",
  linkedin: "https://www.linkedin.com/in/zuhaib-ahmad-khan",
  github: "https://github.com/Deeneawal",
  leetcode: "https://leetcode.com/deeneawal",
  resumeHref: "/api/resume",
  resumeFile: "/resume/Zuhaib_Ahmad_Khan_CV.pdf",
  portrait: "/images/zuhaib-portrait.jpg",
} as const;

/** Headline numbers, kept identical to the résumé PDF. */
export const headlineStats = [
  { value: "370+", label: "database migrations shipped" },
  { value: "45+", label: "serverless APIs shipped" },
  { value: "55+", label: "test files written" },
  { value: "15", label: "audit-grade reports" },
] as const;

export const certifications = [
  { when: "Oct 2026", title: "Digital Personal Data Protection Act, 2023", issuer: "DPDPA.com · scored 98%" },
  { when: "Nov 2024", title: "Full Stack Developer", issuer: "Unified Mentor" },
  { when: "Nov 2024", title: "Web Development", issuer: "Internshala" },
  { when: "Aug 2024", title: "Data Analytics & Visualization Job Simulation", issuer: "Accenture · Forage" },
  { when: "Dec 2022", title: "Machine Learning", issuer: "Take It Smart" },
] as const;

export const posts = [
  {
    title: "The Hospital Chatbot Playbook: How SurgyCRM Turns Website Visitors Into Patients, 24/7",
    href: "https://surgy.health/blog/hospital-website-chatbot-surgy-assist",
    date: "24 Jul 2026",
    minutes: 11,
  },
  {
    title: "Field Force Management for Healthcare: How SurgyField Makes Every Referral Visit Countable",
    href: "https://surgy.health/blog/surgyfield-field-force-management-healthcare",
    date: "24 Jul 2026",
    minutes: 12,
  },
  {
    title: "Why Hospitals Need More Than a CRM: How SurgyCRM Closes the Gap Between Patient Acquisition and Lifetime Value",
    href: "https://surgy.health/blog/surgycrm-healthcare-crm-patient-journey-management",
    date: "11 Jun 2026",
    minutes: 11,
  },
] as const;
