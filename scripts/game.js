// Data

const baseMatrix = [
  //18*18
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 2, 2, 0, 0, 3, 3, 3, 0, 0, 0, 0, 1, 0, 0, 0, 3],
  [0, 0, 2, 2, 0, 0, 3, 3, 3, 0, 0, 0, 0, 1, 0, 0, 0, 3],
  [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
];
const gridSize = 18;

let materialObj = {
  tree: { className: "tree", id: 1, stock: 0, cursor: 'url("assets/images/forcursor/wood.png"), auto' },
  leaves: { className: "leaves", id: 2, stock: 0, cursor: 'url("assets/images/forcursor/leaves.png"), auto' },
  rock: { className: "rock", id: 3, stock: 0, cursor: 'url("assets/images/forcursor/rock.png"), auto' },
  ground: { className: "ground", id: 4, stock: 0, cursor: 'url("assets/images/forcursor/soil.png"), auto' },
  grass: { className: "grass", id: 5, stock: 0, cursor: 'url("assets/images/forcursor/grass.png"), auto' },
  cloud: {
    className: "cloud",
    id: 6,
    stock: 0,
    ignore: true,
    cursor: 'url("assets/images/forcursor/cloud.png"), auto',
  },
  empty: { className: "0", id: 0, ignore: true },
};

const tools = {
  axe: {
    className: "axe",
    canDig: [materialObj.tree.className, materialObj.leaves.className],
    cursor: 'url("assets/images/forcursor/axe.png"), auto',
  },
  pickaxe: {
    className: "pickaxe",
    canDig: [materialObj.rock.className],
    cursor: 'url("assets/images/forcursor/pickaxe.png"), auto',
  },
  shovel: {
    className: "shovel",
    canDig: [materialObj.grass.className, materialObj.ground.className],
    cursor: 'url("assets/images/forcursor/shovel.png"), auto',
  },
  picked: { className: "picked-tool" },
  tool: { className: "tool" },
};

let currentTool;
let tempInventory;

// Selectors
const gameBoard = document.querySelector("#game-board");
gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

const toolBox = document.querySelector("#tool-box");
const inventoryShowCase = document.querySelector(".inventory ul");
const toolsShowCase = document.querySelector(".tools");
const resetButton = document.querySelector(".reset-btn");
const startButton = document.querySelector(".start-btn");

// Event Listeners

window.OnLoad = generateGameFromMatrix(baseMatrix);
window.OnLoad = updateInventory();

gameBoard.addEventListener("click", (e) => {
  if (e.target === gameBoard) return;
  craft(e);
  updateInventory();
  changeCursor();
});

toolBox.addEventListener("click", (e) => {
  saveCurrentTool(e);
  grabFromInventory(e);
  changeCursor();
});

resetButton.addEventListener("click", resetGame);

startButton.addEventListener("click", hideSplashScreen);

// Functions

function hideSplashScreen() {
  startButton.parentElement.style.animation = "fadeOut 2s";
  setTimeout(() => {
    startButton.parentElement.id = "hidden";
  }, 1900);
}

//matrix initialize
function generateGameFromMatrix(matrix) {
  gameBoard.innerHTML = "";
  // runs on each row
  matrix.forEach((row, yIndex) => {
    // runs on each column
    row.forEach((column, xIndex) => {
      // save current position id
      const currentPositionId = matrix[yIndex][xIndex];
      // create a block
      const block = document.createElement("div");
      // add style by id
      switch (currentPositionId) {
        case 1:
          block.classList.add(materialObj.tree.className);
          break;
        case 2:
          block.classList.add(materialObj.leaves.className);
          break;
        case 3:
          block.classList.add(materialObj.rock.className);
          break;
        case 4:
          block.classList.add(materialObj.ground.className);
          break;
        case 5:
          block.classList.add(materialObj.grass.className);
          break;
        case 6:
          block.classList.add(materialObj.cloud.className);
          break;
      }
      // save x and y coordinates
      block.setAttribute("data-y", yIndex);
      block.setAttribute("data-x", xIndex);
      gameBoard.appendChild(block);
    });
  });
}

function saveCurrentTool(e) {
  if (e.target.parentElement === toolsShowCase) {
    if (e.target.classList.contains(tools.picked.className)) {
      //unpick if needed
      clearAllPicked(e);
      return;
    }
    // saves current tool if it was picked
    if (e.target.classList.contains(tools.tool.className)) {
      // turn off other tools if selected
      clearAllPicked(e);
      // add picked class to tool
      e.target.classList.add(tools.picked.className);
      // set tool as current
      currentTool = e.target.classList[0];
    }
  }
}

function grabFromInventory(e) {
  if (e.target.parentElement === inventoryShowCase) {
    if (e.target.classList.contains(tools.picked.className)) {
      clearAllPicked(e);
      return;
    }
    //unpick if needed
    clearAllPicked(e);
    tempInventory = e.target.className;
    e.target.classList.add(tools.picked.className);
  }
}

function clearAllPicked() {
  tempInventory = null;
  currentTool = null;
  document.querySelectorAll(".picked-tool").forEach((picked) => picked.classList.remove(tools.picked.className));
}

function updateInventory() {
  inventoryShowCase.innerHTML = "";
  // loops over each inventory item and renders to user if needed;
  for (const item in materialObj) {
    if (materialObj[item].ignore) return;
    // create li
    const li = document.createElement("li");
    // create span
    const stockNum = document.createElement("span");
    li.appendChild(stockNum);
    if (materialObj[item].stock > 0) {
      stockNum.textContent = materialObj[item].stock;
      li.classList = materialObj[item].className;
      inventoryShowCase.prepend(li);
    } else {
      inventoryShowCase.append(li);
    }
  }
}

function craft(e) {
  // check if tool or input was selected
  if (currentTool) {
    if (tools[currentTool].canDig.includes(e.target.className)) {
      materialObj[e.target.className].stock++;
      e.target.classList.remove(e.target.className);
      updateMatrix(e);
      return;
    }
  }
  if (tempInventory && checkAllSides(e)) {
    if (e.target.classList.length === 0) {
      e.target.classList = tempInventory;
      updateMatrix(e);
      materialObj[tempInventory].stock--;
      if (materialObj[tempInventory].stock == 0) {
        tempInventory = null;
      }
    }
  }
  return;
}

function changeCursor() {
  gameBoard.style.cursor = null;
  if (tempInventory) {
    gameBoard.style.cursor = materialObj[tempInventory].cursor;
  }
  if (currentTool) {
    gameBoard.style.cursor = tools[currentTool].cursor;
  }
}

function updateMatrix(e) {
  if (e.target.className == "") {
    baseMatrix[e.target.dataset.y][e.target.dataset.x] = 0;
    return;
  }
  baseMatrix[e.target.dataset.y][e.target.dataset.x] = materialObj[e.target.className].id;
}

function clearStock() {
  for (material in materialObj) {
    materialObj[material].stock = 0;
  }
}

function resetGame() {
  generateGameFromMatrix(baseMatrix);
  clearStock();
  clearAllPicked();
  updateInventory();
  changeCursor();
}

function getBlockByXY(x, y) {
  return document.querySelector(`[data-x='${x}'][data-y='${y}']`);
}

//TODO fix cloud insert
function checkAllSides(e) {
  const x = parseInt(e.target.dataset.x),
    y = parseInt(e.target.dataset.y);
  let sides = [getBlockByXY(x, y - 1), getBlockByXY(x, y + 1), getBlockByXY(x - 1, y), getBlockByXY(x + 1, y)];

  for (side of sides) {
    if (!side) {
      sides.splice(sides.indexOf(side), 1);
    } else {
      if (side.classList.length > 0) return true;
    }
  }
  return false;
}

function saveGame() {
  window.localStorage.setItem("savedGameMap", JSON.stringify(baseMatrix));
  window.localStorage.setItem("savedGameInventory", JSON.stringify(materialObj));
}

function loadGame() {
  const savedGameMap = JSON.parse(window.localStorage.getItem("savedGameMap"));
  const savedGameInventory = JSON.parse(window.localStorage.getItem("savedGameInventory"));
  generateGameFromMatrix(savedGameMap);
  materialObj = savedGameInventory;
  updateInventory();
}
