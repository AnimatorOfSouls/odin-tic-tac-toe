const Player = (id) => {
  let symbol;
  id == 0 ? symbol = "X" : symbol = "O";

  const markCell = (gameBoard, id) => {
    const cell = document.querySelector(`.cell[id="${id}"]`);
    cell.innerText = symbol;
    gameBoard.setCell(id, symbol);
  }

  return { markCell };
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

  return { getBoard, setCell, restart };
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
    console.log(result)
    switch (result.result) {
      case "CONTINUE":
        currentPlayer == 0 ? currentPlayer = 1 : currentPlayer = 0;
        document.querySelector(".current-player").innerText = currentPlayer + 1;
        break;
      case "DRAW":
        gameOver("Draw");
        break;
      case "WIN":
        gameOver(`Player ${ currentPlayer + 1 } wins!`);
        break;
    }
  }

  const renderGameBoard = (gameBoard) => {
    const container = document.querySelector(".game-board");
    for (let i = 0; i < gameBoard.getBoard().length; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("id", i);
      cell.addEventListener("click", (e) => {
        if (e.target.innerText !== "") return;
        players[currentPlayer].markCell(gameBoard, i);
        let result = checkResults(gameBoard);
        processResult(result);
      });
      container.appendChild(cell);
    }
  }

  const restartGame = () => {
    gameBoard.restart();
    currentPlayer = 0;
    document.querySelector(".current-player").innerText = 1;
    document.querySelector(".end-screen-container").classList.add("hidden");
  }

  return { renderGameBoard, restartGame };
})();

displayController.renderGameBoard(gameBoard);
document.querySelectorAll(".restart").forEach((button) => {
  button.addEventListener("click", displayController.restartGame);
});



