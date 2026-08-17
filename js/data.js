/*
  ============================================================
  SITE CONTENT DATA
  ============================================================
  This is the ONLY file you need to edit to update text,
  add photos, or add videos. HTML/CSS never need to change
  for routine content updates.

  HOW TO ADD A PHOTO OR RENDER TO A PROJECT:
    1. Drop the image file into: assets/images/<project-slug>/
    2. Add its filename to that project's "images" array below,
       e.g. "assets/images/rc-aircraft/wing-cad-01.jpg"
    3. Save. Refresh the page. Done — no other file needs editing.

  HOW TO ADD A VIDEO:
    1. Drop the video file (.mp4) into: assets/images/<project-slug>/
    2. Add it to the project's "video" field as a path string.
       Leave as null if you don't have one yet.

  Placeholder graphics (dashed cyan border, "IMAGE NOT YET ADDED")
  will keep showing until you replace a path. That is intentional —
  never delete the placeholder.svg file, it's the fallback.

  See CONTENT-GUIDE.md in the project root for the full walkthrough.
  ============================================================
*/

const SITE = {
  name: "MD Rubayed AL Imran",
  role: "Mechanical Engineering Student — CAD, Robotics & Embedded Systems",
  location: "Sirajganj, Bangladesh",
  email: "rubayedalimran9909@gmail.com",
  linkedin: "https://linkedin.com/in/rubayed-al-imran",
  github: "https://github.com/rubayedalimran", // update if your GitHub username changes
  resumePath: "resume/resume.pdf", // drop your resume PDF here and rename it exactly this
  heroStatement:
    "I design and build engineering systems that combine mechanical structure, electronics, and embedded control — from RC aircraft to vision-guided robots.",
  about:
    "I'm a Mechanical Engineering student at Khulna University of Engineering & Technology (KUET), working across CAD design, robotics, and embedded electronics. My projects move between disciplines by necessity: an RC aircraft needs structural and aerodynamic design as much as it needs a working control system, and a tracking robot needs a mechanical chassis as much as it needs working code. I use SolidWorks, Fusion 360, and Ansys for design and simulation, and Arduino/ESP32-based embedded systems with KiCad/Altium for the electronics side. Most of what's below is ongoing work, not finished products — I've tried to be specific about what stage each project is actually at."
};

// FILTER TAGS — only categories with real supporting projects are listed.
// If you add a project in a new category, add the tag here too.
const FILTERS = [
  "All",
  "Mechanical Design",
  "CAD",
  "Robotics",
  "Embedded Systems",
  "Electronics",
  "Aircraft",
  "Automotive"
];

// tier: "major" = full case study, "secondary" = compact card, "minor" = small grid item
const PROJECTS = [
  {
    slug: "rc-aircraft",
    tier: "major",
    title: "RC Aircraft & Drone Development",
    subtitle: "Personal Engineering & Aerodynamics Project",
    dates: "Jan 2022 – Present",
    status: "ongoing",
    statusLabel: "Ongoing",
    tags: ["Mechanical Design", "CAD", "Aircraft"],
    contribution: "Designed by me · Built by me",
    overview:
      "Design and construction of RC airplanes and drones, built around custom mechanical and electronic components rather than off-the-shelf kits.",
    objective:
      "Build airframes that balance structural weight against strength, while keeping the electronics layout serviceable and the center of gravity correct for stable flight.",
    myRole:
      "I handled the airframe design, structural layout, motor/propeller positioning, and the remote-control system integration for each build.",
    process:
      "Each aircraft starts as a concept sketch, moves into CAD for structural layout and CG checks, then into a physical prototype for flight testing. Issues found in testing — usually balance or structural weak points — feed back into the next revision.",
    decisions:
      "Motor and propeller placement, wing geometry, and fuselage structure are chosen around weight distribution and expected flight loads, then adjusted based on how the physical build actually balances and flies.",
    engineeringImages: [],
    electronicsImages: [],
    prototypeImages: [],
    testing:
      "Flight testing focuses on stability, control response, and structural integrity under normal flight loads.",
    problems:
      "Early builds required rebalancing after CG calculations didn't match real flight behavior — a recurring lesson in why physical testing has to follow CAD, not replace it.",
    futureImprovements:
      "Ongoing work on lighter structural approaches and more modular, quickly-detachable wing sections.",
    images: ["assets/images/placeholder.svg"],
    video: null
  },
  {
    slug: "human-tracking-robot",
    tier: "major",
    title: "Human-Tracking Robot",
    subtitle: "Vision-Guided Robot — ESP32 & HuskyLens",
    dates: "In development",
    status: "in-progress",
    statusLabel: "In Development",
    tags: ["Robotics", "Embedded Systems", "Electronics"],
    contribution: "Designed by me · Currently building",
    overview:
      "A multifunctional robot built around an ESP32 and a HuskyLens vision sensor, intended to detect and track a person using onboard motor control.",
    objective:
      "Combine vision-based detection with real-time motor control in a single embedded system, integrating sensors, display, and audio I/O around one control board.",
    myRole:
      "I'm designing the mechanical structure and the electronics/embedded architecture — sensor integration, motor control, and the communication between modules.",
    process:
      "Currently in active development: mechanical structure and core electronics are in progress, with vision tracking and motor control being built and tested module by module rather than all at once.",
    decisions:
      "ESP32 was chosen for the combination of processing headroom and built-in wireless, with HuskyLens handling on-sensor vision processing to keep the main controller free for motor control and I/O.",
    engineeringImages: [],
    electronicsImages: [],
    prototypeImages: [],
    testing:
      "Module-level testing is underway; full system testing hasn't started yet. This section will be updated as results come in.",
    problems:
      "To be documented as the build progresses.",
    futureImprovements:
      "Complete motor control integration, then move to full-system testing.",
    images: ["assets/images/placeholder.svg"],
    video: null
  },
  {
    slug: "drift-car",
    tier: "major",
    title: "4WD BLDC RC Drift Car",
    subtitle: "1:10–1:14 Scale Drift Chassis",
    dates: "Prototype tested",
    status: "tested",
    statusLabel: "Prototype — Tested",
    tags: ["Mechanical Design", "CAD", "Automotive"],
    contribution: "Designed by me · Built by me · Tested",
    overview:
      "A 4WD, BLDC-powered RC drift car chassis, designed with attention to weight distribution, suspension geometry, and drivetrain layout for controlled oversteer.",
    objective:
      "Build a 4WD drivetrain and chassis that holds a controllable drift rather than just high-speed grip, which shifts the design priorities around suspension and weight balance.",
    myRole:
      "I designed the chassis, suspension and steering geometry, and drivetrain layout, and built and tested the working prototype.",
    process:
      "CAD design of the chassis and suspension came first, followed by component selection (motors, battery, drivetrain parts), then assembly and iterative on-track testing.",
    decisions:
      "4WD BLDC drivetrain was chosen over 2WD for more controllable power delivery through a drift, with weight distribution tuned in CAD before committing to the physical build.",
    engineeringImages: [],
    electronicsImages: [],
    prototypeImages: [],
    testing:
      "The prototype has been built and tested on-track, with results feeding back into suspension and weight-balance adjustments.",
    problems:
      "To be filled in with specific issues found during testing.",
    futureImprovements:
      "Further tuning of weight distribution and suspension response based on test results.",
    images: ["assets/images/placeholder.svg"],
    video: null
  },

  // ---- SECONDARY PROJECTS (compact cards) ----
  {
    slug: "animatronics",
    tier: "secondary",
    title: "Animatronics Mechanism Design",
    subtitle: "Mechanical Motion & Expression System",
    dates: "Apr 2025 – Present",
    statusLabel: "Ongoing",
    tags: ["Mechanical Design", "Robotics"],
    contribution: "Designed by me · Built by me",
    overview:
      "Animatronic eye and head movement mechanisms built using servo systems and mechanical linkages, focused on realistic, synchronized motion.",
    images: ["assets/images/placeholder.svg"]
  },
  {
    slug: "otto-bot",
    tier: "secondary",
    title: "Otto Bot Robotics Development",
    subtitle: "Arduino-Based Pet Robot Project",
    dates: "Sep 2023 – Present",
    statusLabel: "Ongoing",
    tags: ["Robotics", "Embedded Systems"],
    contribution: "Built by me · Programmed by me",
    overview:
      "An Arduino-based Otto robot with movement control, sensor interaction, and basic automation behaviors.",
    images: ["assets/images/placeholder.svg"]
  },
  {
    slug: "line-follower",
    tier: "secondary",
    title: "Line Following Robot & SoccerBot",
    subtitle: "Autonomous Robotics Project",
    dates: "May 2021 – Present",
    statusLabel: "Ongoing",
    tags: ["Robotics", "Embedded Systems"],
    contribution: "Built by me · Programmed by me",
    overview:
      "Autonomous path detection and movement-correction systems, with motor control and mechanical assembly for line-following and soccer-playing robot platforms.",
    images: ["assets/images/placeholder.svg"]
  },

  // ---- OTHER EXPERIMENTS (small grid) ----
  {
    slug: "ai-assistant",
    tier: "minor",
    title: "Basic AI Assistant Development",
    subtitle: "Python-Based Automation Project",
    dates: "Jun 2022",
    tags: ["Electronics"],
    overview:
      "A basic AI assistant built in Python with voice-command and automation concepts.",
    images: ["assets/images/placeholder.svg"]
  },
  {
    slug: "cad-general",
    tier: "minor",
    title: "CAD Design & 3D Modeling",
    subtitle: "SolidWorks Design Projects",
    dates: "Jul 2024 – Present",
    tags: ["CAD", "Mechanical Design"],
    overview:
      "Mechanical CAD models and assemblies built in SolidWorks, focused on component visualization and dimensional accuracy.",
    images: ["assets/images/placeholder.svg"]
  }
];

// CERTIFICATIONS — none confirmed yet. Add objects here in this shape when ready:
// { name: "Certification Name", issuer: "Issuing Org", date: "MM/YYYY", link: "https://..." }
const CERTIFICATIONS = [];

// SKILLS — grouped, no fake percentage levels.
const SKILLS = {
  "Mechanical Design & CAD": ["SolidWorks", "AutoCAD", "Fusion 360", "Ansys (Simulation)", "Blender / Keyshot (Visualization)"],
  "Electronics & PCB": ["KiCad", "Altium", "Circuit Design", "Microcontroller Integration", "Breadboard Prototyping", "Power Distribution & Regulation"],
  "Programming": ["Python", "C++", "Java"]
};
