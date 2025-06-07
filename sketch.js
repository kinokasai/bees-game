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

let front = { kind: "front", txt: "MOVE" }
let rotate_r = { kind: "rotate_right", txt: "ROTATE_RIGHT" }
let rotate_l = { kind: "rotate_left", txt: "ROTATE_LEFT" }
let turn_l = { kind: "turn_left", txt: "TURN_LEFT" }
let turn_r = { kind: "turn_right", txt: "TURN_RIGHT" }
let teleport = { kind: "teleport", txt: "TELEPORT" }
let attack = { kind: "attack", txt: "ATTACK" }
let double_front = { kind: "double_front", txt: "MOVE 2"}
let half_turn = { kind: "half_turn", txt: "U-TURN" }

let front_icon = (p) => {
  p.push();
  p.strokeWeight(5);
  p.scale(1.2);
  p.line(0, 20, 0, -20);
  p.line(0, -20, -10, -10);
  p.line(0, -20, 10, -10);
  p.pop();
}

let rotate_icon = (p) => {
  p.push();
  p.noFill();
  p.arc(0, 0, 40, 40, 0, 2*p.PI - 0.5);
  p.pop();
}

let draw_board = (p, card) => {
  p.push();
  p.noFill();
  let rw = 200;
  let rh = 200;
  let topx = hw - rw / 2;
  let topy = hh - rh / 2;
  let pw = rw / 4;
  let ph = rh / 4;
  for (let i = 0; i < 4; i++) {
    let x = topx + i * rw / 4;
    let y = topy + i * rh / 4;
    p.line(x, topy, x, topy + rh);
    p.line(topx, y, topx + rw, y);
  }
  p.rectMode(p.CENTER);
  p.rect(hw, hh, rw, rh);
  p.fill(black);
  let x = (card.index % 4) * pw + topx;
  let y = Math.floor(card.index / 4) * ph + topy;
  p.rectMode(p.CORNER);
  p.rect(x, y, pw, ph);
  p.pop();
  // coords
  p.push();
  let letters = ['A', 'B', 'C', 'D'];
  let letter = letters[card.index % 4];
  let num = Math.floor(card.index / 4) + 1;
  let str = `${letter}-${num}`;
  p.text(str, hw, hh - rh);
  p.pop();
}

let draw_card = (p, card) => {
  chcol(p, 'black');
  p.textSize(80);
  p.textAlign(p.CENTER, p.CENTER);
  let t = card.txt
  p.text(t, hw, 100);
  let bbox = font.textBounds(t, hw, 100);
  p.push();
  p.translate(bbox.x - 30, bbox.y + bbox.h / 2);
  // rotate_icon(p);
  p.pop();
  p.push();
  p.translate(hw, h - 100);
  p.rotate(p.PI);
  p.text(t, 0, 0);
  p.push();
  p.strokeWeight(5);
  p.translate(- bbox.w / 2 - 30, bbox.h / 4);
  // front_icon(p);
  p.pop();
  p.pop();
  draw_board(p, card);
}

const struct = p => {
  p.preload = () => {
    font = p.loadFont("assets/Raleway-variable.ttf");
    icons = {
    }
    effects_img = {
    }
    cards = [
      Array.from({length: 10}).map(_ => front),
      Array.from({length: 5}).map(_ => rotate_r),
      Array.from({length: 5}).map(_ => rotate_l),
      Array.from({length: 5}).map(_ => turn_l),
      Array.from({length: 5}).map(_ => turn_r),
      Array.from({length: 2}).map(_ => teleport),
      Array.from({length: 8}).map(_ => attack),
      Array.from({length: 4}).map(_ => double_front),
      Array.from({length: 4}).map(_ => half_turn),
    ]
      .flat()
      .map((v, i) => { return {...v, index: i % 16}});
    console.log(cards);
  }

  p.setup = () => {
    p.createCanvas(w, h);
    gray = p.color(170, 170, 170);
    gray.setAlpha(200);
    trwhite = p.color(0xff,0xff,0xff, 200);
    trsprt = p.color(0, 0, 0, 255);
    p.textFont(font);
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
