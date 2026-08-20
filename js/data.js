/* =========================================================================
   DATA.JS — All editable content lives here.
   Add images to assets/images/<folder>/ then reference the filename below.
   No HTML/CSS editing required to add real content.
   ========================================================================= */

const TIMELINE = [
  {
    title: "B.Sc. in Mechanical Engineering",
    org: "Khulna University of Engineering and Technology (KUET)",
    place: "Khulna, Bangladesh — currently 2nd year",
    date: "2023 — Present",
    desc: "Focusing on machine dynamics, additive manufacturing, and computer-aided design."
  },
  {
    title: "Higher Secondary Certificate (HSC)",
    org: "Govt. Syed Hatem Ali College, Barishal",
    place: "GPA: 5.00 (General Scholarship)",
    date: "2023"
  },
  {
    title: "Secondary School Certificate (SSC)",
    org: "Barisal Zilla School",
    place: "GPA: 5.00 (General Scholarship)",
    date: "2021"
  },
  {
    title: "Junior School Certificate (JSC)",
    org: "Barisal Zilla School",
    place: "GPA: 5.00 (General Scholarship)",
    date: "2018"
  },
  {
    title: "Primary School Certificate (PSC)",
    org: "Barisal Zilla School",
    place: "GPA: 5.00 (Talentpool Scholarship)",
    date: "2015"
  }
];

const SKILLS = [
  {
    category: "CAD & 3D Modeling",
    items: [
      { name: "SolidWorks", level: 95, note: "Advanced" },
      { name: "AutoCAD", level: 50, note: "Intermediate" }
    ]
  },
  {
    category: "Automobile Engineering",
    items: [
      { name: "Aerodynamic Surfacing", level: 80, note: "Advanced" },
      { name: "Engine Kinematics", level: 75, note: "Advanced" },
      { name: "Class-A Surfacing", level: 70, note: "Intermediate" }
    ]
  },
  {
    category: "Programming",
    items: [
      { name: "MATLAB", level: 60, note: "Intermediate" },
      { name: "C Programming", level: 55, note: "Intermediate" }
    ]
  }
];

const PROJECTS = [
  {
    title: "Custom Paper Hole Punch",
    category: "Mechanical Design",
    desc: "A complete mechanical design of a desktop paper hole punch, featuring a robust steel linkage mechanism and manufacturable sheet-metal housing.",
    tags: ["SOLIDWORKS", "MACHINE DESIGN"],
    image: "assets/images/projects/hole-punch.jpg"
  },
  {
    title: "Ferrari F1",
    category: "Automotive",
    desc: "Parametric CAD modeling, high-downforce aerodynamic surface design, and structural chassis layout of an F1-inspired concept car.",
    tags: ["SOLIDWORKS", "AERODYNAMICS", "CFD"],
    image: "assets/images/projects/ferrari-f1.jpg"
  },
  {
    title: "BMW Z4",
    category: "Automotive",
    desc: "Detailed exterior body surface design, structural chassis modeling, and aesthetic panel-gap refinement.",
    tags: ["SOLIDWORKS", "CLASS-A SURFACING"],
    image: "assets/images/projects/bmw-z4.jpg"
  },
  {
    title: "V6 Engine",
    category: "Mechanical Design",
    desc: "Complete mechanical CAD assembly of a high-performance V6 internal combustion engine, modeled component by component.",
    tags: ["SOLIDWORKS ASSEMBLIES", "ENGINE KINEMATICS"],
    image: "assets/images/projects/v6-engine.jpg"
  },
  {
    title: "Iron Assistant",
    category: "Robotics",
    desc: "Multi-articulated robotic assistant framework featuring precision servo motor housing and jointed linkage design.",
    tags: ["SOLIDWORKS", "ROBOTICS", "SERVO KINEMATICS"],
    image: "assets/images/projects/iron-assistant.jpg"
  },
  {
    title: "Wall Cabinet",
    category: "Furniture CAD",
    desc: "Modular wall-mounted cabinet system design with parametric woodworking joinery and hardware integration.",
    tags: ["SOLIDWORKS", "FURNITURE CAD", "WOODWORKING"],
    image: "assets/images/projects/wall-cabinet.jpg"
  },
  {
    title: "Angry Bird",
    category: "3D Modeling",
    desc: "3D character surface modeling, mechanical launcher-mechanism design, and physical simulation study.",
    tags: ["SOLIDWORKS", "3D MODELING"],
    image: "assets/images/projects/angry-bird.jpg"
  },
  {
    title: "Blender (Appliance)",
    category: "Consumer Appliance",
    desc: "Ergonomic countertop kitchen blender design featuring a high-torque blade shaft assembly and safety interlock housing.",
    tags: ["SOLIDWORKS", "CONSUMER APPLIANCE"],
    image: "assets/images/projects/blender.jpg"
  }
];

const CERTIFICATES = [
  {
    title: "SOLIDWORKS Design Associate (CSWA)",
    issuer: "Dassault Systèmes",
    date: "2026",
    tag: "ASSOCIATE",
    image: "assets/images/certificates/cswa.jpg"
  },
  {
    title: "SOLIDWORKS Design Professional (CSWP)",
    issuer: "Dassault Systèmes",
    date: "2026",
    tag: "PROFESSIONAL",
    image: "assets/images/certificates/cswp.jpg"
  },
  {
    title: "Ignition 2026 — CAD Contest",
    issuer: "Dept. of Mechanical Engineering, KUET",
    date: "2026",
    tag: "COMPETITION",
    image: "assets/images/certificates/ignition-cad.jpg"
  },
  {
    title: "Ignition 2026 — Automobile Olympiad",
    issuer: "Dept. of Mechanical Engineering, KUET",
    date: "2026",
    tag: "COMPETITION",
    image: "assets/images/certificates/ignition-auto.jpg"
  },
  {
    title: "Programming & Robotics Workshop",
    issuer: "LOOP — Control Engineering Club, KUET",
    date: "2024",
    tag: "WORKSHOP",
    image: "assets/images/certificates/loop-workshop.jpg"
  },
  {
    title: "Calibration 2.0 — CAD Contest",
    issuer: "Dept. of Mechanical Engineering, KUET",
    date: "2024",
    tag: "COMPETITION",
    image: "assets/images/certificates/calibration.jpg"
  },
  {
    title: "3DSwymer Associate",
    issuer: "Dassault Systèmes",
    date: "2026",
    tag: "ASSOCIATE",
    image: "assets/images/certificates/3dswymer.jpg"
  },
  {
    title: "SOLIDWORKS Additive Manufacturing Associate",
    issuer: "Dassault Systèmes",
    date: "2026",
    tag: "ASSOCIATE",
    image: "assets/images/certificates/additive-mfg.jpg"
  }
];

const CONTACT_EMAIL = "rupak03042005@gmail.com";
