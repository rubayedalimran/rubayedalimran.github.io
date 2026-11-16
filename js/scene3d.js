/* The 3D world behind the page (Three.js + bloom glow).
   - Hero: a machined planetary gear set in crimson and gold with a glowing energy core.
     It follows the cursor and comes apart in depth as you scroll.
   - Everywhere: the camera descends a shaft of light arcs, floating gears and dust.
   - Contact: a slowly turning wireframe globe.
   If WebGL or Three.js is unavailable, this file does nothing and the flat SVG gear is shown instead. */
(function () {
  "use strict";
  var T = window.THREE, cv = document.getElementById("gl");
  if (!T || !cv) return;
  var renderer;
  try { renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: "high-performance" }); }
  catch (e) { return; }

  var calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = innerWidth < 720;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  document.documentElement.classList.add("gl");

  /* colour version: crimson and gold by default, or the bright "daylight" variant */
  var light = false;
  var PAL = {
    crimson: { bg: 0x060507, line: 0xe6bf7a, ice: 0xd6ecff, red: 0xd4202c, sun: 0x9c0f1a, planet: 0xd1a654, ring: 0x1c1719, planetEdge: 0xfff0cc, studio: 0x0b0809, fill: 0xff3040 },
    reactor: { bg: 0x030810, line: 0x5fe0ff, ice: 0xffffff, red: 0x1e9bff, sun: 0x9fb4c8, planet: 0xe08a45, ring: 0x0c1622, planetEdge: 0xd9f6ff, studio: 0x060c14, fill: 0x18a0ff }
  };
  var P = PAL[document.documentElement.getAttribute("data-theme")] || PAL.crimson;
  P.ringMetal = 0.95; P.ambient = 0.8;
  var BG = P.bg, GOLD = P.line, ICE = P.ice, RED = P.red, CAM_Z = 9;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
  var scene = new T.Scene();
  scene.background = new T.Color(BG);
  scene.fog = new T.FogExp2(BG, 0.045);
  var cam = new T.PerspectiveCamera(45, 1, 0.1, 140);
  scene.add(cam);
  cam.add(new T.AmbientLight(light ? 0xffffff : 0x4a3a3a, P.ambient));
  var key = new T.PointLight(0xfff0d8, 1.3, 50); key.position.set(5, 6, 3); cam.add(key);
  var fill = new T.PointLight(P.fill, 0.9, 40); fill.position.set(-7, -3, 1); cam.add(fill);

  /* a small studio of light panels, so the metal has something to reflect */
  try {
    var pm = new T.PMREMGenerator(renderer), studio = new T.Scene();
    studio.add(new T.Mesh(new T.SphereGeometry(30, 16, 8), new T.MeshBasicMaterial({ color: P.studio, side: T.BackSide })));
    [[0xffffff, 0, 14, 5, 16, 6], [0xffdca8, -13, 3, 7, 6, 12], [P.fill, 13, -2, 5, 5, 10], [0xd6ecff, 0, -11, 9, 12, 3], [0xfff2d6, 6, 4, -14, 8, 8]]
      .forEach(function (p) {
        var m = new T.Mesh(new T.PlaneGeometry(p[4], p[5]), new T.MeshBasicMaterial({ color: p[0], side: T.DoubleSide }));
        m.position.set(p[1], p[2], p[3]); m.lookAt(0, 0, 0); studio.add(m);
      });
    scene.environment = pm.fromScene(studio, 0.03).texture;
  } catch (e) {}

  /* ---------- gear geometry ---------- */
  function outline(teeth, r, m, internal) {
    var p = (2 * Math.PI) / teeth, tip = internal ? r - 0.9 * m : r + 0.9 * m, root = internal ? r + 1.1 * m : r - 1.1 * m, pts = [];
    for (var i = 0; i < teeth; i++) {
      var a = i * p;
      [[root, -0.5], [root, -0.28], [tip, -0.14], [tip, 0.14], [root, 0.28]].forEach(function (k) {
        pts.push(new T.Vector2(k[0] * Math.cos(a + k[1] * p), k[0] * Math.sin(a + k[1] * p)));
      });
    }
    return pts;
  }
  function circle(x, y, r) { var c = new T.Path(); c.absarc(x, y, r, 0, Math.PI * 2, true); return c; }

  var crimson = new T.MeshStandardMaterial({ color: P.sun, metalness: light ? 0.15 : 0.8, roughness: 0.24, envMapIntensity: 1.5 });
  var gold = new T.MeshStandardMaterial({ color: P.planet, metalness: light ? 0.55 : 1, roughness: 0.22, envMapIntensity: 1.5 });
  var gunmetal = new T.MeshStandardMaterial({ color: P.ring, metalness: P.ringMetal, roughness: 0.34, envMapIntensity: 1.2 });
  function edge(color, opacity) { return new T.LineBasicMaterial({ color: color, transparent: true, opacity: opacity }); }

  function gear(teeth, r, m, depth, body, edgeMat, internal) {
    var shape;
    if (internal) {
      shape = new T.Shape(); shape.absarc(0, 0, r + 3.4 * m, 0, Math.PI * 2, false);
      shape.holes.push(new T.Path(outline(teeth, r, m, true)));
    } else {
      shape = new T.Shape(outline(teeth, r, m));
      shape.holes.push(circle(0, 0, r * 0.22));
      if (r > 0.45) for (var i = 0; i < 6; i++) {
        var a = (i / 6) * Math.PI * 2;
        shape.holes.push(circle(0.58 * r * Math.cos(a), 0.58 * r * Math.sin(a), r * 0.14));
      }
    }
    var geo = new T.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 2, curveSegments: 24 });
    geo.translate(0, 0, -depth / 2);
    var g = new T.Group();
    g.add(new T.Mesh(geo, body));
    g.add(new T.LineSegments(new T.EdgesGeometry(geo, 40), edgeMat));
    return g;
  }

  /* ---------- hero rig: ring 48T (fixed), sun 24T, three planets 12T ---------- */
  var rig = new T.Group(), M = 0.1;
  var ring = gear(48, 2.4, M, 0.34, gunmetal, edge(GOLD, 0.55), true);
  var sun = gear(24, 1.2, M, 0.5, crimson, edge(GOLD, 0.35));
  var core = new T.Mesh(new T.SphereGeometry(0.2, 24, 16), new T.MeshBasicMaterial({ color: ICE }));
  var halo = new T.Mesh(new T.TorusGeometry(0.34, 0.012, 6, 60), new T.MeshBasicMaterial({ color: ICE, transparent: true, opacity: 0.8 }));
  var coreLight = new T.PointLight(0xbfe0ff, 1.4, 6);
  var sunWrap = new T.Group(); sunWrap.add(sun, core, halo, coreLight);
  var carrier = new T.Group(), planets = [];
  [0, 120, 240].forEach(function (deg) {
    var p = gear(12, 0.6, M, 0.42, gold, edge(P.planetEdge, 0.3));
    p.userData.a = (deg * Math.PI) / 180;
    carrier.add(p); planets.push(p);
  });
  /* an outer bezel: a polished band and a ring of index marks that turns the other way */
  var bezel = new T.Group();
  bezel.add(new T.Mesh(new T.TorusGeometry(2.98, 0.035, 10, 120), gold));
  bezel.add(new T.Mesh(new T.TorusGeometry(3.22, 0.012, 6, 120), new T.MeshBasicMaterial({ color: RED })));
  for (var b = 0; b < 60; b++) {
    var tick = new T.Mesh(new T.BoxGeometry(b % 5 ? 0.07 : 0.16, 0.014, 0.02), b % 5 ? gold : crimson);
    var ba = (b / 60) * Math.PI * 2;
    tick.position.set(3.1 * Math.cos(ba), 3.1 * Math.sin(ba), 0); tick.rotation.z = ba;
    bezel.add(tick);
  }
  rig.add(ring, sunWrap, carrier, bezel);
  scene.add(rig);

  /* ---------- the shaft: arcs of light on the far wall, vertical rails ---------- */
  var arcs = [], SHAFT_Z = -6, SHAFT_R = 13;
  for (var y = 6; y > -70; y -= 3.4) {
    var level = new T.Group();
    level.position.set(0, y, SHAFT_Z);
    level.rotation.x = Math.PI / 2;
    var n = 2 + Math.floor(Math.random() * 2);
    for (var k = 0; k < n; k++) {
      var len = 0.35 + Math.random() * 0.9, pick = Math.random();
      var arc = new T.Mesh(
        new T.TorusGeometry(SHAFT_R - Math.random() * 1.5, 0.016 + Math.random() * 0.026, 6, 48, len),
        new T.MeshBasicMaterial({ color: pick < 0.26 ? RED : (pick < 0.36 ? ICE : GOLD), transparent: true, opacity: 0.3 + Math.random() * 0.4 })
      );
      arc.userData.base = Math.PI + 0.15 + Math.random() * (Math.PI - 0.3 - len);
      arc.userData.sw = 0.1 + Math.random() * 0.3;
      arc.userData.sp = 0.15 + Math.random() * 0.4;
      level.add(arc); arcs.push(arc);
    }
    scene.add(level);
  }
  var railPts = [];
  for (var r = 0; r < 9; r++) {
    var ang = Math.PI * (0.12 + (r / 8) * 0.76);
    railPts.push(SHAFT_R * Math.cos(ang), 12, SHAFT_Z - SHAFT_R * Math.sin(ang), SHAFT_R * Math.cos(ang), -74, SHAFT_Z - SHAFT_R * Math.sin(ang));
  }
  var railGeo = new T.BufferGeometry();
  railGeo.setAttribute("position", new T.Float32BufferAttribute(railPts, 3));
  scene.add(new T.LineSegments(railGeo, edge(GOLD, 0.16)));

  /* ---------- floating gears ---------- */
  var floaters = [];
  for (var f = 0; f < (small ? 8 : 16); f++) {
    var teeth = 8 + Math.floor(Math.random() * 10), rad = 0.3 + Math.random() * 0.7, kind = Math.random();
    var g = gear(teeth, rad, (rad / teeth) * 2, 0.12 + Math.random() * 0.12, kind < 0.3 ? crimson : (kind < 0.6 ? gold : gunmetal), edge(GOLD, 0.4));
    g.position.set((Math.random() - 0.5) * 22, 1 - Math.random() * 56, -3 - Math.random() * 9);
    g.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    g.userData.sp = (Math.random() - 0.5) * 0.6;
    scene.add(g); floaters.push(g);
  }

  /* ---------- dust ---------- */
  var dot = document.createElement("canvas"); dot.width = dot.height = 32;
  var dx = dot.getContext("2d"), grad = dx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "#fff"); grad.addColorStop(0.35, "rgba(255,255,255,.5)"); grad.addColorStop(1, "rgba(255,255,255,0)");
  dx.fillStyle = grad; dx.fillRect(0, 0, 32, 32);
  var sprite = new T.CanvasTexture(dot);
  var N = small ? 1300 : 3200, pos = [], col = [], cg = new T.Color(GOLD), cr = new T.Color(RED), ci = new T.Color(ICE), tmp = new T.Color();
  for (var i = 0; i < N; i++) {
    pos.push((Math.random() - 0.5) * 34, 10 - Math.random() * 80, 4 - Math.random() * 26);
    var c = Math.random();
    tmp.copy(c < 0.18 ? cr : (c < 0.3 ? ci : cg)).multiplyScalar(0.35 + Math.random() * 0.6);
    col.push(tmp.r, tmp.g, tmp.b);
  }
  var dustGeo = new T.BufferGeometry();
  dustGeo.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
  dustGeo.setAttribute("color", new T.Float32BufferAttribute(col, 3));
  var dust = new T.Points(dustGeo, new T.PointsMaterial({ size: 0.1, map: sprite, vertexColors: true, transparent: true, depthWrite: false, blending: light ? T.NormalBlending : T.AdditiveBlending }));
  scene.add(dust);

  /* ---------- the globe that waits at the contact section ---------- */
  var globe = new T.Group(), ico = new T.IcosahedronGeometry(2.3, 2);
  globe.add(new T.LineSegments(new T.WireframeGeometry(ico), edge(GOLD, 0.3)));
  globe.add(new T.Points(ico, new T.PointsMaterial({ size: 0.12, map: sprite, color: ICE, transparent: true, depthWrite: false, blending: T.AdditiveBlending })));
  var orbit = new T.Mesh(new T.TorusGeometry(3, 0.012, 6, 90), new T.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.8 }));
  orbit.rotation.x = 1.2; globe.add(orbit);
  var orbit2 = new T.Mesh(new T.TorusGeometry(3.5, 0.008, 6, 90), new T.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.6 }));
  orbit2.rotation.set(1.9, 0.5, 0); globe.add(orbit2);
  scene.add(globe);

  /* ---------- a rolling wireframe floor that travels with the camera ---------- */
  var floorGeo = new T.PlaneGeometry(76, 46, 60, 36);
  floorGeo.rotateX(-Math.PI / 2);
  var floor = new T.Mesh(floorGeo, new T.MeshBasicMaterial({ color: GOLD, wireframe: true, transparent: true, opacity: 0.12 }));
  floor.position.z = -10;
  scene.add(floor);
  var fpos = floorGeo.attributes.position;

  /* ---------- streaks of light that rise past the camera and stretch when you scroll ---------- */
  var SN = small ? 50 : 120, sArr = new Float32Array(SN * 6), sData = [];
  for (var s = 0; s < SN; s++) sData.push({ x: (Math.random() - 0.5) * 32, z: -1 - Math.random() * 20, y: (Math.random() - 0.5) * 26, v: 0.5 + Math.random() * 1.5, len: 0.25 + Math.random() * 0.8 });
  var sGeo = new T.BufferGeometry();
  sGeo.setAttribute("position", new T.BufferAttribute(sArr, 3));
  var streaks = new T.LineSegments(sGeo, edge(ICE, 0.3));
  streaks.frustumCulled = false;
  scene.add(streaks);

  /* ---------- stations: one 3D set piece parked behind each section ---------- */
  var stations = [];
  /* anchor: how far down the section the piece sits (0 = top, 0.5 = middle, the default) */
  function station(id, xFrac, z, obj, anchor) { obj.userData.id = id; obj.userData.xf = xFrac; obj.userData.an = anchor === undefined ? 0.5 : anchor; obj.position.z = z; scene.add(obj); stations.push(obj); return obj; }
  function glowMat(color, opacity) { return new T.MeshBasicMaterial({ color: color, transparent: opacity < 1, opacity: opacity }); }

  /* hangar: an energy reactor ring with coil blocks and a pulsing core */
  var reactor = new T.Group(), reactorSpin = new T.Group();
  reactorSpin.add(new T.Mesh(new T.TorusGeometry(2.6, 0.1, 12, 120), gold));
  reactorSpin.add(new T.Mesh(new T.TorusGeometry(2.05, 0.03, 8, 120), glowMat(ICE, 1)));
  reactorSpin.add(new T.Mesh(new T.TorusGeometry(3.1, 0.012, 6, 120), glowMat(RED, 1)));
  var spokes = [];
  for (var cI = 0; cI < 14; cI++) {
    var ca = (cI / 14) * Math.PI * 2, coilGeo = new T.BoxGeometry(0.62, 0.42, 0.34);
    var coil = new T.Mesh(coilGeo, cI % 2 ? crimson : gunmetal);
    coil.position.set(2.6 * Math.cos(ca), 2.6 * Math.sin(ca), 0); coil.rotation.z = ca + Math.PI / 2;
    coil.add(new T.LineSegments(new T.EdgesGeometry(coilGeo), edge(GOLD, 0.7)));
    reactorSpin.add(coil);
    spokes.push(0.7 * Math.cos(ca), 0.7 * Math.sin(ca), 0, 2.05 * Math.cos(ca), 2.05 * Math.sin(ca), 0);
  }
  var spokeGeo = new T.BufferGeometry();
  spokeGeo.setAttribute("position", new T.Float32BufferAttribute(spokes, 3));
  reactorSpin.add(new T.LineSegments(spokeGeo, edge(GOLD, 0.45)));
  var rCore = new T.Mesh(new T.SphereGeometry(0.5, 24, 16), glowMat(ICE, 1));
  var rHalo = new T.Mesh(new T.TorusGeometry(0.85, 0.02, 6, 60), glowMat(ICE, 0.8));
  reactor.add(reactorSpin, rCore, rHalo);
  reactor.rotation.set(-0.35, 0.5, 0);
  station("builds", -0.16, -8, reactor);

  /* ---------- machinery, each shown assembling and coming apart as an exploded view ---------- */
  function along(m) { m.rotation.z = -Math.PI / 2; return m; }           /* turn a cylinder's axis from Y to X */
  function shell(mat) { var m = mat.clone(); m.side = T.DoubleSide; return m; }
  function rims(geo, opacity) { return new T.LineSegments(new T.EdgesGeometry(geo, 30), edge(GOLD, opacity)); }

  /* arsenal: a turbofan jet engine — spinner, fan, casing, compressor, combustor, turbine, nozzle */
  function bladed(r, hub, n, w, twist, mat) {
    var g = new T.Group(), geo = new T.BoxGeometry(0.035, r - hub, w), mid = (r + hub) / 2;
    g.add(along(new T.Mesh(new T.CylinderGeometry(hub, hub, 0.22, 24), gunmetal)));
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2, b = new T.Mesh(geo, mat);
      b.position.set(0, Math.cos(a) * mid, Math.sin(a) * mid);
      b.rotation.set(a, twist, 0);
      g.add(b);
    }
    var rim = new T.Mesh(new T.TorusGeometry(r, 0.012, 6, 80), glowMat(GOLD, 0.8));
    rim.rotation.y = Math.PI / 2; g.add(rim);
    return g;
  }
  var engine = new T.Group(), eParts = [];
  function ePart(obj, x, spin) { obj.userData.x0 = x; obj.userData.spin = spin || 0; engine.add(obj); eParts.push(obj); return obj; }
  var spinner = new T.Mesh(new T.ConeGeometry(0.42, 0.9, 28), crimson); spinner.rotation.z = Math.PI / 2;
  ePart(spinner, -3.05, 1);
  ePart(bladed(1.55, 0.42, 22, 0.5, 0.55, gold), -2.3, 1);
  var caseGeo = new T.CylinderGeometry(1.68, 1.68, 0.85, 48, 1, true), fanCase = along(new T.Mesh(caseGeo, shell(gunmetal)));
  fanCase.add(rims(caseGeo, 0.8)); ePart(fanCase, -2.3);
  [[1.05, -1.3], [0.95, -0.9], [0.85, -0.5]].forEach(function (c) { ePart(bladed(c[0], 0.38, 26, 0.2, 0.5, crimson), c[1], 1); });
  var combGeo = new T.CylinderGeometry(0.8, 0.8, 1, 40, 1, true), comb = along(new T.Mesh(combGeo, shell(gunmetal)));
  comb.add(rims(combGeo, 0.7));
  for (var nz = 0; nz < 12; nz++) {
    var na = (nz / 12) * Math.PI * 2, nozzle = new T.Mesh(new T.SphereGeometry(0.07, 10, 8), glowMat(ICE, 1));
    nozzle.position.set(0.82 * Math.cos(na), 0.5, 0.82 * Math.sin(na)); comb.add(nozzle);
  }
  ePart(comb, 0.4);
  ePart(bladed(1, 0.4, 24, 0.26, -0.6, gold), 1.3, 1);
  ePart(bladed(1.1, 0.4, 24, 0.26, -0.6, gold), 1.7, 1);
  var nozGeo = new T.CylinderGeometry(0.6, 1.05, 1.2, 40, 1, true), noz = along(new T.Mesh(nozGeo, shell(gunmetal)));
  noz.add(rims(nozGeo, 0.8)); ePart(noz, 2.75);
  ePart(along(new T.Mesh(new T.ConeGeometry(0.36, 1, 24), crimson)), 3, 1);
  engine.add(along(new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 9.5, 10), gold)));
  engine.rotation.set(0.25, -0.75, 0.12);
  station("arsenal", 0.36, -6, engine);

  /* origin: an inline-four crank train — crankshaft, connecting rods, pistons, cylinder liners */
  var motor = new T.Group(), throws = [], CR = 0.3, CL = 1.05;
  motor.add(along(new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 4.6, 12), gunmetal)));
  [-1.5, -0.5, 0.5, 1.5].forEach(function (x, i) {
    var th = new T.Group(); th.position.x = x;
    [-0.15, 0.15].forEach(function (dx) {
      var web = along(new T.Mesh(new T.CylinderGeometry(0.38, 0.38, 0.07, 22), crimson)); web.position.x = dx; th.add(web);
    });
    var pin = along(new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 0.32, 10), gold)); pin.position.y = CR; th.add(pin);
    var rodGeo = new T.BoxGeometry(0.1, CL, 0.14), rod = new T.Mesh(rodGeo, gunmetal); rod.add(rims(rodGeo, 0.8));
    var pistonGeo = new T.CylinderGeometry(0.36, 0.36, 0.42, 26), piston = new T.Mesh(pistonGeo, gold); piston.add(rims(pistonGeo, 0.5));
    var liner = rims(new T.CylinderGeometry(0.43, 0.43, 1.25, 26, 1, true), 0.6);
    motor.add(th, rod, piston, liner);
    throws.push({ g: th, rod: rod, piston: piston, liner: liner, x: x, ph: i === 1 || i === 2 ? Math.PI : 0 });
  });
  motor.rotation.set(0.25, 0.6, 0);
  station("about", 0.36, -5, motor, 0.1);

  /* hall of proof: a ball bearing — outer race, cage of balls, inner race */
  function race(r1, r2, h) {
    var g = new T.Group(), m = shell(gunmetal), og = new T.CylinderGeometry(r2, r2, h, 48, 1, true);
    g.add(new T.Mesh(og, m), new T.Mesh(new T.CylinderGeometry(r1, r1, h, 48, 1, true), m), rims(og, 0.7));
    [h / 2, -h / 2].forEach(function (y) { var c = new T.Mesh(new T.RingGeometry(r1, r2, 48), m); c.rotation.x = Math.PI / 2; c.position.y = y; g.add(c); });
    return g;
  }
  var bearing = new T.Group(), outerRace = race(1.3, 1.6, 0.55), innerRace = race(0.7, 0.95, 0.55), cage = new T.Group();
  for (var bl = 0; bl < 10; bl++) {
    var bla = (bl / 10) * Math.PI * 2, ball = new T.Mesh(new T.SphereGeometry(0.17, 20, 14), gold);
    ball.position.set(1.12 * Math.cos(bla), 0, 1.12 * Math.sin(bla)); cage.add(ball);
  }
  var cageRing = new T.Mesh(new T.TorusGeometry(1.12, 0.025, 6, 80), crimson); cageRing.rotation.x = Math.PI / 2; cage.add(cageRing);
  bearing.add(outerRace, innerRace, cage);
  bearing.rotation.set(1, 0, 0.35);
  station("proof", 0.42, -5.5, bearing);

  /* hall of proof: three nested crystals turning against each other */
  var crystal = new T.Group();
  [[new T.IcosahedronGeometry(1.7, 0), GOLD, 0.6], [new T.OctahedronGeometry(1, 0), RED, 0.9], [new T.DodecahedronGeometry(2.5, 0), ICE, 0.2]].forEach(function (c) {
    crystal.add(new T.LineSegments(new T.EdgesGeometry(c[0]), edge(c[1], c[2])));
  });
  crystal.add(new T.Mesh(new T.OctahedronGeometry(0.42, 0), crimson));
  station("proof", -0.4, -6, crystal);

  /* flight log: a gyroscope */
  var gyro = new T.Group(), gy = [];
  [[2, gold], [1.62, crimson], [1.24, gold]].forEach(function (g, n) {
    var r = new T.Mesh(new T.TorusGeometry(g[0], 0.05, 10, 90), g[1]);
    if (n) gy[n - 1].add(r); else gyro.add(r);
    gy.push(r);
  });
  gy[2].add(new T.Mesh(new T.SphereGeometry(0.3, 20, 14), glowMat(ICE, 1)));
  station("log", 0.4, -5, gyro);

  /* ---------- glow ---------- */
  var composer = null;
  /* glow only suits the dark version; on a bright background it would wash everything out */
  if (!light && T.EffectComposer && T.RenderPass && T.UnrealBloomPass) {
    try {
      composer = new T.EffectComposer(renderer);
      composer.addPass(new T.RenderPass(scene, cam));
      composer.addPass(new T.UnrealBloomPass(new T.Vector2(innerWidth, innerHeight), 0.8, 0.65, 0.3));
    } catch (e) { composer = null; }
  }

  /* ---------- keep the 3D gear exactly where the page reserves room for it ---------- */
  var W, H, visH, visW, base = { x: 0, y: 0, s: 1 };
  function fit() {
    W = innerWidth; H = innerHeight;
    renderer.setSize(W, H, false);
    if (composer) composer.setSize(W, H);
    cam.aspect = W / H; cam.updateProjectionMatrix();
    visH = 2 * CAM_Z * Math.tan((22.5 * Math.PI) / 180); visW = visH * cam.aspect;
    var c = document.getElementById("core");
    if (c) {
      var b = c.getBoundingClientRect();
      base.x = ((b.left + b.width / 2) / W - 0.5) * visW;
      base.y = -((b.top + window.scrollY + b.height / 2) / H - 0.5) * visH;
      base.s = ((b.width / H) * visH) / 5.5;
    }
    var maxScroll = Math.max(0, document.documentElement.scrollHeight - H);
    /* on narrower screens the globe shrinks and tucks into the corner so it never sits behind the email */
    var tight = cam.aspect < 1.5;
    globe.position.set(visW * (tight ? 0.34 : 0.24), (-maxScroll / H) * 3 - (tight ? 1.6 : 0.2), -3);
    globe.scale.setScalar(tight ? 0.5 : 1);
    /* park each station behind the middle of its section */
    stations.forEach(function (o) {
      var el = document.getElementById(o.userData.id);
      if (!el) return;
      var r = el.getBoundingClientRect(), mid = r.top + window.scrollY + r.height * o.userData.an - H / 2;
      o.position.x = visW * o.userData.xf * ((CAM_Z - o.position.z) / CAM_Z);
      o.position.y = -(mid / H) * 3;
      o.scale.setScalar(tight ? 0.6 : 1);
    });
    if (calm) draw(0);
  }

  var mx = 0, my = 0, sx = 0, sy = 0, lastScr = window.scrollY, boost = 0;
  addEventListener("pointermove", function (e) { mx = (e.clientX / innerWidth) * 2 - 1; my = (e.clientY / innerHeight) * 2 - 1; });

  function draw(ms) {
    var t = ms * 0.001, scr = window.scrollY, ex = calm ? 0 : clamp(scr / (H * 0.75), 0, 1);
    sx += (mx - sx) * 0.05; sy += (my - sy) * 0.05;
    var camY = (-scr / H) * 3;
    cam.position.set(sx * 0.6, camY - sy * 0.35, CAM_Z);
    cam.rotation.set(-sy * 0.03, -sx * 0.05, 0);

    rig.position.set(base.x, camY + base.y + (scr / H) * visH, 0);
    rig.scale.setScalar(base.s);
    rig.rotation.set(-0.55 * ex - sy * 0.3, 0.7 * ex + sx * 0.4, 0);
    var th = t * 0.16 + scr * 0.0025;
    carrier.rotation.z = th;
    sun.rotation.z = 3 * th;
    sunWrap.position.z = ex * 2.4;
    ring.position.z = -ex * 2;
    bezel.rotation.z = -th * 0.5; bezel.position.z = -ex * 3.2;
    var pulse = 1 + Math.sin(t * 2.2) * 0.12;
    core.scale.setScalar(pulse);
    halo.scale.setScalar(1 + Math.sin(t * 2.2 + 1) * 0.08);
    halo.position.z = 0.3;
    coreLight.intensity = 1.2 + Math.sin(t * 2.2) * 0.5;
    planets.forEach(function (p) {
      var rr = 1.8 + ex * 0.95;
      p.position.set(rr * Math.cos(p.userData.a), rr * Math.sin(p.userData.a), ex * 0.6);
      p.rotation.z = Math.PI / 12 - 4 * th;
    });

    arcs.forEach(function (a) { a.rotation.z = a.userData.base + Math.sin(t * a.userData.sp) * a.userData.sw; });
    floaters.forEach(function (g) { g.rotation.z = t * g.userData.sp; g.rotation.y += 0.0015; });
    dust.rotation.y = Math.sin(t * 0.05) * 0.08;
    dust.position.y = (t * 0.12) % 2;
    globe.rotation.y = t * 0.12; globe.rotation.x = 0.3 + sy * 0.2;
    orbit.rotation.z = t * 0.5; orbit2.rotation.z = -t * 0.3;

    /* floor: rolling waves under the camera */
    floor.position.y = camY - 4.8;
    for (var i = 0; i < fpos.count; i++) {
      var fx = fpos.getX(i), fz = fpos.getZ(i);
      fpos.setY(i, Math.sin(fx * 0.32 + t * 0.7) * 0.42 + Math.cos(fz * 0.4 + t * 0.5 + scr * 0.004) * 0.36);
    }
    fpos.needsUpdate = true;

    /* streaks: rise steadily, and stretch with scroll speed */
    var vel = Math.abs(scr - lastScr); lastScr = scr;
    boost += (Math.min(vel * 0.25, 14) - boost) * 0.12;
    for (var k = 0; k < SN; k++) {
      var d = sData[k];
      d.y += d.v * 0.03 * (1 + boost);
      if (d.y > 13) d.y = -13;
      var ln = d.len * (1 + boost * 0.5), o = k * 6;
      sArr[o] = d.x; sArr[o + 1] = camY + d.y; sArr[o + 2] = d.z;
      sArr[o + 3] = d.x; sArr[o + 4] = camY + d.y - ln; sArr[o + 5] = d.z;
    }
    sGeo.attributes.position.needsUpdate = true;

    /* stations */
    reactorSpin.rotation.z = t * 0.25 + scr * 0.002;
    rCore.scale.setScalar(1 + Math.sin(t * 2.6) * 0.14);
    rHalo.scale.setScalar(1 + Math.sin(t * 2.6 + 1.2) * 0.1);
    /* machinery: e breathes 0 → 1 → 0, assembled → exploded → assembled */
    var e = 0.5 - 0.5 * Math.cos(t * 0.45);
    e = e * e * (3 - 2 * e);
    eParts.forEach(function (p) {
      p.position.x = p.userData.x0 * (1 + e * 0.75);
      if (p.userData.spin) p.rotation.x = t * 3.2 * p.userData.spin;
    });
    throws.forEach(function (w) {
      var th2 = t * 2.4 + w.ph, py = CR * Math.cos(th2), pz = CR * Math.sin(th2);
      var top = py + Math.sqrt(CL * CL - pz * pz);
      w.g.rotation.x = th2;
      w.rod.position.set(w.x, (py + top) / 2 + e * 0.45, pz / 2);
      w.rod.rotation.x = Math.atan2(-pz, top - py);
      w.piston.position.set(w.x, top + 0.21 + e * 0.95, 0);
      w.liner.position.set(w.x, CL + 0.25 + e * 1.8, 0);
    });
    outerRace.position.y = -e * 1.3; innerRace.position.y = e * 1.3;
    cage.rotation.y = t * 0.8; innerRace.rotation.y = t * 1.6;
    crystal.children[0].rotation.set(t * 0.2, t * 0.3, 0);
    crystal.children[1].rotation.set(-t * 0.5, 0, t * 0.4);
    crystal.children[2].rotation.set(0, -t * 0.12, t * 0.08);
    crystal.children[3].rotation.set(t, t * 0.7, 0);
    gy[0].rotation.set(t * 0.5, 0.4, 0);
    gy[1].rotation.x = t * 0.9;
    gy[2].rotation.y = t * 1.3;

    if (composer) composer.render(); else renderer.render(scene, cam);
  }

  function loop(ms) {
    if (!document.hidden) draw(ms);
    requestAnimationFrame(loop);
  }

  fit();
  addEventListener("resize", fit);
  addEventListener("load", fit);
  setTimeout(fit, 1500);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  if (calm) addEventListener("scroll", function () { draw(0); }, { passive: true });
  else requestAnimationFrame(loop);
})();
