import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

import { Game, GameState, OptString, OptSolution } from '../daml/Game';
import Ledger from '../ledger/Ledger';

////////////////////////////////////////////////////////////////////////////////
// GameController

type GameControllerProps = {
  ledger: Ledger;
}
type GameControllerFC = React.FC<GameControllerProps>;

const GameController : GameControllerFC = ({ledger}) => {
  type State =
    [ Game
    , React.Dispatch<React.SetStateAction<Game>>
    ];
  const [game, setGame] : State = React.useState<Game>(new Game());

  // Refresh state.
  const loadGame : () => Promise<void> = React.useCallback(async () => {
    try {
      setGame((await ledger.pseudoFetchByKey(Game, {player: ledger.party()})).data);
    } catch (error) {
      alert("Unknown error:\n" + error);
    }
  }, [ledger]);

  // Poll for state updates.
  React.useEffect(() => {
    const interval = setInterval(loadGame, 1000);
    return () => clearInterval(interval);
  }, [loadGame]);


  // Handle a click on cell 'i'.
  const onClick = async (i : number) : Promise<boolean> => {
    try {
      await ledger.pseudoExerciseByKey(Game.Move, {player: ledger.party()}, {cell:i});
      await Promise.all([loadGame()]);
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  // Handle a click on the "start over" button.
  const onReset = async () : Promise<boolean> => {
    try {
      await ledger.pseudoExerciseByKey(Game.Reset, {player: ledger.party()}, {});
      await Promise.all([loadGame()]);
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  return GameView({game, onClick, onReset});
}

////////////////////////////////////////////////////////////////////////////////
// Cell

type CellProps = {
    index : number
  , active : boolean
  , value : OptString
  , onClick : () => Promise<boolean>
  , winningPlayer : OptSolution
}
type CellFC = React.FC<CellProps>;

const Cell : CellFC = ({index, active, value, onClick, winningPlayer}) => {
  const [hover, setHover] = React.useState<boolean>(false);
  let onMouseEnter = ()=>{ setHover(true);};
  let onMouseLeave = ()=>{ setHover(false);};
  let style= {
    normal:{
    },
    hover: {
      background: 'red'
    },
    winning: {
      background: 'gray'
    }
  };

  let pickStyle = () => (
      active
        ? {
          ...style.normal,
          ...(hover ? style.hover : null)
        }
        : (winningPlayer && winningPlayer.solution.some((e, i, arr)=>e == index)
           ? {
             ...style.winning,
             ...(false ? style.hover : null)
           }
           : {
             ...style.normal,
             ...(false ? style.hover : null)
             })
    );

  return  (
    <button
       className = "cell"
       onClick ={onClick}
       onMouseEnter={onMouseEnter}
       onMouseLeave={onMouseLeave}
       style={ pickStyle() }
    >
      {value}
    </button>
  );
}

////////////////////////////////////////////////////////////////////////////////
// GameInfo

type GameInfoProps = {
  status : string;
  cells : OptString[];
  onReset : () => Promise<boolean>
}
type GameInfoFC = React.FC<GameInfoProps>;

const GameInfo : GameInfoFC = ({status, cells, onReset}) => {
  let disabled : boolean = cells.every ((cell) => !cell);
  return (
       <div>
         <div className="status">{status}</div>
         <button
            disabled={disabled}
            onClick={onReset}
        >Start over</button>
      </div>
  );
}

////////////////////////////////////////////////////////////////////////////////
// Board

type BoardProps = {
  active : boolean;
  cells : OptString[];
  onClick : (i : number) => Promise<boolean>;
  winningPlayer : OptSolution;
}
type BoardFC = React.FC<BoardProps>;

const Board : BoardFC = ({active, cells, onClick, winningPlayer}) => {
  let row = function (n : number) {
    let cell = function (i : number) {
      return (<Cell
                index={i}
                active={active}
                value = {cells[i]}
                onClick={()=>{return onClick(i);}}
                winningPlayer={winningPlayer}
              />)
    };
    return Array(3).fill(0).map((x, i) => cell (i + n * 3));
  };

  return (
    <div>
      <div className="board-row">{row (0)}</div>
      <div className="board-row">{row (1)}</div>
      <div className="board-row">{row (2)}</div>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////
// GameView

type GameViewProps = {
  game : Game;
  onClick : (i : number) => Promise<boolean>;
  onReset : () => Promise<boolean>
}
type GameViewFC = React.FC<GameViewProps>;

const GameView : GameViewFC = ({game, onClick, onReset}) => {
  const {xPlaysNext, board, winningPlayer} : GameState = game.state;
  const cells : OptString[] = board;
  const allCellsMarked : boolean = cells.every ((cell) => cell);
  const active : boolean = !winningPlayer && !allCellsMarked;
  const status : string =
    function (p : OptSolution, x : boolean) : string {
      return p ? p.tag + " wins the game!" :
        (allCellsMarked ? "It's a draw." : ("Next player : " + (x ? 'X' : 'O')));
    }(winningPlayer, xPlaysNext);

  return (
    <Container>
      <Grid centered columns={1}>
        <Grid.Row>
          <Grid.Column>
            <div className="game">
              <div className="game-board">
                 <Board
                   active={active}
                   cells={cells}
                   onClick={onClick}
                   winningPlayer={winningPlayer}
                />
              </div>
              <div className="game-info">
                <GameInfo
                   status={status}
                   cells={cells}
                   onReset={onReset}
                />
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default GameController;
