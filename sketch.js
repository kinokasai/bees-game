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

let fam_colors = {
  'diamonds': "#ffdfb7",
  'hearts': "#caffbf",
  'spades': "#e6ccb2",
  'clubs': "#9bf6ff"
}

let rank_txt = num => {
  if (num == '1') { return 'A'; }
  if (num == '11') { return 'V'; }
  if (num == '12') { return 'D'; }
  if (num == '13') { return 'R'; }
  return num;
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

let effects = {
  1: "You may lead the next trick.",
  4: "If this card is discarded, you win the trick.",
  5: "You may switch this card with one in your sideboard.",
  6: "You may switch the trump card with a card in your hand.",
  7: "You may decide that your goal this round is to do 0 tricks.",
  8: "You can inverse the rank order of cards (Ace becomes best, 13 last).",
  10: "You can call for a card in this suit.",
}

let effects_fr = {
  1: "Vous pouvez entamer le pli suivant.",
  4: "Si cette carte est pissée, vous remportez le pli.",
  5: "Vous pouvez échanger cette carte contre une de vos cartes écartées.",
  6: "Vous pouvez échanger l'atout contre une carte de votre main.",
  7: "Vous pouvez décider que faire 0 pli permet de remporter la manche.",
  8: "Vous pouvez échanger l'ordre des cartes (1 devient la plus forte, 13 la moins forte).",
  10: "Vous pouvez appeler une carte dans cette couleur."
}

let draw_center_text = (p, txt) => {
  p.fill('black');
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(80);
  p.stroke(black);
  p.strokeWeight(4);
  p.textFont('Quicksand');
  p.text(txt, hw, hh);
}

let draw_card = (p, card) => {
  chcol(p, 'black');
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(70);
  p.strokeWeight(2);
  // p.text(card.name, hw, hh - hh/2 - 100)
  let img = effects_img[card.num];
  if (card.num == 10 ) {
    img = img(card.family)
  }
  if (img) {
    let iw = 80
    let ih = 50
    let r = 6.5
    p.image(img, (w - iw * r) / 2, (h - ih * r) / 2, iw * r, ih * r);
  }
  // let effect = effects_fr[card.num];
  // p.textAlign(p.LEFT);
  // p.textSize(60);
  // p.text(effect, 100, hh + 250, 520);
  p.strokeWeight(5);
  p.textSize(110);
  let x = 40;
  let y = 30;
  p.textAlign(p.CENTER, p.TOP);
  let txt = rank_txt(card.num);
  p.text(txt, 2*x, y);
  p.image(icons[card.family], x - x / 2 , y + 100, 120, 120);
  p.push()
  p.translate(w - x, h - y);
  p.rotate(p.PI);
  p.textAlign(p.CENTER, p.TOP);
  p.image(icons[card.family], -x/2 , y + 70, 120, 120);
  // p.textAlign(p.RIGHT, p.BOTTOM);
  p.text(txt,x,0);
  p.pop();
  // p.textAlign(p.RIGHT);
  // p.text(card.num, w - x, y);
  // p.textAlign(p.LEFT, p.BOTTOM)
  // p.text(card.num, x, h-y);
}

const struct = p => {
  p.preload = () => {
    font = p.loadFont("assets/Raleway-variable.ttf");
    icons = {
      hearts: p.loadImage("assets/icons/hearts.png"),
      spades: p.loadImage("assets/icons/spades.png"),
      diamonds: p.loadImage("assets/icons/diamonds.png"),
      clubs: p.loadImage("assets/icons/clubs.png"),
      call_clubs: p.loadImage('assets/call-clubs.png'),
      call_diamonds: p.loadImage('assets/call-diamonds.png'),
      call_hearts: p.loadImage('assets/call-hearts.png'),
      call_spades: p.loadImage('assets/call-spades.png'),
      change_trump: p.loadImage('assets/change-trump.png'),
      switch_board: p.loadImage('assets/change-with-board.png'),
      discard_win: p.loadImage('assets/discard-win.png'),
      king_killer: p.loadImage('assets/king-killer.png'),
      market_get_2: p.loadImage('assets/market-get-2.png'),
      no_tricks_win: p.loadImage('assets/no-tricks-win.png'),
      inverse_rank: p.loadImage('assets/rank_inverse.png')
    }
    effects_img = {
      1: icons.king_killer,
      2: icons.market_get_2,
      4: icons.discard_win,
      5: icons.switch_board,
      6: icons.change_trump,
      7: icons.no_tricks_win,
      8: icons.inverse_rank,
      10: (suit) => {
        if (suit == 'spades') { return icons.call_spades }
        if (suit == 'hearts') { return icons.call_hearts }
        if (suit == 'diamonds') { return icons.call_diamonds }
        if (suit == 'clubs') { return icons.call_clubs }
      }
    }


    cards = p.loadJSON('./cards.json', cards => {
    });
  }

  p.setup = () => {
    p.createCanvas(w, h);
    gray = p.color(170, 170, 170);
    gray.setAlpha(200);
    trwhite = p.color(0xff,0xff,0xff, 200);
    trsprt = p.color(0, 0, 0, 255);
    bufs = [p.createGraphics(w, h),
      p.createGraphics(w, h)]

  };

  p.draw = () => {
    p.textFont("Quicksand");
    let card = cards[window.index];
    // let color = fam_colors[card.family]
    p.fill(white);
    p.rect(0, 0, w, h);
    console.log(card);
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
