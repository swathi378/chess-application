const game = new Chess();
let board = null;

// Load stockfish engine
const stockfish = new Worker('stockfish.js');

function makeAIMove() {
  stockfish.postMessage('position fen ' + game.fen());
  stockfish.postMessage('go depth 10'); // you can adjust depth (higher = stronger)
}

stockfish.onmessage = function (event) {
  if (event.data.startsWith('bestmove')) {
    const move = event.data.split(' ')[1];
    game.move({ from: move.slice(0, 2), to: move.slice(2, 4), promotion: 'q' });
    board.position(game.fen());
  }
};

function onDragStart(source, piece, position, orientation) {
  if (game.game_over() || piece.search(/^b/) !== -1) return false; // prevent move if game over or black's turn
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  window.setTimeout(makeAIMove, 250); // slight delay for realism
}

board = Chessboard('board', {
  draggable: true,
  position: 'start',
  onDragStart,
  onDrop,
  onSnapEnd: () => board.position(game.fen())
});
