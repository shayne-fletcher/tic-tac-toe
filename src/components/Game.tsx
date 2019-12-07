import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

import { Game, GameState, OptString } from '../daml/Game';
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
    value : OptString
  , onClick : () => Promise<boolean>
}
type CellFC = React.FC<CellProps>;

const Cell : CellFC = ({value, onClick}) => {
  const [hover, setHover] = React.useState<boolean>(false);

  let style = {
    normal:{
    },
    hover: {
      background: 'red'
    }
  };

  return (
      <button
         className = "cell"
         onClick ={onClick}
         onMouseEnter={()=>{ setHover(true);}}
         onMouseLeave={()=>{ setHover(false);}}
         style={{
           ...style.normal,
           ...(hover ? style.hover : null)}}
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
  return (
       <div>
         <div className="status">{status}</div>
         <button
            disabled={cells.every ((cell) => !cell)}
            onClick={onReset}
        >Start over</button>
      </div>
  );
}

////////////////////////////////////////////////////////////////////////////////
// Board

type BoardProps = {
  cells : OptString[];
  onClick : (i : number) => Promise<boolean>;
}
type BoardFC = React.FC<BoardProps>;

const Board : BoardFC = ({cells, onClick}) => {
  let row = function (n : number) {
    let cell = function (i : number) {
      return (<Cell value = {cells[i]} onClick={()=>{return onClick(i);}} />)
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
  const status : string =
    function (p : OptString, x : boolean) : string {
      return p ? "'" + p + "' wins the game!" : "Next player : " + (x ? 'X' : 'O');
    }(winningPlayer, xPlaysNext);

  return (
    <Container>
      <Grid centered columns={1}>
        <Grid.Row>
          <Grid.Column>
            <div className="game">
              <div className="game-board">
                <Board
                   cells={board}
                   onClick={onClick}
                />
              </div>
              <div className="game-info">
                <GameInfo
                   status={status}
                   cells={board}
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
