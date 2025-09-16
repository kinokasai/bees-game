window.index = 0

let rand_int = (max, min) => {
  min = min ? min : 0;
  return Math.floor(Math.random() * (max + 0.9 - min) + min)
}

let incl_arr = (s, arr) => {
  return arr.reduce((acc, elt) =>
    acc || s.includes(elt)
    , false)
}
let w = 750;
let h = 1050;
let hw = w / 2;
let hh = h / 2;

let opt_map = (v, clbk) => {
  if (v == undefined) {
    return;
  } else {
    return clbk(v);
  }
}

let colorless = {
  code: "white",
  name: "colorless",
  r: 0xde,
  g: 0xde,
  b: 0xde,
}

let colors = {
  black: {
    id: 'black',
    code: "#3e3e3e"
  },
  red: {
    id: 'red',
    code: "#ff464c",
  },
  blue: {
    id: 'blue',
    code: '#8eecf5'
  },
  light_gray: {
    id: "light-gray",
    code: "#ccccdb"
  },
  yellow: {
    id: 'yellow',
    code: '#eabc29'
  },
  pink: {
    id: 'pink',
    code: '#f1c0e8'
  },
  green: {
    id: 'green',
    code: '#b9fbc0'
  },
  brown: {
    id: 'brown',
    code: "#804d00"
  }
}

let black = "#3d3022";
let white = "#fff";

let chcol = (p, col) => {
  p.fill(col);
  p.stroke(col);
}

let effects = {
  must_validate: "Le joueur choisi doit valider une ruche.",
  // must_validate: "Chosen player must validate another beehive.",
  look_at: "Regardez une ruche.",
  reveal_hive: "Révélez une ruche.",
  move: "Déplacez des cartes d'une ruche vers une autre.",
  cure: "Apprivoisez l'un de vos frelons.",
  reveal_this: "Révélez cette carte.",
  gain_hornet: "Remportez ce frelon.",
  add_to_score: "Ajoutez cette carte à votre score.",
  lose: "Perdez cette manche.",
  next_hornet_friend: "Le prochain frelon que vous remportez arrive apprivoisé.",
  reveal_card: "Révélez la première carte d'une ruche."
}

let mv = effects.must_validate;
let la = effects.look_at;
let rh = effects.reveal_hive;
let rc = effects.reveal_card;
let cure = effects.cure;
let rvt = effects.reveal_this;
let ats = effects.add_to_score;
let nhf = effects.next_hornet_friend;


let trgs = {
  onv: "Collecte",
  ons: "Regard",
}

let trg_clr = {
  "Regard": colors.yellow,
  "Collecte": colors.black
}

let mk = (trigger, effect) => {
  if (effect == undefined) { return undefined }
  return { trigger: trigger, effect: effect }
}

let mk2 = (trigger, effect) => {
  return { trigger: trgs[trigger], effect: effects[effect] }
}

let bee = "🐝"

let ablts = {
  firefly: mk(trgs.ons, effects.reveal_this),
  onv_cure: mk(trgs.onc, effects.cure),
  onc_look_at: mk(trgs.onv, effects.look_at),
  onk_look_at: mk(trgs.onk, effects.look_at),
  onv_must_validate: mk(trgs.onv, effects.must_validate),
  onc_must_validate: mk(trgs.onc, effects.must_validate),
  onc_reveal: mk(trgs.onc, effects.reveal_hive),
  onc_move: mk(trgs.onc, effects.move),
  ons_gain_hornet: mk(trgs.ons, effects.gain_hornet),
}

let draw_hex = (p, cx, cy, r) => {
  p.beginShape();
  for (let i = 0; i < 6; i++) {
    const angle = p.TWO_PI * i / 6; // 0, 60°, 120°... (flat top)
    const vx = cx + r * p.cos(angle);
    const vy = cy + r * p.sin(angle);
    p.vertex(vx, vy);
  }
  p.endShape(p.CLOSE);
}


let draw_cartouche = (p, text, color) => {
  let x = 150;
  let y = 750;
  let bbox = font.textBounds(text, x, y);
  let ofst = 10;
  chcol(p, color);
  p.rect(bbox.x - bbox.advance / 2 - ofst, bbox.y - ofst, bbox.w + ofst * 2, bbox.h + ofst * 2, 5);
  chcol(p, black);
  p.text(text, x, y);
}

let draw_effect = (p, card) => {
  p.push();
  let effect = card.effect.effect; card.effect ? card.effect.effect : "";
  let trigger = card.effect.trigger
  p.textSize(40);
  let justified = justify_text(p, effect, 570, 5, 10, 50);
  p.translate(100, 800);
  if (card.kind == 'hornet')
    p.translate(0, 150);
  chcol(p, black);
  for (let w of justified.words) {
    p.text(w.word, w.x, w.y);
    p.textFont(font);
  }
  let lh = 50;
  let y = -70;
  let ofst = 30;
  let bg = white;
  let fg = black;
  if (trigger == trgs.onv) { bg = colors.black; fg = white }
  else if (trigger == trgs.onk) { bg = colors.red }
  else { bg = colors.yellow }
  p.noFill();
  p.rect(-40, -70, 630, lh * (justified.line_nb + 1) + 60, 5);
  p.fill(bg.code);
  p.beginShape();
  p.vertex(0, -70);
  y -= ofst;
  p.vertex(ofst, y);
  p.vertex(300, y);
  y += ofst;
  p.vertex(300 + ofst, y);
  y += ofst;
  p.vertex(300, y);
  p.vertex(ofst, y);
  p.endShape(p.CLOSE);
  p.textAlign(p.CENTER, p.CENTER);
  chcol(p, fg);
  p.text(trigger, (300 + ofst) / 2, y - ofst - 5)
  p.pop();
}

let draw_img = (p, card) => {
  let offset = {
    hornet: 0,
    queen_bee: 40,
    black_bee: 30,
    yellow_bee: 30,
    firefly: 20,
  }[card.kind]
  offset = offset ? offset : 0;
  let code = card.kind;
  if (code == 'queen_bee') {
    code = `${card.color.id}_queen`;
  }
  let img = imgs[code];
  p.imageMode(p.CENTER);
  if (img) {
    p.image(img, hw + offset, hh - 40, 700, 700);
  }
}

let draw_effect_icon = (p, card) => {
  p.push();
  if (card.kind == 'hornet') {
    p.tint(colors.red.code);
  }
  p.pop();
}

let draw_hornet_points = (p, card) => {
  chcol(p, black);
  p.textSize(50);
  let y = 100;
  let pts = [1, 3, 6, 9, 12];
  for (let i = 0; i < pts.length; ++i) {
    y = 100 + i * 60;
    p.text(pts[i], 60, y);
  }
  y += 30;
  p.line(40, y, 140, y);
}

// let second_points = (p, 

let draw_frame = (p, card) => {
  p.push();
  let ofst = 20;
  let bofst = ofst + 20;
  const r = 8;
  const hex_h = p.sqrt(3) * r;    // hex height
  const step_x = 1.5 * r;    // horizontal spacing between centers
  const step_y = hex_h;          // vertical spacing between centers

  // Start slightly before (and end slightly after) the canvas so edges are fully covered.
  const cols = p.floor(w / step_x) + 1;
  const rows = p.floor(h / step_y) + 1;

  chcol(p, card.color.code);
  p.rect(ofst, ofst, w - ofst * 2, h - ofst * 2, 20)
  p.noFill();
  p.stroke(white);

  // cover canvas in hexagons
  for (let col = -1; col < cols; col++) {
    const x = col * step_x - 2;
    const yOffset = (col % 2 === 0) ? 0 : hex_h / 2; // stagger every other column
    for (let row = -1; row < rows; row++) {
      const y = row * step_y + yOffset;
      draw_hex(p, x, y, r);
    }
  }

  chcol(p, white);
  p.rect(bofst, bofst, w - bofst * 2, h - bofst * 2, 20)


  p.fill(white);
  p.textAlign(p.LEFT, p.TOP);
  p.textSize(60);
  p.stroke(card.color.code);
  p.push();
  p.strokeWeight(5);
  p.beginShape();
  p.vertex(bofst, bofst - 10 + 100);
  p.vertex(bofst + card.points.length * 30 + 60, bofst - 10 + 100);
  p.endShape();
  // p.rect(bofst - 10, bofst - 10, card.points.length * 30 + 60 , 100, 20);
  p.pop();
  chcol(p, black);
  let bonus_points = (pts, emoji) => {
    p.textSize(40);
    p.text(pts, bofst + 20, bofst + 100);
    p.textFont("Noto Color Emoji");
    p.textSize(35);
    p.text(emoji, bofst + 95, bofst + 110);
  }
  if (card.kind == 'queen_bee') {
    p.text("+1/", bofst + 20, bofst + 10);
    p.textFont("Noto Color Emoji");
    p.textSize(50);
    chcol(p, card.color.code);
    p.text("🐝", bofst + 130, bofst + 25);
  } else {
    p.text(card.points, bofst + 20, bofst + 10);
    if (card.kind == 'roach_queen') {
      bonus_points("+2/", "🪳")
    } else if (card.kind == 'roach-hornet-friend') {
      bonus_points("+2/", "🐝💢");
    }
  }
  if (card.effect) {
    p.fill(trg_clr[card.effect.trigger].code);
    p.stroke(trg_clr[card.effect.trigger].code);
    ofst = 42;
    draw_hex(p, w - bofst - ofst, bofst + ofst, 32);
  }

  p.pop();
}

let draw_card = (p, card) => {
  draw_frame(p, card);
  draw_img(p, card);
  if (card.effect) {
    draw_effect(p, card);
  }
  draw_effect_icon(p, card);
}

let text = card => {
  let obj = {
    'firefly': "5pts / collecte: reveal it",
    'queen-bee': "2 pts / abeille de la couleur"
  }
}

let hornets = Array.from({ length: 17 })
  .map(_ => ({ kind: 'hornet', color: colors.red, points: "0" }));
hornets[0].points = '?'
hornets[1].effect = ablts.ons_gain_hornet;

let hornet_king = ({
  kind: 'hornet', color: colors.red, points: "4",
  effect: mk(trgs.onv, effects.lose)
});

hornets = [...hornets, hornet_king];

let black_effects = [la, la, mv, mv, rh, rh]

let black_bees = Array.from({ length: 9 })
  .map(_ => ({ kind: 'black_bee', color: colors.black, points: "1" }))
  .map((v, i) => {
    let effect = mk(trgs.onv, black_effects[i]);
    return { ...v, effect }
  })

let yellow_effects = [la, la, rc, rc, mv, mv, ats, ats]

let yellow_bees = Array.from({ length: 8 })
  .map(_ => ({ kind: 'yellow_bee', color: colors.yellow, points: "1" }))
  .map((v, i) => {
    let effect = mk(trgs.ons, yellow_effects[i]);
    return { ...v, effect };
  })
yellow_bees[7].points = '?'

let cool_bee = [{ kind: "cool_bee", color: colors.yellow, points: "6" }]

let fireflies = Array.from({ length: 3 })
  .map(_ => ({
    kind: 'firefly', color: colors.light_gray, points: "3",
    effect: ablts.firefly
  }));

let lovebees = Array.from({ length: 3 })
  .map(_ => ({
    kind: 'lovebee', color: colors.light_gray, points: "2",
    effect: mk(trgs.ons, ats)
  }))

let yellow_queens = Array.from({ length: 3 })
  .map(_ => ({ kind: 'queen_bee', color: colors.yellow, points: "1/🐝" }))

let black_queens = Array.from({ length: 3 })
  .map(_ => ({ kind: 'queen_bee', color: colors.black, points: "1/🐝" }))

let roaches_effects = [ats, ats, cure, cure, nhf, nhf]
let triggers = [trgs.ons, trgs.ons, trgs.onv, trgs.onv, trgs.onv, trgs.onv]

let roaches = Array.from({ length: 10 })
  .map(_ => ({ kind: 'roach', color: colors.brown, points: "-1" }))
  .map((v, i) => ({ ...v, effect: mk(triggers[i], roaches_effects[i]) }))
roaches[9].points = "?";

let roach_hornet = [{ kind: 'roach-hornet-friend', color: colors.brown, points: "-1" }]

let roach_queen = Array.from({ length: 1 })
  .map(_ => ({ kind: 'roach_queen', color: colors.brown, points: "-2" }))


let cards = [hornets, black_bees, yellow_bees, roaches, roach_queen, roach_hornet, yellow_queens,
  black_queens, cool_bee].flat();

const struct = p => {
  p.preload = () => {
    font = p.loadFont("assets/rec-mono-regular-full.ttf");
    ifont = p.loadFont('assets/rec-mono-italic.ttf');
    icons = {
      skull: p.loadImage('assets/icons/skull.png')
    };
    imgs = {
      black_bee: p.loadImage('assets/black-bee.png'),
      yellow_bee: p.loadImage('assets/yellow-bee.png'),
      hornet: p.loadImage('assets/hornet.png'),
      black_queen: p.loadImage('assets/black-queen.png'),
      yellow_queen: p.loadImage('assets/yellow-queen.png'),
      firefly: p.loadImage('assets/firefly.png')
    }
  }

  p.setup = () => {
    p.frameRate(3);
    p.textFont(font);
    p.createCanvas(w, h);
    icons.skull.filter(p.INVERT);
    gray = p.color(170, 170, 170);
    gray.setAlpha(200);
    trwhite = p.color(0xff, 0xff, 0xff, 200);
    trsprt = p.color(0, 0, 0, 255);
    // p.textFont(font);
    bufs = [p.createGraphics(w, h),
    p.createGraphics(w, h)]

  };

  p.draw = () => {
    let card = cards[window.index];
    // let color = fam_colors[card.family]
    p.fill(white);
    p.rect(0, 0, w, h);
    draw_card(p, card);
    p.push();
    chcol(p, black);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.text(window.index, w, h)
    p.pop();
  }


  p.download_all_cards = p => {
    pg = p.createGraphics(w, h);
    bufs = bufs.map(_ => p.createGraphics(w, h));
    // let cards = cards
    console.log(cards);
    let card = cards[window.index];
    // let name = `${card.from}-${card.goal}_back`;
    let name = `${card.name}`;
    p.saveCanvas(`[${window.index}] ${name}.jpg`);
    if (window.index < Object.entries(cards).length - 1) {
      window.index = index + 1;
      setTimeout(() => p.download_all_cards(p), 300);
    } else {
      console.log("finished");
      p.frameRate(0);
    }
  }


  p.keyPressed = () => {
    if (p.keyCode === 68) {
      window.index = 0;
      p.frameRate(100);
      p.download_all_cards(p);
    } else if (p.keyCode === p.LEFT_ARROW) {
      p.frameRate(3);
      pg = p.createGraphics(w, h);
      bufs = bufs.map(_ => p.createGraphics(w, h));
      window.index = Math.max(0, index - 1);
    } else if (p.keyCode === p.RIGHT_ARROW) {
      p.frameRate(3);
      pg = p.createGraphics(w, h);
      bufs = bufs.map(_ => p.createGraphics(w, h));
      window.index = Math.min(Object.entries(cards).length - 1, index + 1)
    }
  }
}

let p = new p5(struct);
