const grid = document.querySelector('.grid');
const scoreDisplay = document.getElementById('score');
const width = 8;
const squares = [];
const candyColors = [
  'url(images/red-candy.png)',
  'url(images/yellow-candy.png)',
  'url(images/orange-candy.png)',
  'url(images/purple-candy.png)',
  'url(images/green-candy.png)',
  'url(images/blue-candy.png)',
];
let colorBeingDragged;
let colorBeingReplaced;
let squareIdBeingDragged;
let squareIdBeingReplaced;
let score = 0;

function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    let randomColor = Math.floor(Math.random() * candyColors.length);
    square.style.backgroundImage = candyColors[randomColor];
    square.setAttribute('draggable', true);
    square.setAttribute('id', i);
    grid.appendChild(square);
    squares.push(square);
  }

  squares.forEach((square) => {
    square.addEventListener('dragstart', dragStart);
    square.addEventListener('dragend', dragEnd);
    square.addEventListener('dragover', dragOver);
    square.addEventListener('dragleave', dragLeave);
    square.addEventListener('drop', dragDrop);
  });
}

createBoard();

function dragStart() {
  colorBeingDragged = this.style.backgroundImage;
  squareIdBeingDragged = parseInt(this.id);
}

function dragEnd() {
  let validMoves = [
    squareIdBeingDragged - 1,
    squareIdBeingDragged - width,
    squareIdBeingDragged + 1,
    squareIdBeingDragged + width,
  ];

  let validMove = validMoves.includes(squareIdBeingReplaced);

  if (squareIdBeingReplaced && validMove) {
    squareIdBeingReplaced = null;
  } else if (squareIdBeingReplaced && !validMove) {
    squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
  } else {
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
  }
}

function dragOver(event) {
  event.preventDefault();
}

function dragLeave(event) {
  event.preventDefault();
}

function dragDrop() {
  colorBeingReplaced = this.style.backgroundImage;
  squareIdBeingReplaced = parseInt(this.id);

  this.style.backgroundImage = colorBeingDragged;
  squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
}

function checkRowForThree() {
  for (i = 0; i < 63 - 2; i++) {
    let rowOfThree = [i, i + 1, i + 2];
    let decidedColor = squares[i].style.backgroundImage;
    const isBlank = squares[i].style.backgroundImage === '';
    const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];

    if (notValid.includes(i)) continue;

    if (
      rowOfThree.every(
        (index) =>
          squares[index].style.backgroundImage === decidedColor && !isBlank
      )
    ) {
      score += 3;
      scoreDisplay.innerHTML = score;
      rowOfThree.forEach((index) => {
        squares[index].style.backgroundImage = '';
      });
    }
  }
}

function checkColumnForThree() {
  for (i = 0; i < 47; i++) {
    let columnOfThree = [i, i + width, i + width * 2];
    let decidedColor = squares[i].style.backgroundImage;
    const isBlank = squares[i].style.backgroundImage === '';

    if (
      columnOfThree.every(
        (index) =>
          squares[index].style.backgroundImage === decidedColor && !isBlank
      )
    ) {
      score += 3;
      scoreDisplay.innerHTML = score;
      columnOfThree.forEach((index) => {
        squares[index].style.backgroundImage = '';
      });
    }
  }
}

checkRowForThree();
checkColumnForThree();

window.setInterval(() => {
  moveDown();
  checkRowForThree();
  checkColumnForThree();
}, 1000);

function moveDown() {
  for (let i = 0; i < 55; i++) {
    if (squares[i + width].style.backgroundImage === '') {
      squares[i + width].style.backgroundImage =
        squares[i].style.backgroundImage;
      squares[i].style.backgroundImage = '';
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && squares[i].style.backgroundImage === '') {
        const randomColor = Math.floor(Math.random() * candyColors.length);
        squares[i].style.backgroundImage = candyColors[randomColor];
      }
    }
  }
}
