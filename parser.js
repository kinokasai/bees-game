
// @ts-check

let parse = (/** @type {string} */ s) => {
  let array = s.split('\n');
  let array_ = array.map(s => s.split(' '));
  return array_;
};

let do_layout_inner = (/** @type {string[]} */ arr, /** @type {number} */ max_length) => {
  var lines = [];
  var i = 1;
  var line = arr[0] + " " + arr[1];
  var prev_line = arr[0];
  while (i < arr.length - 1) {
    // @ts-ignore
    if (textWidth(line) > max_length) {
      lines.push(prev_line);
      line = arr[i];
    } else {
      prev_line = line;
      i = i + 1;
      line = line + " " + arr[i];
    }
  }
  // @ts-ignore
  if (textWidth(line) > max_length) {
    lines.push(prev_line);
    lines.push(arr[i])
  }
  else
    lines.push(line)
  return lines.join('\n');
};

let flush_line = (cur_line, alpha, line_nb, interline) => {
  let words = []
  let tmp_len = 0;
  for (let w of cur_line) {
    let obj = {word: w.word, x: tmp_len, y: line_nb * interline}
    words.push(obj);
    tmp_len += w.len + alpha;
  }
  return words;
}

let calculate_alpha = (cur_line, min_space, max_len, line_len) => {
      let word_nb = cur_line.length - 1;
      let words_len = line_len - word_nb * min_space
      let space_len = max_len - words_len;
      let alpha = space_len / word_nb;
        return alpha;
      }

let do_layout_inner_justify = (
  p,
  /** @type {string[]} */ arr,
  /** @type {number} */ max_len,
  /** @type{number} */ min_space,
  /** @type {number} */ optimal_space,
  /** @type {number} */ interline,
  line_nb) => {
  let words = [];
  let cur_line = [];
  // @ts-ignore
  let line_len = 0
  let i = 0;
  while (i < arr.length) {
    let word = arr[i];
    // @ts-ignore
    let len = p.textWidth(word);
    line_len += len + ((cur_line.length > 0) ? min_space : 0);
    if (line_len < max_len) { /* word fits */
      cur_line.push({word, len})
      i += 1;
    } else {
      let alpha = calculate_alpha(cur_line, min_space, max_len, line_len - min_space - len)
      words = words.concat(flush_line(cur_line, alpha, line_nb, interline));
      /* loop cleanup */
      line_nb += 1;
      cur_line = []
      line_len = 0;
    }
  }
  let alpha = calculate_alpha(cur_line, min_space, max_len, line_len - min_space)
  // Do words fit in with the optimal_space?
  alpha = (alpha > optimal_space) ? optimal_space : alpha;
  words = words.concat(flush_line(cur_line, alpha, line_nb, interline));
  return {words: words, line_nb};
}

let justify_text_inn = (
  p,
  /** @type {string[][]} */ arr,
  /** @type {number} */ max_len,
  /** @type{number} */ min_space,
  /** @type {number} */ optimal_space,
  /** @type {number} */ interline) => {
  let line_nb = -1;
  let words = []
  for (let line of arr) {
    let text = do_layout_inner_justify(p, line, max_len, min_space, optimal_space, interline, line_nb + 1);
    line_nb = text.line_nb;
    words = words.concat(text.words);
  }
  return {words: words, line_nb};
}

let justify_text = (p,
   /** @type {string} */ txt,
  /** @type {number} */ max_len,
  /** @type{number} */ min_space,
  /** @type {number} */ optimal_space,
  /** @type {number} */ interline) => {
  let parsed = parse(txt);
  return justify_text_inn(p, parsed, max_len, min_space, optimal_space, interline);
}

let count_char = (/** @type {string} */s, /** @type {string} */ char) => {
  let i = 0;
  for (let c of s) {
    if (c === char) {
      i += 1;
    }
  }
  return i;
}


let do_layout = (/** @type {string[][]} */ arr, /** @type {number} */ max_length) => {
  let lines = arr.map(s => do_layout_inner(s, max_length));
  let text = lines.join("\n");
  let count = count_char(text, '\n');
  return [lines.join("\n"), count + 1];
}
