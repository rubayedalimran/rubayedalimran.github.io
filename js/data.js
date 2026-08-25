/* ============================================================
   PORTFOLIO_DATA
   ------------------------------------------------------------
   EVERYTHING you want to change about the CONTENT of this site
   lives in this one file. You should almost never need to touch
   index.html or the CSS just to update your info.

   Rules for editing safely:
   - Keep the quotes " " around text.
   - Keep the commas , between items.
   - Don't delete the [ ] or { } brackets.
   - To add a new project/skill/job/etc, copy an existing block
     (the { ... } part) and paste it, then edit the copy.
   ============================================================ */

const PORTFOLIO_DATA = {

  // ---------------------------------------------------------
  // SITE-WIDE / META
  // ---------------------------------------------------------
  meta: {
    siteTitle: "Alex Rhodes — Mechanical Engineer",
    tagline: "Mechanical Engineering Student",
    favicon: "assets/img/favicon.svg",
    ogImage: "assets/img/og-cover.jpg", // used when your link is shared on social media
    resumePdf: "assets/resume/resume.pdf", // put your real PDF here, keep this filename or update the path
  },

  // ---------------------------------------------------------
  // NAVIGATION (order here = order in the nav bar)
  // ---------------------------------------------------------
  nav: [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Systems", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Timeline", href: "#timeline" },
    { label: "Certs", href: "#certifications" },
    { label: "Contact", href: "#contact" },
  ],

  // ---------------------------------------------------------
  // HERO SECTION
  // ---------------------------------------------------------
  hero: {
    eyebrow: "SYSTEM STATUS: OPERATIONAL",
    name: "Alex Rhodes",
    // Each string types out, pauses, then deletes and types the next one
    rotatingRoles: [
      "Mechanical Engineering Student",
      "CAD & Product Design",
      "Robotics + Mechatronics",
      "Thermofluids Enthusiast",
      "Future Design Engineer",
    ],
    subtext:
      "I design, simulate, and build mechanical systems — from CAD models to working prototypes. Currently a Junior at State University, chasing every excuse to get grease under my fingernails.",
    primaryCta: { label: "View Projects", href: "#projects" },
    secondaryCta: { label: "Download Resume", href: "assets/resume/resume.pdf" },
    stats: [
      { value: 14, suffix: "+", label: "Projects Shipped" },
      { value: 3, suffix: "", label: "Years of CAD" },
      { value: 1200, suffix: "+", label: "Hrs in SolidWorks" },
      { value: 6, suffix: "", label: "Manufacturing Processes" },
    ],
  },

  // ---------------------------------------------------------
  // ABOUT SECTION
  // ---------------------------------------------------------
  about: {
    eyebrow: "UNIT SPECIFICATIONS",
    heading: "About the Engineer",
    paragraphs: [
      "I'm a Mechanical Engineering student who treats every assignment like a design review — I want to know not just that something works, but why it works, and how I'd make it fail on purpose to learn its limits.",
      "My focus areas are mechanical design, CAD/CAM, and applied robotics, with a growing interest in thermofluids and materials selection. I'm most at home somewhere between a CAD screen and a 3D printer that's mid-print.",
      "Outside of coursework, I run a small maker bench at home — motors, sensors, scrap aluminum, and whatever project idea won't leave me alone that week.",
    ],
    photo: "assets/img/profile.jpg", // replace with your own photo
    quickFacts: [
      { label: "Location", value: "Detroit, MI" },
      { label: "University", value: "State University" },
      { label: "Major", value: "Mechanical Engineering" },
      { label: "Expected Grad", value: "May 2027" },
      { label: "GPA", value: "3.8 / 4.0" },
      { label: "Availability", value: "Open to Internships" },
    ],
  },

  // ---------------------------------------------------------
  // SKILLS ("SYSTEMS") SECTION
  // Each category gets a group of gauges/bars.
  // level is 0-100.
  // ---------------------------------------------------------
  skillCategories: [
    {
      category: "Design & CAD",
      skills: [
        { name: "SolidWorks", level: 92 },
        { name: "Fusion 360", level: 85 },
        { name: "AutoCAD", level: 78 },
        { name: "GD&T", level: 74 },
      ],
    },
    {
      category: "Analysis & Simulation",
      skills: [
        { name: "FEA (ANSYS)", level: 70 },
        { name: "CFD Basics", level: 58 },
        { name: "MATLAB", level: 80 },
        { name: "Thermodynamics Modeling", level: 65 },
      ],
    },
    {
      category: "Manufacturing",
      skills: [
        { name: "3D Printing (FDM/SLA)", level: 90 },
        { name: "CNC Milling", level: 68 },
        { name: "Welding (MIG/TIG)", level: 55 },
        { name: "Sheet Metal Fab", level: 60 },
      ],
    },
    {
      category: "Programming & Controls",
      skills: [
        { name: "Python", level: 82 },
        { name: "Arduino / C++", level: 77 },
        { name: "ROS Basics", level: 45 },
        { name: "PLC / Ladder Logic", level: 40 },
      ],
    },
  ],

  // ---------------------------------------------------------
  // PROJECTS
  // categories: used for the filter buttons — keep names short
  // image: put a real screenshot/render in assets/img/
  // links: leave "" (empty string) to hide that button
  // ---------------------------------------------------------
  projectCategories: ["All", "Robotics", "CAD/Design", "Manufacturing", "Thermofluids"],

  projects: [
    {
      title: "Autonomous Line-Following Rover",
      category: "Robotics",
      image: "assets/img/project-rover.jpg",
      summary: "A 4WD rover with closed-loop PID line tracking and obstacle avoidance.",
      description:
        "Designed and built a 4-wheel-drive rover from scratch, including a custom 3D-printed chassis, PID-tuned line-following control loop, and ultrasonic obstacle avoidance. Wrote all firmware in C++ on an Arduino Mega and iterated through 5 chassis revisions to fix wheel-slip at high speed.",
      tools: ["SolidWorks", "Arduino/C++", "3D Printing", "PID Control"],
      role: "Sole designer & builder",
      outcome: "Completed 3m course in 4.2s, 0 collisions across 20 trials.",
      github: "https://github.com/yourusername/line-following-rover",
      demo: "",
      report: "",
    },
    {
      title: "Compact Cyclonic Separator",
      category: "Thermofluids",
      image: "assets/img/project-cyclone.jpg",
      summary: "CFD-optimized cyclone separator for a shop-vac dust collection add-on.",
      description:
        "Modeled airflow through a cyclonic separator geometry in ANSYS Fluent to optimize particle separation efficiency for a shop-vacuum pre-filter attachment. Iterated cone angle and inlet velocity across 6 CFD runs, then validated the final geometry by 3D printing and testing separation efficiency against sawdust of known particle size.",
      tools: ["ANSYS Fluent", "SolidWorks", "3D Printing"],
      role: "Design & simulation lead (team of 2)",
      outcome: "Achieved 89% particle separation efficiency, up from 61% baseline.",
      github: "https://github.com/yourusername/cyclonic-separator",
      demo: "",
      report: "assets/resume/cyclone-report.pdf",
    },
    {
      title: "Modular Bike Cargo Rack",
      category: "CAD/Design",
      image: "assets/img/project-rack.jpg",
      summary: "Tool-free modular cargo rack system for commuter bikes.",
      description:
        "Designed a modular, tool-free cargo rack system that lets commuters swap between a pannier mount, a crate mount, and a flat cargo deck in under 10 seconds. Full GD&T-toleranced drawing package, load-case hand calcs for a 20kg rated load, and a working aluminum prototype.",
      tools: ["SolidWorks", "GD&T", "Hand Calcs", "Aluminum Fabrication"],
      role: "Individual capstone-style project",
      outcome: "Rated and tested to 25kg static load with 1.5x safety factor.",
      github: "https://github.com/yourusername/modular-bike-rack",
      demo: "",
      report: "",
    },
    {
      title: "CNC-Milled Planetary Gearbox",
      category: "Manufacturing",
      image: "assets/img/project-gearbox.jpg",
      summary: "Custom 5:1 planetary gearbox machined from 6061 aluminum.",
      description:
        "Machined a fully custom 5:1 reduction planetary gearbox from 6061 aluminum on a 3-axis CNC mill, including sun gear, 3 planet gears, and internal ring gear. Cut all involute gear profiles using a rotary 4th axis and hand-fit tolerances to remove backlash.",
      tools: ["CNC Milling", "Fusion 360 CAM", "GD&T", "Gear Design"],
      role: "Individual project, machine shop practicum",
      outcome: "Backlash under 0.2°, 94% measured mechanical efficiency.",
      github: "https://github.com/yourusername/planetary-gearbox",
      demo: "",
      report: "",
    },
  ],

  // ---------------------------------------------------------
  // TIMELINE — Education + Experience, merged and sorted by date
  // type: "education" | "experience"
  // ---------------------------------------------------------
  timeline: [
    {
      type: "experience",
      date: "Jun 2026 — Aug 2026",
      title: "Mechanical Design Intern",
      org: "Ferrotech Manufacturing Co.",
      description:
        "Redesigned 3 fixture assemblies to cut changeover time by 22%. Created full drawing packages and ran first-article inspections on CMM.",
    },
    {
      type: "education",
      date: "Aug 2024 — Present",
      title: "B.S. Mechanical Engineering",
      org: "State University",
      description:
        "Relevant coursework: Thermodynamics, Fluid Mechanics, Machine Design, Materials Science, Controls, Manufacturing Processes.",
    },
    {
      type: "experience",
      date: "May 2025 — Aug 2025",
      title: "Robotics Team Lead",
      org: "University Robotics Club",
      description:
        "Led a 6-person subteam building a competition rover's drivetrain. Managed budget, part sourcing, and build schedule.",
    },
    {
      type: "education",
      date: "Aug 2022 — May 2024",
      title: "Associate of Science, Pre-Engineering",
      org: "Community College of Detroit",
      description:
        "Graduated with honors. Captain of the SAE Baja design sub-team in final year.",
    },
  ],

  // ---------------------------------------------------------
  // CERTIFICATIONS / ACHIEVEMENTS
  // ---------------------------------------------------------
  certifications: [
    { name: "SolidWorks CSWA", issuer: "Dassault Systèmes", year: "2025" },
    { name: "OSHA 10 — General Industry", issuer: "OSHA", year: "2024" },
    { name: "Autodesk CAD/CAM Certified User", issuer: "Autodesk", year: "2025" },
    { name: "1st Place, University Design Expo", issuer: "State University", year: "2025" },
    { name: "Dean's List (x3)", issuer: "State University", year: "2024–2026" },
    { name: "MATLAB Onramp Certificate", issuer: "MathWorks", year: "2024" },
  ],

  // ---------------------------------------------------------
  // TESTIMONIALS
  // ---------------------------------------------------------
  testimonials: [
    {
      quote:
        "One of the most methodical undergraduate designers I've worked with. Treats every failure mode as data, not a setback.",
      name: "Dr. Priya Anand",
      title: "Professor, Machine Design",
    },
    {
      quote:
        "Took ownership of the drivetrain redesign end-to-end — spec, CAD, machining, testing. That's rare at the intern level.",
      name: "Marcus Webb",
      title: "Senior Engineer, Ferrotech Manufacturing",
    },
  ],

  // ---------------------------------------------------------
  // CONTACT
  // Set formspreeEndpoint to your own form ID from formspree.io
  // (free tier works fine). Leave blank to just show a mailto link.
  // ---------------------------------------------------------
  contact: {
    heading: "Open a Channel",
    subtext:
      "Internship leads, project collabs, or just talking gearboxes — my inbox is open.",
    email: "alex.rhodes@example.com",
    formspreeEndpoint: "", // e.g. "https://formspree.io/f/abcdwxyz"
    socials: [
      { label: "GitHub", url: "https://github.com/yourusername", icon: "github" },
      { label: "LinkedIn", url: "https://linkedin.com/in/yourusername", icon: "linkedin" },
      { label: "Email", url: "mailto:alex.rhodes@example.com", icon: "mail" },
    ],
  },

  footer: {
    text: "Designed & built by Alex Rhodes.",
  },
};
