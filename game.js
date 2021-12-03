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

const materialObj = {
  tree: { className: "tree", id: 1, stock: 0 },
  leaves: { className: "leaves", id: 2, stock: 0 },
  rock: { className: "rock", id: 3, stock: 0 },
  ground: { className: "ground", id: 4, stock: 0 },
  grass: { className: "grass", id: 5, stock: 0 },
  cloud: { className: "cloud", id: 6, stock: 0, ignore: true },
};

const tools = {
  axe: { className: "axe", canDig: [materialObj.tree.className, materialObj.leaves.className] },
  pickaxe: { className: "pickaxe" },
  shovel: { className: "shovel" },
  picked: { className: "picked-tool" },
  tool: { className: "tool" },
};
let currentTool;
let tempInventory;

// Selectors

const gameBoard = document.querySelector("#game-board");
const toolBox = document.querySelector("#tool-box");
const inventoryShowCase = document.querySelector(".inventory ul");
const toolsShowCase = document.querySelector(".tools");

// Event Listeners

window.OnLoad = generateGameFromMatrix(baseMatrix);
window.OnLoad = updateInventory();

gameBoard.addEventListener("click", (e) => {
  craft(e);
  updateInventory();
});

toolBox.addEventListener("click", (e) => {
  saveCurrentTool(e);
  grabFromInventory(e);
});

// Functions

//matrix initialize
function generateGameFromMatrix(matrix) {
  gameBoard.innerHTML = "";
  // runs on each row
  baseMatrix.forEach((row, yIndex) => {
    // runs on each column
    row.forEach((column, xIndex) => {
      // save current position id
      const currentPositionId = baseMatrix[yIndex][xIndex];
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
      currentTool = e.target;
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
    if (
      currentTool.classList.contains(tools.axe.className) &&
      e.target.classList.contains(materialObj.tree.className)
    ) {
      materialObj.tree.stock++;
      e.target.classList.remove(materialObj.tree.className);
      return;
    }
    if (
      currentTool.classList.contains(tools.axe.className) &&
      e.target.classList.contains(materialObj.leaves.className)
    ) {
      materialObj.leaves.stock++;
      e.target.classList.remove(materialObj.leaves.className);
      return;
    }
    if (
      currentTool.classList.contains(tools.pickaxe.className) &&
      e.target.classList.contains(materialObj.rock.className)
    ) {
      materialObj.rock.stock++;
      e.target.classList.remove(materialObj.rock.className);
      return;
    }
    if (
      currentTool.classList.contains(tools.shovel.className) &&
      e.target.classList.contains(materialObj.grass.className)
    ) {
      materialObj.grass.stock++;
      e.target.classList.remove(materialObj.grass.className);
      return;
    }
    if (
      currentTool.classList.contains(tools.shovel.className) &&
      e.target.classList.contains(materialObj.ground.className)
    ) {
      materialObj.ground.stock++;
      e.target.classList.remove(materialObj.ground.className);
      return;
    }
  }
  if (tempInventory) {
    if (e.target.classList.length === 0) {
      e.target.classList = tempInventory;
      materialObj[tempInventory].stock--;
      tempInventory = null;
    }
  }
  return;
}

// function updateInventory() {
//   // almost - no delete
//   const currInv = Array.from(new Set(inventory));
//   inventoryShowCase.innerHTML = "";
//   // loops over each inventory item and renders to user if needed;
//   for (const item of currInv) {
//     // create li
//     const li = document.createElement("li");
//     // create span
//     const stockNum = document.createElement("span");
//     li.appendChild(stockNum);
//     if (materialObj[item].stock > 0) {
//       stockNum.textContent = materialObj[item].stock;
//       li.classList = materialObj[item].className;
//       inventoryShowCase.prepend(li);
//     } else {
//       inventoryShowCase.append(li);
//     }
//   }
// }

// function updateInventory() { saar
//   // loops over each inventory item and renders to user if needed;
//   for (const item in materialObj) {
//     if (materialObj[item].stock > 0) {
//       let index = materialObj[item].id - 1;
//       inventoryShowCase[index].classList = materialObj[item].className;
//       inventoryShowCase[index].firstChild.textContent = materialObj[item].stock;
//     }
//   }
// }

// function updateInventory(e) { omer
//     if (materialObj[e.target.className].stock === 1) {
//         for (li of inventoryShowCase) {
//             if (li.classList.length === 0) {
//                 li.classList = e.target.className;
//                 li.firstChild.textContent = materialObj[e.target.className].stock;
//                 return;
//               }
//             }
//           } else {
//               li.firstChild.textContent = materialObj[e.target.className].stock;
//             }
//           }
