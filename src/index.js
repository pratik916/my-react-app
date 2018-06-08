import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

function ResetButton(props) {
  return (
    <button onClick={props.onClick}>
      Reset
    </button>
  )
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history:[{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      isFinished: false,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[this.state.stepNumber] ? history[this.state.stepNumber] : history[history.length-1];
    const squares = current.squares.slice();
    const winStatus = calculateWinner(squares);
    if(winStatus || squares[i])
    {
      if(winStatus !== false)
      {
        this.setState({
          squares: squares,
          stepNumber: history.length,
          xIsNext: this.state.xIsNext,
          isFinished: true,
        })
      }
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      isFinished: false,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  resetGame() {
    const anyEmpty = this.state.squares.some((item) => item === null);

    if(calculateWinner(this.state.squares) || calculateWinner(this.state.squares) === false)
    {
      this.setState({
        squares: Array(9).fill(null),
        xIsNext: true,
      })
    }

    if(anyEmpty)
    {
      return;
    }
  }

  renderResetButton() {
    return (
      <ResetButton
        onClick={() => this.resetGame()}
      />
    )
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber] ? history[this.state.stepNumber] : history[history.length-1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';

        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          {/*<div className="status">{this.renderResetButton()}</div>*/}
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  let isEmptyExists = false;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  isEmptyExists = squares.some(item => item === null);

  if(!isEmptyExists)
  {
    return false;
  }
  return null;
}
