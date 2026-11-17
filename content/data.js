/*
  ALL of the website's words, projects and achievements live in this file.
  Change the text between the "quotes". Do not remove commas or brackets.

  Pictures for a project live in  assets/projects/<project id>/  and are named
  01.jpg, 02.jpg, 03.jpg ...  The first one is the thumbnail.
  shots("soccerbot", 2) means "the soccerbot folder has 2 pictures".
  To add a picture: save it as the next number in that folder and raise the count.
*/
function shots(id, count) {
  var list = [];
  for (var i = 1; i <= count; i++) list.push("assets/projects/" + id + "/" + ("0" + i).slice(-2) + ".jpg");
  return list;
}

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
    photo: "assets/profile.jpg",
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
    Projects. rank sets the order on the ring: 1 is shown first, so keep your strongest work at the top.
    A project with no picture yet is kept here but not shown on the site.
    shows = the skills the project demonstrates (appear as tags in its dossier).
    type: robotics | mechanisms | machines | parts | software
    The descriptions were written from your screenshots, file names and résumé.
    Correct anything that is wrong, and fill in story.problem / story.result and
    real numbers (keyStat) where you have them. Leave a line as "" to hide it.
  */
  projects: [
    {
      id: "animatronic-eyes", mark: "MK-02", codename: "Gaze", type: "robotics", rank: 2,
      shows: ["Mechanism design","Servo actuation","Behaviour programming","3D printing"],
      title: "Animatronic eyes",
      summary: "A working pair of animatronic eyes: 3D-printed eyeballs and eyelids moved by micro servos, programmed to look around, twitch and sleep on their own.",
      keyStat: { value: "Built", label: "printed, wired and running" },
      specs: { Role: "Mechanism design, electronics, programming", Tools: "3D printer, micro servos, microcontroller", Period: "Apr 2025 — present" },
      story: {
        problem: "",
        design: "Each eye sits in its own socket with separate eyelids, and the servos move them through mechanical linkages.",
        build: "The mechanism is 3D printed. Its code steps through behaviours such as small random eye movements and sleep, and the timing between axes is tuned until the movement reads as realistic.",
        result: ""
      },
      gallery: shots("animatronic-eyes", 1), model: "", links: {}
    },
    {
      id: "line-follower", mark: "MK-01", codename: "Pathfinder", type: "robotics", rank: 1,
      shows: ["Embedded electronics","Sensor arrays","Mould making","Mechanical assembly"],
      title: "Line-following robot",
      summary: "A line-following robot built from scratch: a hand-wired control board with an OLED menu, a curved sensor array out front, and wheels cast in moulds I designed and printed.",
      keyStat: { value: "Built", label: "by hand: board, sensors, wheels" },
      specs: { "Role": "Design, electronics, build", "Tools": "SolidWorks, perfboard electronics, OLED display", "Period": "May 2021 — present" },
      story: {
        problem: "",
        design: "A curved array of sensors reads the line ahead of the wheels, and the controller corrects the robot's path as it drives. The chassis clamps the two drive motors to a flat base plate.",
        build: "The control board is hand-wired on perfboard with a small OLED screen for the run menu. The wheels were cast in printed moulds.",
        result: ""
      },
      gallery: shots("line-follower", 4), model: "", links: {}
    },
    {
      id: "robot-arm", mark: "MK-04", codename: "Longreach", type: "robotics", rank: 4,
      shows: ["Robot arm design","Servo joints","3D printing","Manual control wiring"],
      title: "Robotic arm",
      summary: "A 3D-printed robotic arm I designed, printed and wired: servo joints on a rotating base, driven by hand from two joysticks and two dials.",
      keyStat: { value: "Built", label: "printed, wired and working" },
      specs: { "Role": "Design, 3D printing, wiring", "Tools": "SolidWorks, 3D printer, servos, joysticks, potentiometers", "Parts": "Base, turret, two arm links, wrist, gripper" },
      story: {
        problem: "",
        design: "The arm turns on its base, then reaches through two links to a wrist that carries the gripper. It was modelled in full first, with a servo at each joint and the wiring routed through the hollow links.",
        build: "Every part is 3D printed. Two joysticks and two potentiometers on a hand-wired board set the joint angles, so the arm can be driven by hand on the bench.",
        result: ""
      },
      gallery: shots("robot-arm", 2), model: "", links: {}
    },
    {
      id: "race-car", mark: "MK-09", codename: "Slipstream", type: "machines", rank: 9,
      shows: ["Body modelling","Large assemblies"],
      title: "Formula-style race car",
      summary: "A Formula-style race car modelled as a full assembly: bodywork, front and rear wings, suspension arms and wheels.",
      keyStat: { value: "Full car", label: "body, wings, suspension, wheels" },
      specs: { "Role": "CAD modelling", "Tools": "SolidWorks", "Parts": "Monocoque and bodywork, wings, suspension, wheels" },
      story: {
        problem: "",
        design: "The body is shaped as flowing surfaces from nose to engine cover, with the wings, suspension arms and wheels added as separate parts.",
        build: "",
        result: ""
      },
      gallery: shots("race-car", 1), model: "", links: {}
    },
    {
      id: "shield-chassis", mark: "MK-11", codename: "Glare", type: "robotics", rank: 11,
      shows: ["Sheet metal design","Lightweighting"],
      title: "Sheet-metal robot chassis",
      summary: "A robot chassis in cut and folded sheet metal: a front shield plate with a face cut into it, perforated side walls and a lightened base.",
      keyStat: { value: "Sheet metal", label: "cut, folded and lightened" },
      specs: { "Role": "CAD design", "Tools": "SolidWorks sheet metal", "Parts": "Shield plate, base, side walls, cross rods" },
      story: {
        problem: "",
        design: "The front plate works as a shield and carries the cut-out face. Behind it, the base and side walls are cut with holes to take weight out while keeping the frame stiff.",
        build: "",
        result: ""
      },
      gallery: shots("shield-chassis", 2), model: "", links: {}
    },
    {
      id: "compliant-clip", mark: "MK-13", codename: "Flex", type: "parts", rank: 13,
      shows: ["Compliant mechanisms","Reverse engineering","Design for 3D printing"],
      title: "Compliant clip",
      summary: "A one-piece clip with no separate spring: the serpentine flexure and the toothed jaws are a single part, sketched over a photo of a real clip and fully dimensioned.",
      keyStat: { value: "1 part", label: "spring and jaws in one piece" },
      specs: { "Role": "Reverse engineering, CAD", "Tools": "SolidWorks" },
      story: {
        problem: "",
        design: "A photo of the real clip sits behind the sketch, so every curve and angle can be traced and dimensioned. The serpentine section bends to act as the spring.",
        build: "",
        result: ""
      },
      gallery: shots("compliant-clip", 2), model: "", links: {}
    },
    {
      id: "animatronics", mark: "MK-03", codename: "Mimic", type: "robotics", rank: 3,
      shows: ["Mechanism design","Complex assemblies","Organic shapes"],
      title: "Animatronic skull",
      summary: "A full animatronic head modelled part by part in SolidWorks: skull, jaw, eyes and the mechanisms that move them, inside a head shell.",
      keyStat: { value: "Full head", label: "modelled as one assembly" },
      specs: { Role: "CAD design, mechanism layout", Tools: "SolidWorks" },
      story: {
        problem: "",
        design: "The eyes, their surrounding mechanism and the head shell are modelled as one assembly, with the eye and head movement driven by servos through mechanical linkages.",
        build: "",
        result: ""
      },
      gallery: shots("animatronics", 3), model: "", links: {}
    },
    {
      id: "hexapod", mark: "MK-06", codename: "Arachne", type: "robotics", rank: 6,
      shows: ["Legged robotics","Servo joints","Design for 3D printing"],
      title: "Hexapod robot chassis",
      summary: "A six-legged walking robot: each leg has coxa, femur and tibia links driven by SG90 servos, with a touch switch at every foot.",
      keyStat: { value: "6 legs", label: "three servo joints per leg" },
      specs: { Role: "CAD design", Tools: "SolidWorks, SG90 servos", Parts: "Base, coxa, femur, tibia, servo pivots and caps, limiters, touch switches" },
      story: {
        problem: "",
        design: "The body is a central base plate carrying six identical legs. Each leg is a coxa, femur and tibia chain with a servo at every joint.",
        build: "Servo pivots, caps and travel limiters are separate parts so they can be printed and replaced individually.",
        result: ""
      },
      gallery: shots("hexapod", 1), model: "", links: {}
    },
    {
      id: "soccerbot", mark: "MK-05", codename: "Striker", type: "robotics", rank: 5,
      shows: ["Sheet metal design","Drivetrain layout","Electronics packaging"],
      title: "SoccerBot",
      summary: "A four-wheel-drive soccer robot with a folded sheet-metal body, front scoops and a vented cover over the motors, battery and speed controllers.",
      keyStat: { value: "4WD", label: "one motor per wheel" },
      specs: { Role: "CAD design, mechanical assembly, motor control", Tools: "SolidWorks", Parts: "Body, brackets, covers, motors, ESCs, battery, bearings, wheels" },
      story: {
        problem: "",
        design: "Four motors sit in pairs along the body with the battery and speed controllers between them. Angled plates at the front guide the ball.",
        build: "The body, brackets and slotted cover are designed as flat sheet-metal parts that fold into shape.",
        result: ""
      },
      gallery: shots("soccerbot", 3), model: "", links: {}
    },
    {
      id: "wishbone", mark: "MK-08", codename: "Apex", type: "mechanisms", rank: 8,
      shows: ["Suspension geometry","Linkage design","Sub-assemblies"],
      title: "Double-wishbone suspension",
      summary: "A double-wishbone suspension for both sides of a chassis, with inboard coil-over dampers worked through rocker arms.",
      keyStat: { value: "Inboard", label: "dampers, driven by rockers" },
      specs: { Role: "CAD design", Tools: "SolidWorks", Parts: "Upper and lower wishbones, uprights, rockers, coil-over dampers, chassis rail" },
      story: {
        problem: "",
        design: "Upper and lower wishbones locate each upright. Instead of standing at the wheel, the coil-over dampers lie along the chassis rail and are driven by rocker arms.",
        build: "Springs, damper bodies and mounts are modelled as their own sub-assembly.",
        result: ""
      },
      gallery: shots("wishbone", 1), model: "", links: {}
    },
    {
      id: "drawing-machine", mark: "MK-10", codename: "Scribe", type: "machines", rank: 10,
      shows: ["Motion systems","Stepper motors","Printed fixtures"],
      title: "2D drawing machine",
      summary: "A two-axis pen plotter: NEMA 17 stepper motors move a pen carriage along guide rods over a flat bed.",
      keyStat: { value: "2 axes", label: "NEMA 17 stepper drive" },
      specs: { Role: "CAD design", Tools: "SolidWorks, NEMA 17 steppers", Parts: "Powered and idle rod ends, carriage, pen slider, servo arm, electronics housing" },
      story: {
        problem: "",
        design: "Two pairs of rods cross over the bed. A central carriage rides on both, so each motor moves the pen along one axis.",
        build: "The printed parts include the rod ends, the pen slider and its lift arm, and a housing with a lid for the electronics.",
        result: ""
      },
      gallery: shots("drawing-machine", 4), model: "", links: {}
    },
    {
      id: "seeder", mark: "MK-12", codename: "Furrow", type: "machines", rank: 12,
      shows: ["Machine design","Agricultural machinery","Frame design"],
      title: "Agricultural seeder",
      summary: "A hand-pushed seed planter: a lugged drive wheel, a seed hopper, a furrow opener and a rear press wheel on a tubular frame.",
      keyStat: { value: "Push", label: "powered by the drive wheel" },
      specs: { Role: "CAD design", Tools: "SolidWorks", Parts: "Lugged wheel, frame, hopper, furrow opener, press wheel" },
      story: {
        problem: "",
        design: "The lugged front wheel grips the soil as the machine is pushed. The opener cuts the furrow below the hopper, and the rear wheel follows behind it.",
        build: "",
        result: ""
      },
      gallery: shots("seeder", 1), model: "", links: {}
    },
    {
      id: "rc-aircraft", mark: "MK-07", codename: "Kestrel", type: "machines", rank: 7,
      shows: ["Aerodynamics","Airframe structure","Radio control"],
      title: "RC aircraft and drones",
      summary: "RC aircraft worked out in CAD before they are built: a high-wing airplane on a boom fuselage with landing gear, and a twin-propeller delta wing.",
      keyStat: { value: "2 airframes", label: "modelled, building since 2022" },
      specs: { Role: "Design, build, flight setup", Tools: "Custom airframes, motors, radio control", Period: "Jan 2022 — present" },
      story: {
        problem: "",
        design: "Each airframe is modelled in full first, including motor mounts, landing gear and tail surfaces, and its mass properties are checked in CAD.",
        build: "Motors are balanced, radio-control systems set up, and faults traced and fixed from one build to the next.",
        result: ""
      },
      gallery: shots("rc-aircraft", 2), model: "", links: {}
    },
    {
      id: "otto-bot", mark: "MK-15", codename: "Tiptoe", type: "robotics", rank: 15,
      shows: ["Arduino","Embedded programming"],
      title: "Otto Bot",
      summary: "An Otto walking robot built and programmed on Arduino.",
      keyStat: { value: "2023", label: "started" },
      specs: { Role: "Build and programming", Tools: "Arduino, embedded components", Period: "Sep 2023 — present" },
      story: {
        problem: "",
        design: "",
        build: "Movement control and sensor interaction are integrated to give the robot basic automated behaviour.",
        result: ""
      },
      gallery: ["", ""], model: "", links: {}
    },
    {
      id: "vent-clip", mark: "MK-14", codename: "Patch", type: "parts", rank: 14,
      shows: ["Reverse engineering","3D printing","Repair"],
      title: "Replacement vent clip",
      summary: "A broken plastic vent clip, measured, remodelled and 3D printed. The white print sits beside the black original.",
      keyStat: { value: "Repair", label: "from broken part to printed one" },
      specs: { Role: "Reverse engineering, CAD, 3D printing", Tools: "SolidWorks, 3D printer" },
      story: {
        problem: "The original clip had snapped and no spare was available.",
        design: "The broken part was measured and rebuilt as a model.",
        build: "The replacement was printed and checked against the original.",
        result: ""
      },
      gallery: shots("vent-clip", 1), model: "", links: {}
    },
    {
      id: "voice-assistant", mark: "MK-16", codename: "Echo", type: "software", rank: 16,
      shows: ["Python","Automation"],
      title: "Voice-command assistant",
      summary: "A basic assistant written in Python that responds to voice commands.",
      keyStat: { value: "2022", label: "built" },
      specs: { Role: "Programming", Tools: "Python", Period: "Jun 2022" },
      story: {
        problem: "",
        design: "",
        build: "Voice commands trigger simple automated tasks.",
        result: ""
      },
      gallery: [""], model: "", links: {}
    }
  ],

  /*
    Achievements. media can be a picture or a PDF; a PDF's first page is shown
    in the frame, and clicking it opens the full certificate.
  */
  achievements: [
    { title: "Working Committee 2026: Assistant IT & Resource Officer", date: "2026", issuer: "CADers", media: "assets/certificates/caders-committee.jpg" },
    { title: "SOLIDWORKS Design Associate (CSWA)", date: "Jul 2026", issuer: "Dassault Systèmes", media: "assets/certificates/cswa.pdf", id: "C-Z3WV8RSXFY" },
    { title: "SOLIDWORKS Electrical Design Associate", date: "Aug 2026", issuer: "Dassault Systèmes", media: "assets/certificates/electrical.pdf", id: "C-5C2FEJ3AHB" },
    { title: "SOLIDWORKS Additive Manufacturing Associate", date: "Aug 2026", issuer: "Dassault Systèmes", media: "assets/certificates/additive-manufacturing.pdf", id: "C-B2SGNQPY5H" },
    { title: "SOLIDWORKS Sustainability Associate", date: "Aug 2026", issuer: "Dassault Systèmes", media: "assets/certificates/sustainability.pdf", id: "C-Y6UXGTP3ZE" },
    { title: "SOLIDWORKS xDesign Associate", date: "Aug 2026", issuer: "Dassault Systèmes", media: "assets/certificates/xdesign.pdf", id: "C-F6XCME458L" },
    { title: "SOLIDWORKS xShape Associate", date: "Aug 2026", issuer: "Dassault Systèmes", media: "assets/certificates/xshape.pdf", id: "C-W8DY4LCJBU" },
    { title: "SOLIDWORKS xMold Associate", date: "Aug 2026", issuer: "Dassault Systèmes", media: "assets/certificates/xmold.pdf", id: "C-9V7B6U4QFL" }
  ],

  /* Each tool or skill: its name and, if you like, where it shows up.
     Keep one entry per skill; put near-duplicates in the note instead of adding a new line. */
  skills: {
    "CAD tools": [
      { name: "SolidWorks", usedIn: "Certified: CSWA, xDesign, xShape" },
      { name: "AutoCAD", usedIn: "" },
      { name: "Blender", usedIn: "" },
      { name: "KeyShot", usedIn: "" }
    ],
    "Mechanical design": [
      { name: "Mechanism design", usedIn: "Linkages and compliant parts: animatronic eyes, suspension, clip" },
      { name: "Gear train design", usedIn: "" },
      { name: "Assemblies and drawings", usedIn: "Animatronic skull, hexapod" },
      { name: "Sheet metal design", usedIn: "SoccerBot body, robot chassis" },
      { name: "Reverse engineering", usedIn: "Replacement vent clip, compliant clip" },
      { name: "Airframe design", usedIn: "RC aircraft" },
      { name: "Motion study", usedIn: "" }
    ],
    Analysis: [
      { name: "ANSYS", usedIn: "" },
      { name: "Sustainability assessment", usedIn: "SOLIDWORKS certified associate" }
    ],
    Fabrication: [
      { name: "3D printing", usedIn: "Designing for print and printing; certified associate" },
      { name: "Mould making", usedIn: "Line-follower wheels; xMold certified" },
      { name: "Machining", usedIn: "" },
      { name: "Welding", usedIn: "" },
      { name: "Soldering", usedIn: "Line-following robot" }
    ],
    Electronics: [
      { name: "Circuit design", usedIn: "Control boards, sensor arrays; SOLIDWORKS Electrical certified" },
      { name: "Servo and stepper motors", usedIn: "Robotic arm, hexapod, drawing machine" },
      { name: "Arduino", usedIn: "Otto Bot" },
      { name: "Raspberry Pi", usedIn: "" }
    ],
    Software: [
      { name: "Python", usedIn: "Voice-command assistant" },
      { name: "C++", usedIn: "" },
      { name: "Java", usedIn: "" }
    ]
  },

  timeline: [
    /* Add internships, team roles and other experience as new lines, newest first. */
    { when: "2026", what: "Assistant IT & Resource Officer", where: "CADers, Working Committee 2026", detail: "Elected to the working committee of CADers, the CAD community at KUET." },
    { when: "Dec 2024 — now", what: "B.Sc. Mechanical Engineering", where: "Khulna University of Engineering & Technology", detail: "Second-year undergraduate, graduating 2029." },
    { when: "Completed 2023", what: "Higher secondary education", where: "Adamjee Cantonment College", detail: "" },
    { when: "Completed 2021", what: "Secondary education", where: "Rajendrapur Cantonment Public School and College", detail: "" }
  ]
};
