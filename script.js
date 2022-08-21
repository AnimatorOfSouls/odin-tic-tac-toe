const Player = (id) => {
  let symbol;
  id == 0 ? symbol = "X" : symbol = "O";
  let name = id;

  const markCell = (gameBoard, id) => {
    const cell = document.querySelector(`.cell[id="${id}"]`);
    cell.innerText = symbol;
    gameBoard.setCell(id, symbol);
  }

  const getName = () => {
    return name;
  }

  const setName = (n) => {
    name = n.toString();
  }

  return { markCell, getName, setName };
}

const gameBoard = (() => {
  let gameBoard = ["","","","","","","","",""];

  const getBoard = () => {
    return Array.from(gameBoard);
  }

  const setCell = (id, value) => {
    gameBoard[id] = value.toString();
  }

  const restart = () => {
    gameBoard = ["","","","","","","","",""];
    let cells = document.querySelectorAll(".cell");
    cells.forEach(item => item.innerText = "");
  }

  const disableBoard = () => {
    document.querySelector(".game-board").classList.add("disabled");
    document.querySelectorAll(".cell").forEach(cell => cell.classList.add("disabled"));
  }

  const enableBoard = () => {
    document.querySelector(".game-board").classList.remove("disabled");
    document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("disabled"));
  }

  return { getBoard, setCell, restart, disableBoard, enableBoard };
})();

const displayController = (() => {
  let currentPlayer = 0;
  const players = [Player(0), Player(1)];

  const checkResults = (gameBoard) => {
    let board = gameBoard.getBoard()

    function isWin(array, startPos) {
      return array.every((value) => value === board[startPos] && value !== "");
    }

    for (let i = 0; i < 9; i += 3) {
      let row = board.slice(i, i+3);
      if (isWin(row, i)) return {result: "WIN", pos: i, shape: "ROW"};
    }
    for (let i = 0; i < 3; i++) {
      let col = [board[i], board[i+3], board[i+6]];
      if (isWin(col, i)) return {result: "WIN", pos: i, shape: "COL"};
    }

    let diag1 = [board[0], board[4], board[8]];
    if (isWin(diag1, 0)) return {result: "WIN", pos: 0, shape: "DIAG"};
    let diag2 = [board[2], board[4], board[6]];
    if (isWin(diag2, 2)) return {result: "WIN", pos: 2, shape: "DIAG"};

    if (board.every((value) => value !== "")) return {result: "DRAW"};
    return {result: "CONTINUE"};
  }

  const gameOver = (winner) => {
    document.querySelector(".end-screen-container").classList.remove("hidden");
    document.querySelector(".winner").innerText = winner;
  }

  const processResult = (result) => {
    switch (result.result) {
      case "CONTINUE":
        const players = document.querySelectorAll(".player");
        if (currentPlayer == 0) {
          currentPlayer = 1;
          players[0].classList.add("next-player");
          players[1].classList.remove("next-player");
        } else {
          currentPlayer = 0
          players[0].classList.remove("next-player");
          players[1].classList.add("next-player");
        }
        break;
      case "DRAW":
        gameOver("Draw");
        break;
      case "WIN":
        gameOver(`Player ${ currentPlayer + 1 } wins!`);
        break;
    }
  }
  
  const createBoard = (gameBoard) => {
    const container = document.querySelector(".game-board");
    for (let i = 0; i < gameBoard.getBoard().length; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("id", i);
      cell.addEventListener("click", (e) => {
        if (e.target.innerText !== "") return;
        if (e.target.classList.contains("disabled")) return;
        players[currentPlayer].markCell(gameBoard, i);
        let result = checkResults(gameBoard);
        processResult(result);
      });
      container.appendChild(cell);
    }
  }

  const playerNameEditor = (e, gameBoard) => {
    const state = e.target["id"];
    let otherState;
    state === "edit" ? otherState = "check" : otherState = "edit";

    let input1 = document.querySelector(".player-name[id='0']").value.trim()
    let input2 = document.querySelector(".player-name[id='1']").value.trim()
    if (state === "check" && (input1.length == 0 || input2.length == 0)) { 
      alert("Player name cannot be empty!");
      return;
    }
    
    document.querySelector(`img[id="${otherState}"]`).classList.remove("hidden");
    e.target.classList.add("hidden");

    document.querySelectorAll("input.player-name").forEach((e) => {
      if (state === "edit") {
        e.classList.remove("hidden");
        gameBoard.disableBoard();
        document.querySelectorAll(".player").forEach((p) => {p.classList.add("hidden")});
      } else {
        document.querySelector(".player[id='0']").innerText = input1;
        document.querySelector(".player[id='1']").innerText = input2;

        e.classList.add("hidden");
        gameBoard.enableBoard();
        document.querySelectorAll(".player").forEach(p => p.classList.remove("hidden"))
      }
    });
  }

  const renderGameBoard = (gameBoard) => {
    createBoard(gameBoard);

    document.querySelectorAll("input.player-name").forEach((e) => {
      const id = e["id"];
      document.querySelector(`.player-name[id="${id}"]`).value = `Player ${parseInt(id) + 1}`;
    });

    document.querySelector(".edit-name").addEventListener("click", (e) => { playerNameEditor(e, gameBoard) });
  }

  const restartGame = () => {
    gameBoard.restart();
    currentPlayer = 0;
    document.querySelector(".player[id='0']").classList.remove("next-player");
    document.querySelector(".player[id='1']").classList.add("next-player");
    document.querySelector(".end-screen-container").classList.add("hidden");
  }

  return { renderGameBoard, restartGame };
})();

displayController.renderGameBoard(gameBoard);
document.querySelectorAll(".restart").forEach((button) => {
  button.addEventListener("click", displayController.restartGame);
});


