window.index = 0;

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
let hw = w /2;
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

let black = "#3d3022";
let white = "#fff";

let chcol = (p, col) => {
  p.fill(col);
  p.stroke(col);
}

let suits = ['coeur', 'pique', 'carreau', 'trefle']
let order = ['croissant', 'décroissant']
let rules = {}
for (let i = 0; i < suits.length; i++) {
  for (let j = 0; j < order.length; j++) {
    let id = `${suits[i]}-${order[j]}`;
    let effect = `${order[j]}, atout ${suits[i]}`;
    rules[id] = effect
  }
}
suits = ['hearts', 'spades', 'diamonds', 'clubs'];
let numbers = Array.from({length: 9})
  .map((_, i) => ({kind: 'number', num: i + 1}))
  .map(v => suits.map(suit => ({...v, suit})))
  .flat()

let scores = {
  'get-the-ace': "As: 1 -> 1pt, 2 -> 3pt, 3 -> 5pt, 4 -> win",
  '7-wheel': "7 -> 1pt, 777 -> win",
  tricks: '+1pt / pli',
  pairs: '+1pt / paire',
  sour: '2 * x = 3pt, 3 * x = -2pt',
  'no-tricks': '0 plis = 5 pts',
  'avoid-5': '5 = -1 pt',
  'avoid-2': '2 = -1pt',
'get-4': '4 = 1pt',
  'get-3': '3 = 1pt',
  'get-6': '6 = 1pt',
  diamonds: 'x carreaux = x pts',
  chevre: "Chaque pli gagné dans ce monde = -2pts",
  triples: 'Chaque triple vaut 3 points',
  421: "Chaque instance d'un triplé 4-2-1 vaut 4 points."
}

let added_rules = {
  'crazy-8': 'cartes doivent matcher soit nombre ou couleur, dernière carte gagne',
  'biggest-wins-simult': 'Jouez en même temps, la carte la plus haute gagne.',
  'lowest-wins-simult': 'Jouez en même temps, la carte la plus basse gagne.',
  'chevre': 'croissant, atout pique',
}

Object.assign(rules, added_rules);

let make_world = (id, name, effect, score) => {
  effect = rules[effect];
  score = scores[score];
  return ({kind: 'world', id, name, effect, score})
}

let make_world_ = (effect, score) =>
  make_world("", "", effect, score)

let worlds = [
  make_world_('coeur-croissant', 'get-the-ace'),
  make_world_('pique-croissant', '7-wheel'),
  make_world_('trefle-croissant', 'avoid-2'),
  make_world_('carreau-croissant', 'get-4'),
  make_world_('coeur-décroissant', 'diamonds'),
  make_world_('pique-décroissant', '421'),
  make_world_('trefle-décroissant', 'tricks'),
  make_world_('carreau-décroissant', 'avoid-5'),
  make_world_('crazy-8', 'get-6'),
  make_world_('biggest-wins-simult', 'sour'),
  make_world_('lowest-wins-simult', 'no-tricks'),
  make_world_('chevre', 'chevre'),
]

let portals = Array.from({length: 4})
  .map(_ => ({kind: 'portal'}))

// merge the rules here
console.log(rules);

let draw_world = (p, card) => {
  p.textSize(50);
  p.strokeWeight(2);
  chcol(p, black);
  p.textAlign(p.CENTER, p.TOP);
  p.noFill();
  let gap = 50;
  let y = hh + 50;
  p.rect(gap, y, w - 2 * gap, 200);
  p.fill(black);
  p.text(card.effect, gap + 30, y + 20, w - 2*gap-30);
  y += 230
  p.noFill(black);
  p.rect(gap, y, w - 2 * gap, 200);
  p.fill(black);
  p.text(card.score, gap + 30, y + 30, w - 2 * gap - 30);
}

let draw_number = (p, card) => {
  p.push();
  chcol(p, 'black');
  p.strokeWeight(5);
  p.textSize(110);
  let x = 40;
  let y = 30;
  p.textAlign(p.CENTER, p.TOP);
  let txt = (card.num);
  p.text(txt, 2*x, y);
  p.image(icons[card.suit], x - x / 2 , y + 100, 120, 120);
  p.push()
  p.translate(w - x, h - y);
  p.rotate(p.PI);
  p.textAlign(p.CENTER, p.TOP);
  p.image(icons[card.suit], -x/2 , y + 70, 120, 120);
  // p.textAlign(p.RIGHT, p.BOTTOM);
  p.text(txt,x,0);
  p.pop();
  p.pop();
}



let draw_card = (p, card) => {
  if (card.kind == 'world') {
    draw_world(p, card);
  } else if (card.kind == 'number') {
    draw_number(p, card);
  } else if (card.kind == 'portal') {
    p.push();
    chcol(p, black);
    p.textSize(100);
    p.textFont(font);
    p.strokeWeight(5);
    p.textAlign(p.CENTER);
    p.text('portail', hw, hh);
    p.pop();
  }
}




const struct = p => {
  p.preload = () => {
    font = p.loadFont("assets/Raleway-variable.ttf");
    icons = {
      hearts: p.loadImage("assets/icons/hearts.png"),
      spades: p.loadImage("assets/icons/spades.png"),
      diamonds: p.loadImage("assets/icons/diamonds.png"),
      clubs: p.loadImage("assets/icons/clubs.png"),
    }
    effects_img = {
    }
    cards = portals.concat(numbers).concat(worlds);
    console.log(cards);
  }

  p.setup = () => {
    p.createCanvas(w, h);
    gray = p.color(170, 170, 170);
    gray.setAlpha(200);
    trwhite = p.color(0xff,0xff,0xff, 200);
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
    draw_card(p,card);
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
