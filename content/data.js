/*
  ALL of the website's words, projects and achievements live in this file.
  Change the text between the "quotes". Do not remove commas or brackets.

  Pictures:
    - Leave thumb / media / photo as "" and the site draws a placeholder.
    - To use a real picture, put the file in the assets folder and write its
      path, for example  thumb: "assets/projects/line-follower/thumb.jpg"

  Anything marked  sample: true  is made-up filler. Replace it, then delete
  the  sample: true  line.
*/
window.PORTFOLIO = {
  owner: {
    name: "Rubayed Al Imran",
    title: "Mechanical Engineering Student · Robotics & CAD",
    pitch: "I design, build and program machines, from first sketch to working robot.",
    bio: [
      "I'm a mechanical engineering student at KUET who has never been able to leave a machine alone until I understand how it works.",
      "I design in CAD, build with my own hands, then wire and code what I've built, because an idea only proves itself once it moves. I'm working toward a career in robotics and automation: machines that take on the hard, repetitive and dangerous work so people don't have to."
    ],
    motto: "There are no strings on me.",
    photo: "",
    facts: {
      University: "Khulna University of Engineering & Technology",
      Degree: "B.Sc. Mechanical Engineering",
      Year: "2nd year, graduating 2029",
      Based: "Khulna, Bangladesh",
      Status: "Open to internships and jobs"
    },
    coords: "Khulna 22.85° N 89.54° E",
    email: "rubayedalimran9909@gmail.com",
    resume: "assets/resume.pdf",
    links: {
      LinkedIn: "https://www.linkedin.com/in/rubayed-al-imran"
    }
  },

  /*
    Your real projects, taken from your résumé. Newest first.
    type: robotics | aircraft | cad | software | other
    Pictures: leave thumb and gallery entries as "" until you have them.
    keyStat is the one number shown large. Replace it with a real figure when you
    have one (wingspan, flight time, top speed, competition result...).
  */
  projects: [
    {
      id: "animatronics",
      mark: "MK-06",
      codename: "Mimic",
      title: "Animatronic eye and head mechanism",
      type: "robotics",
      summary: "Servo-driven eye and head mechanisms that move with lifelike timing.",
      keyStat: { value: "2025", label: "started, still in development" },
      specs: { Role: "Mechanism design, motion control", Tools: "Servos, mechanical linkages", Period: "Apr 2025 — present" },
      story: {
        problem: "",
        design: "Eye and head movement are driven by servos through mechanical linkages.",
        build: "Motion control and the synchronisation between axes are tuned until the movement reads as realistic.",
        result: ""
      },
      thumb: "",
      gallery: ["", "", ""],
      model: "",
      links: {}
    },
    {
      id: "rc-aircraft",
      mark: "MK-02",
      codename: "Kestrel",
      title: "RC aircraft and drones",
      type: "aircraft",
      summary: "RC airplanes and drones designed and built from custom mechanical and electronic parts.",
      keyStat: { value: "2022", label: "first build, still flying new ones" },
      specs: { Role: "Design, build, flight setup", Tools: "Custom airframes, motors, radio control", Period: "Jan 2022 — present" },
      story: {
        problem: "",
        design: "Each airframe is worked through for aerodynamics and structure before it is built.",
        build: "Motors are balanced, radio-control systems set up, and faults traced and fixed from one build to the next.",
        result: ""
      },
      thumb: "",
      gallery: ["", "", ""],
      model: "",
      links: {}
    },
    {
      id: "otto-bot",
      mark: "MK-04",
      codename: "Strider",
      title: "Otto Bot",
      type: "robotics",
      summary: "An Otto walking robot built and programmed on Arduino.",
      keyStat: { value: "2023", label: "started" },
      specs: { Role: "Build and programming", Tools: "Arduino, embedded components", Period: "Sep 2023 — present" },
      story: {
        problem: "",
        design: "",
        build: "Movement control and sensor interaction are integrated to give the robot basic automated behaviour.",
        result: ""
      },
      thumb: "",
      gallery: ["", ""],
      model: "",
      links: {}
    },
    {
      id: "line-follower",
      mark: "MK-01",
      codename: "Pathfinder",
      title: "Line-following robot and SoccerBot",
      type: "robotics",
      summary: "Robots that find and follow a path on their own, plus a SoccerBot.",
      keyStat: { value: "2021", label: "where the robotics started" },
      specs: { Role: "Mechanical assembly, motor control", Tools: "Motors, sensors, microcontroller", Period: "May 2021 — present" },
      story: {
        problem: "",
        design: "The robot detects the path and corrects its own movement to stay on it.",
        build: "Motor control, directional drive and the mechanical assembly were all done by hand.",
        result: ""
      },
      thumb: "",
      gallery: ["", ""],
      model: "",
      links: {}
    },
    {
      id: "solidworks-models",
      mark: "MK-05",
      codename: "Blueprint",
      title: "SolidWorks models and assemblies",
      type: "cad",
      summary: "Mechanical parts and assemblies modelled in SolidWorks.",
      keyStat: { value: "2024", label: "started" },
      specs: { Role: "CAD modelling", Tools: "SolidWorks", Period: "Jul 2024 — present" },
      story: {
        problem: "",
        design: "Parts and assemblies are modelled with attention to dimensional accuracy.",
        build: "Components are visualised to communicate the design concept.",
        result: ""
      },
      thumb: "",
      gallery: ["", "", "", ""],
      model: "",
      links: {}
    },
    {
      id: "voice-assistant",
      mark: "MK-03",
      codename: "Echo",
      title: "Voice-command assistant",
      type: "software",
      summary: "A basic assistant written in Python that responds to voice commands.",
      keyStat: { value: "2022", label: "built" },
      specs: { Role: "Programming", Tools: "Python", Period: "Jun 2022" },
      story: {
        problem: "",
        design: "",
        build: "Voice commands trigger simple automated tasks.",
        result: ""
      },
      thumb: "",
      gallery: [""],
      model: "",
      links: {}
    }
  ],

  /* type: "image" or "video". For video, media is a YouTube link. */
  achievements: [
    /* Empty frames, ready for your certificates and awards. For each one, write the
       real title, the year and who issued it, and put the picture's path in media.
       Add or remove lines freely. */
    { title: "Certificate slot 01", date: "", issuer: "Awaiting upload", media: "", type: "image" },
    { title: "Certificate slot 02", date: "", issuer: "Awaiting upload", media: "", type: "image" },
    { title: "Certificate slot 03", date: "", issuer: "Awaiting upload", media: "", type: "image" },
    { title: "Award slot 04", date: "", issuer: "Awaiting upload", media: "", type: "image" },
    { title: "Award slot 05", date: "", issuer: "Awaiting upload", media: "", type: "image" },
    { title: "Video slot 06", date: "", issuer: "Awaiting upload", media: "", type: "video" }
  ],
  /* Each tool: its name and where you used it. */
  skills: {
    /* usedIn is optional: write the project where you used the tool, or leave it "". */
    Design: [
      { name: "SolidWorks", usedIn: "" },
      { name: "AutoCAD", usedIn: "" },
      { name: "Blender", usedIn: "" },
      { name: "KeyShot", usedIn: "" }
    ],
    Analysis: [
      { name: "ANSYS", usedIn: "" }
    ],
    Fabrication: [
      { name: "3D printing", usedIn: "" },
      { name: "Machining", usedIn: "" },
      { name: "Welding", usedIn: "" },
      { name: "Soldering", usedIn: "" }
    ],
    Electronics: [
      { name: "Circuit design", usedIn: "" },
      { name: "Arduino", usedIn: "" },
      { name: "Raspberry Pi", usedIn: "" }
    ],
    Software: [
      { name: "Python", usedIn: "" },
      { name: "C++", usedIn: "" },
      { name: "Java", usedIn: "" }
    ]
  },

  timeline: [
    /* Add internships, team roles and other experience as new lines, newest first. */
    { when: "Dec 2024 — now", what: "B.Sc. Mechanical Engineering", where: "Khulna University of Engineering & Technology", detail: "Second-year undergraduate, graduating 2029." }
  ]
};