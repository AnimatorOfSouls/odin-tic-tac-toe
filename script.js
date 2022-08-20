const Player = (id) => {
  let symbol;
  id == 0 ? symbol = "X" : symbol = "O";

  const markCell = (id) => {
    const cell = document.querySelector(`.cell[id="${id}"]`);
    if (cell.innerText !== "") return;
    cell.innerText = symbol;
  }

  return { markCell };
}

const gameBoard = (() => {
  const gameBoard = ["","","","","","","","",""];

  return { gameBoard };
})();

const displayController = (() => {
  let currentPlayer = 0;
  const players = [Player(0), Player(1)];

  const renderGameBoard = (board) => {
    const container = document.querySelector(".game-board");
    console.log(board)
    for (let i = 0; i < board.gameBoard.length; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("id", i);
      cell.innerText = board.gameBoard[i];
      cell.addEventListener("click", (e) => {
        players[currentPlayer].markCell(i);
        currentPlayer == 0 ? currentPlayer = 1 : currentPlayer = 0;
      });
      container.appendChild(cell);
    }
  }

  return { renderGameBoard };
})();

displayController.renderGameBoard(gameBoard);



