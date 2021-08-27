import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    const sqStyle = props.highlight ? {backgroundColor: 'lightGreen'} : {};
    return (
        <button className = "square" onClick = {props.onClick} style = {sqStyle}>
          {props.value}
        </button>
    );
}
  
class Board extends React.Component {

    renderSquare(i,loc,isWinSq) {
        return (
            <Square 
                key = {i}
                value={this.props.squares[i]}
                onClick = {()=> this.props.onClick(i,loc)}
                highlight = {isWinSq}    
            />
        );
    }

    searchNum(numb,k){
        for(let i in numb){        
            if(numb[i] === k)
                return true
        }
        return false
    }

    render() {   
        let rows = [];
        let board = [];
        let k = 0;

        let isWin = this.props.winnerSq != null

        for(let i = 1; i <= 3; i++){                     
            for(let j = 1; j <= 3; j++){
                let isWinSq = false
                if(isWin){
                    isWinSq = this.searchNum(this.props.winnerSq,k);
                }                  

                rows.push(this.renderSquare(k,{col:i,row:j},isWinSq));
                k++;

            }
            board.push(
                <div className="board-row" key={i}>
                    {rows}
                </div>
            );  
            rows = [];                               
        }
        return (
            <div>
                {board}                
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                loc: [{
                    col:null,
                    row:null
                }]
            }],
            xIsNext: true,
            stepNumber: 0,
            isAscending: true
        };
    }

    handleClick(i,loc){
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const currentSq = history[history.length-1];
        const sq = currentSq.squares.slice();

        if (calculateWinner(sq) || sq[i]) {
            return;    
        }

        sq[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares:sq,
                loc: currentSq.loc.concat(loc)
            }]),            
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    jumpTo(step){
        this.setState({
            history: this.state.history.slice(0,step+1),
            stepNumber: step,
            xIsNext: step%2 === 0,            
        });
    }

    handleSort(){
        this.setState({
            isAscending: !this.state.isAscending
        });
    }

    render() {
        const history = this.state.history;
        const currentSq = history[this.state.stepNumber];    
        let winner = calculateWinner(currentSq.squares);
        
        const winSq = winner;

        winner = winner != null ? winner[0] : null;
        winner = currentSq.squares[winner];

        const isDraw = (this.state.stepNumber === 9) && (winner == null) 

        const hist = this.state.isAscending ?
                        history: 
                        history.slice().reverse();

        const moves = hist.map((step,move,index) => {                                                        
            if(!this.state.isAscending)
                move = index.length - move - 1;
            const moveLoc = step.loc[move];

            let desc = move ?
                'Go to move #' + move + ' with location ('+moveLoc.col+','+moveLoc.row+')':
                'Go to game start';

            const moveStyle = move === this.state.stepNumber ?                
                {
                    fontWeight: 'bold'
                }:
                {};

            return(
                <li key={move}>                    
                    <button onClick={()=> this.jumpTo(move)} style={moveStyle}>
                        {desc}
                    </button>                        
                </li>
            );
        });

        let status;
        if(winner){
            status = 'Winner: '+winner;
        } else if(isDraw){
            status = 'Game is draw';
        } else{
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                <Board 
                    squares = {currentSq.squares}                    
                    onClick = {(i,loc) => this.handleClick(i,loc)}
                    winnerSq = {winSq}
                />
                <div className='sort-move'>
                    <button onClick={()=> this.handleSort()}>Sort moves</button>
                </div>
                </div>
                <div className="game-info">
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
            return lines[i];
        }
    }

    return null;
}

