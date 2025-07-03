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

let colors = {
  blue: {
    id: 'blue',
    code: '#8eecf5'
  },
  yellow: {
    id: 'yellow',
    code: '#fbf8cc'
  },
  pink: {
    id: 'pink',
    code: '#f1c0e8'
  },
  green: {
    id: 'green',
    code: '#b9fbc0'
  }
}

let black = "#3d3022";
let white = "#fff";

let chcol = (p, col) => {
  p.fill(col);
  p.stroke(col);
}

let suits = ['blue', 'green', 'yellow', 'pink']
let order = ['inc', 'dec']
let rules = {}
for (let i = 0; i < suits.length; i++) {
  for (let j = 0; j < order.length; j++) {
    let id = `${suits[i]}-${order[j]}`;
    let effect = `${order[j]}, atout ${suits[i]}`;
    rules[id] = effect
  }
}
let categories = ['flower', 'mountain', 'planet'];
let numbers = 
  categories.map(category => {
    let obj = {category};
    return [obj, obj, obj]
  })
  .flat()
  .map((obj, i) => ({...obj, kind: 'number', num: i + 1}))
  .map(v => suits.map(suit => ({...v, suit})))
  .flat()


let make_world = (id, name, effect, score) => {
  effect = rules[effect];
  score = scores[score];
  return ({kind: 'world', id, name, effect, score})
}

let make_world_ = (effect, score) =>
  make_world("", "", effect, score)

let worlds = ["+1", "+2", "+3", "-1"]
  .map(delta => categories.map(c => ({delta, category: c, kind: 'world'})))
  .flat()
  .map((v, i) => ({...v, suit: suits[i%4]}))
  .map((v, i) => ({...v, order: ['inc', 'inc', 'dec'][i%3]}))

console.log(worlds);

let portals = Array.from({length: 4})
  .map(_ => ({kind: 'portal'}))

let draw_world = (p, card) => {
  p.fill(colors[card.suit].code);
  p.rect(0, 0, w, h);
  p.textSize(70);
  p.strokeWeight(4);
  chcol(p, black);
  p.textAlign(p.CENTER, p.TOP);
  p.noFill();
  let y = hh + 300;
  let x = {
    planet: hw - 200,
    mountain: hw,
    flower: hw + 200
  }
  p.imageMode(p.CENTER);
  for (let category of Object.keys(x)) {
    p.image(icons[category], x[category], y, 100, 100);
  }
  p.fill(black);
  p.text(card.delta, x[card.category], y + 100);
  p.push();
  p.translate(hw, hh - 100);
  let b = (card.order == 'inc') ? -1 : 1;
  let c = (card.order == 'inc') ? '>' : '<';
  // p.rotate((p.PI / 2) * b);
  // p.image(icons.arrow, 0, 0, 200, 200);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(200);
  p.text(c, 0, 0);
  p.pop();
 }

let draw_number = (p, card) => {
  p.fill(colors[card.suit].code);
  p.rect(0, 0, w, h);
  p.push();
  chcol(p, 'black');
  p.strokeWeight(5);
  p.textSize(110);
  let x = 40;
  let y = 30;
  p.textAlign(p.CENTER, p.TOP);
  let txt = (card.num);
  p.text(txt, 2*x, y);
  // p.image(icons[card.suit], x - x / 2 , y + 100, 120, 120);
  p.push()
  p.translate(w - x, h - y);
  p.rotate(p.PI);
  p.textAlign(p.CENTER, p.TOP);
  // p.image(icons[card.suit], -x/2 , y + 70, 120, 120);
  // p.textAlign(p.RIGHT, p.BOTTOM);
  p.text(txt,x,0);
  p.pop();
  p.pop();
  p.imageMode(p.CENTER);
  p.image(icons[card.category], hw, hh, 300, 300);
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
      planet: p.loadImage('assets/icons/planet.png'),
      mountain: p.loadImage('assets/icons/mountain.png'),
      flower: p.loadImage('assets/icons/flower.png'),
      arrow: p.loadImage('assets/icons/arrow.png')
    }
    effects_img = {
    }
    cards = portals.concat(numbers).concat(worlds);
    cards = worlds;
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
