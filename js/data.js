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
    siteTitle: "Rubayed Al Imran — Mechanical Engineer",
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
    name: "Rubayed Al Imran",
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
    // JARVIS-style status line that cycles in the hero's top-right corner
    // (Priority 6). Mix real-ish diagnostic readouts with a couple of
    // genuinely personal/funny ones — that contrast is the whole point.
    // Keep each line short (~40 chars) so it doesn't wrap awkwardly.
    jarvisStatus: [
      "AMBIENT TEMP: NOMINAL",
      "STRUCTURAL INTEGRITY: 100%",
      "REACTOR OUTPUT: STABLE",
      "COFFEE RESERVES: CRITICALLY LOW",
      "CAD FILE COUNT: 1,247 AND CLIMBING",
      "DEADLINE PROXIMITY: UNCOMFORTABLY CLOSE",
      "SLEEP SCHEDULE: THEORETICAL",
      "TOLERANCE STACK-UP: WITHIN SPEC",
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
      { label: "Location", value: "Khulna, Bangladesh" },
      { label: "University", value: "Khulna University of Engineering & Technology" },
      { label: "Major", value: "Mechanical Engineering" },
      { label: "Expected Grad", value: "Dec 2028" },
      { label: "GPA", value: "3.37 / 4.0" },
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
        { name: "FEA (ANSYS)", level: 45 },
        { name: "CFD Basics", level: 24 },
        { name: "MATLAB", level: 10 },
        { name: "Thermodynamics Modeling", level: 38 },
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
        { name: "Arduino / C++", level: 90 },
        { name: "ROS Basics", level: 65 },
        { name: "PLC / Ladder Logic", level: 50 },
      ],
    },
  ],

  // ---------------------------------------------------------
  // PROJECTS
  // categories: used for the filter buttons — keep names short
  // image: put a real screenshot/render in assets/img/
  // links: leave "" (empty string) to hide that button
  // specs: shown in the modal's "Specs" tab — array of {label, value}.
  //   Leave the array empty ([]) to hide that tab's content gracefully.
  // gallery: shown in the modal's "Gallery" tab — array of image paths.
  //   Defaults to just the main `image` if you don't add more; add
  //   additional screenshots/renders/photos here as you take them.
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
      specs: [
        { label: "Chassis", value: "3D-printed PETG, 5 revisions" },
        { label: "Drivetrain", value: "4WD, dual differential" },
        { label: "Controller", value: "Arduino Mega 2560" },
        { label: "Sensors", value: "IR line array, 3x ultrasonic" },
        { label: "Top Speed", value: "0.9 m/s" },
      ],
      gallery: ["assets/img/project-rover.jpg"],
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
      specs: [
        { label: "Cone Angle", value: "12.5° (optimized)" },
        { label: "Inlet Velocity", value: "14 m/s" },
        { label: "CFD Runs", value: "6 iterations, ANSYS Fluent" },
        { label: "Separation Efficiency", value: "89% (up from 61%)" },
        { label: "Prototype Material", value: "PETG, 3D-printed" },
      ],
      gallery: ["assets/img/project-cyclone.jpg"],
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
      specs: [
        { label: "Rated Load", value: "20 kg (tested to 25 kg)" },
        { label: "Safety Factor", value: "1.5x" },
        { label: "Material", value: "6061 Aluminum extrusion" },
        { label: "Mount Modes", value: "Pannier / Crate / Flat deck" },
        { label: "Swap Time", value: "< 10 seconds, tool-free" },
      ],
      gallery: ["assets/img/project-rack.jpg"],
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
      specs: [
        { label: "Reduction Ratio", value: "5:1" },
        { label: "Material", value: "6061 Aluminum" },
        { label: "Backlash", value: "< 0.2°" },
        { label: "Mechanical Efficiency", value: "94% (measured)" },
        { label: "Machine", value: "3-axis CNC mill + 4th-axis rotary" },
      ],
      gallery: ["assets/img/project-gearbox.jpg"],
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
      title: "Sample",
      org: "Ferrotech Manufacturing Co.",
      description:
        "Redesigned 3 fixture assemblies to cut changeover time by 22%. Created full drawing packages and ran first-article inspections on CMM.",
    },
    {
      type: "education",
      date: "Oct 2024 — Present",
      title: "B.Sc Mechanical Engineering",
      org: "Khulna University of Engineering & Technology",
      description:
        "Relevant coursework: Thermodynamics, Fluid Mechanics, Machine Design, Materials Science, Controls, Manufacturing Processes.",
    },
    {
      type: "experience",
      date: "May 2025 — Aug 2025",
      title: "Sample",
      org: "University Robotics Club",
      description:
        "Led a 6-person subteam building a competition rover's drivetrain. Managed budget, part sourcing, and build schedule.",
    },
    {
      type: "education",
      date: "Feb 2022 — Dec 2023",
      title: "Sample",
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
    email: "rubayedalimran9909@gmail.com",
    formspreeEndpoint: "", // e.g. "https://formspree.io/f/abcdwxyz"
    socials: [
      { label: "GitHub", url: "https://github.com/rubayedalimran", icon: "github" },
      { label: "LinkedIn", url: "https://linkedin.com/in/rubayed-al-imran", icon: "linkedin" },
      { label: "Email", url: "mailto:rubayedalimran9909@gmail.com", icon: "mail" },
    ],
  },

  // ---------------------------------------------------------
  // GITHUB (Priority 8 — live stats)
  // Powers the "GitHub Telemetry" panel in About and the footer's
  // "Last calibrated" stamp, both pulled from GitHub's public REST API
  // at runtime (no auth needed, no server). If the API is unreachable
  // or rate-limited, both features degrade gracefully — see
  // initGithubStats() in main.js.
  // repo: used only for the "Last calibrated" commit date; leave as
  // "" to skip that call and just show the profile stats.
  // ---------------------------------------------------------
  github: {
    username: "rubayedalimran",
    repo: "rubayedalimran.github.io",
  },

  footer: {
    text: "Designed & built by Rubayed Al Imran.",
  },

  // ---------------------------------------------------------
  // EASTER EGG (Priority 6) — Konami code full-screen boot overlay.
  // konamiLines are revealed one at a time, terminal-log style.
  // Keep it short — this is a flourish, not a screen the visitor is
  // meant to sit and read for long.
  // ---------------------------------------------------------
  easterEgg: {
    konamiTitle: "MARK VII BOOT SEQUENCE INITIATED",
    konamiLines: [
      "BYPASSING SAFETY INTERLOCKS...",
      "SPOOLING REACTOR CORE...",
      "CALIBRATING SERVOS...",
      "HUD ONLINE.",
      "WELCOME BACK, PILOT.",
    ],
  },
};
