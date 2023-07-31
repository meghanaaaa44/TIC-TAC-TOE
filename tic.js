const player_1 = "X";
const player_2 = "O";             // in single player, player 2 is treated as computer
let turn = 0;                     // turn=0 means player 1's turn,turn=1 means player 2's turn
let score_player_1 = 0;           // current score of player 1
let score_player_2 = 0;           // current score of player 2
let play1_high = 0;               // high score of player 1
let play2_high = 0;               // high score of player 2
let computer_easy = 0;            // decides easy/hard ; easy=0, hard=1
let full_board = false;           // whether the baord is full
let board = ["", "", "", "", "", "", "", "", ""];
let single_player = 0;
const board_container = document.querySelector(".play-area");
const score_container = document.querySelector(".container_header");
const winner = document.getElementById("winner");

check_board_complete = () => {
  let flag = true;
  board.forEach((x) => {
    if (x != player_1 && x != player_2) {
      flag = false;
    }
  });
  full_board = flag;
};

const check_line = (a, b, c) => {
  return (
    board[a] == board[b] &&
    board[b] == board[c] &&
    (board[a] == player_1 || board[a] == player_2)
  );
};

const check_match = () => {
  for (i = 0; i < 9; i += 3) {
    if (check_line(i, i + 1, i + 2)) {
      return board[i];
    }
  }
  for (i = 0; i < 3; i++) {
    if (check_line(i, i + 3, i + 6)) {
      return board[i];
    }
  }
  if (check_line(0, 4, 8)) {
    return board[0];
  }
  if (check_line(2, 4, 6)) {
    return board[2];
  }
  return "";
};

const winner_blocks = () => {
  for (i = 0; i < 3; i++) {
    if (
      board[i * 3] == board[i * 3 + 1] &&
      board[i * 3 + 1] == board[i * 3 + 2] &&
      board[i * 3] != ""
    )
      return [i * 3, i * 3 + 1, i * 3 + 2];
  }
  for (i = 0; i < 3; i++) {
    if (
      board[i] == board[i + 3] &&
      board[i + 3] == board[i + 6] &&
      board[i] != ""
    )
      return [i, i + 3, i + 6];
  }
  if (board[0] == board[4] && board[4] == board[8] && board[0] != "")
    return [0, 4, 8];
  return [2, 4, 6];
};
const check_winner = () => {
  let result = check_match();
  if (result == player_1) {
    if (single_player == 0) winner.innerText = "WINNER: PLAYER 1";
    else winner.innerText = "WINNER: PLAYER";
    winner.classList.add("PLAYER_1_WIN");
    full_board = true;
    score_player_1 = score_player_1 + 1;
    let cells = winner_blocks();
    for (i = 0; i < 3; i++)
      document.querySelector(`#block_${cells[i]}`).classList.add("won");
    document.getElementById("1").innerHTML = score_player_1;
    play1_high = Math.max(play1_high, score_player_1);
    document.getElementById("high1").innerHTML = Math.max(
      score_player_1,
      play1_high
    );
  } else if (result == player_2) {
    if (single_player == 0) winner.innerText = "WINNER: PLAYER 2";
    else winner.innerText = "WINNER: COMPUTER";
    winner.classList.add("PLAYER_2_WIN");

    full_board = true;
    score_player_2 = score_player_2 + 1;
    let cells = winner_blocks();
    for (i = 0; i < 3; i++)
      document.querySelector(`#block_${cells[i]}`).classList.add("won");
    document.getElementById("2").innerHTML = score_player_2;
    play2_high = Math.max(score_player_2, play2_high);
    document.getElementById("high2").innerHTML = play2_high;
  } else if (full_board) {
    winner.innerText = "DRAW";
    winner.classList.add("DRAW");
    board_container.classList.add("draw");
  }
};

const render_board = () => {
  board_container.innerHTML = "";
  board.forEach((c, i) => {
    board_container.innerHTML += `<div id="block_${i}" class="block" onclick="addPlayerMove(${i})">${board[i]}</div>`;
    if (c == player_1 || c == player_2) {
      document.querySelector(`#block_${i}`).classList.add("occupied");
    }
  });
};

const loop = () => {
  render_board();
  check_board_complete();
  check_winner();
};
function miniMax(board, depth, isMax) {
  let result = check_match();
  check_board_complete();
  if (result == player_1) return 10;
  else if (result == player_2) return -10;
  else if (full_board) return 0;
  if (isMax == true) {
    let currScore,
      bestScore = -1000;
    let m = 0;
    for (m = 0; m < 9; m++) {
      if (board[m] == "") {
        board[m] = player_1;
        currScore = miniMax(board, depth + 1, false);
        bestScore = Math.max(bestScore, currScore);
        board[m] = "";
      }
    }
    return bestScore;
  } else {
    let currScore,
      bestScore = 1000;
    let n = 0;
    for (n = 0; n < 9; n++) {
      if (board[n] == "") {
        board[n] = player_2;
        currScore = miniMax(board, depth + 1, true);
        bestScore = Math.min(bestScore, currScore);
        board[n] = "";
      }
    }
    return bestScore;
  }
}
const computerMove = () => {
  if (!full_board) {
    if (computer_easy == 0) {
      let currBest = 10000;
      let bestPosition;
      for (j = 0; j < 9; j++) {
        if (board[j] != player_1 && board[j] != player_2) {
          board[j] = player_2;
          let possibleBest = miniMax(board, 0, true);
          if (possibleBest < currBest) {
            currBest = possibleBest;
            bestPosition = j;
          }
          board[j] = "";
        }
      }
      board[bestPosition] = player_2;
      loop();
    } else {
      do {
        randomPosition = Math.floor(Math.random() * 9);
      } while (board[randomPosition] != "");
      board[randomPosition] = player_2;
      loop();
    }
  }
};
const addPlayerMove = (e) => {
  if (single_player == 0) {
    if (!full_board && board[e] == "") {
      if (turn == 0) {
        board[e] = player_1;
      } else {
        board[e] = player_2;
      }
      turn = 1 - turn;
      loop();
    }
  } else {
    if (!full_board && board[e] == "") {
      board[e] = player_1;
      loop();
      computerMove();
    }
  }
};
const reset_board = () => {
  board = ["", "", "", "", "", "", "", "", ""];
  turn = 0;
  full_board = false;
  winner.classList.remove("PLAYER_1_WIN");
  winner.classList.remove("PLAYER_2_WIN");
  winner.classList.remove("DRAW");
  board_container.classList.remove("draw");
  winner.innerText = "";
  render_board();
};

const computer_level = () => {
  if (computer_easy == 0) {
    computer_easy = 1;
    document.getElementById("mode").innerHTML = "HARD";
  } else {
    computer_easy = 0;
    document.getElementById("mode").innerHTML = "EASY";
  }
  reset_board();
  reset_score();
};

const reset_score = () => {
  document.getElementById("2").innerHTML = 0;
  score_player_2 = 0;
  document.getElementById("1").innerHTML = 0;
  score_player_1 = 0;
};
const no_of_players = () => {
  if (single_player == 0) {
    single_player = 1;
    document.getElementById("ok").innerHTML = "2 PLAYER";
    document.getElementById("play_1").innerHTML = "PLAYER";
    document.getElementById("play_2").innerHTML = "COMPUTER";
    document.getElementById("mode").style.display = "block";
  } else {
    single_player = 0;
    document.getElementById("ok").innerHTML = "1 PLAYER";
    document.getElementById("play_1").innerHTML = "PLAYER 1";
    document.getElementById("play_2").innerHTML = "PLAYER 2";
    document.getElementById("mode").style.display = "none";
  }
  reset_board();
  reset_score();
  document.getElementById("high1").innerHTML = 0;
  document.getElementById("high2").innerHTML = 0;
};
reset_score();
render_board();
document.getElementById("high1").innerHTML = 0;
document.getElementById("high2").innerHTML = 0;
document.getElementById("mode").style.display = "none";
