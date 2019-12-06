import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

import { Game, GameState } from '../daml/Game';
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
    value : (string | null)
  , onClick : () => Promise<boolean>
}
type CellFC = React.FC<CellProps>;

const Cell : CellFC = ({value, onClick}) => {
    return (
        <button className = "cell" onClick ={onClick}>
      {value}
    </button>
    );
}

////////////////////////////////////////////////////////////////////////////////
// Board

type BoardProps = {
  cells : (string | null )[];
  onClick : (i : number) => Promise<boolean>;
}
type BoardFC = React.FC<BoardProps>;

const Board : BoardFC = ({cells, onClick}) => {
    return (
      <div>
        <div className="board-row">
        <Cell value = {cells[0]} onClick={() => { return onClick(0); } } />
        <Cell value = {cells[1]} onClick={() => { return onClick(1); } } />
        <Cell value = {cells[2]} onClick={() => { return onClick(2); } } />
        </div>
        <div className="board-row">
        <Cell value = {cells[3]} onClick={() => { return onClick(3); } } />
        <Cell value = {cells[4]} onClick={() => { return onClick(4); } } />
        <Cell value = {cells[5]} onClick={() => { return onClick(5); } } />
        </div>
        <div className="board-row">
        <Cell value = {cells[6]} onClick={() => { return onClick(6); } } />
        <Cell value = {cells[7]} onClick={() => { return onClick(7); } } />
        <Cell value = {cells[8]} onClick={() => { return onClick(8); } } />
        </div>
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

  let status : string;
  if (winningPlayer) { //!= null) {
      status = "'" + winningPlayer + "' wins the game! すごい!";
    }
    else {
      status = 'Next player : ' + (xPlaysNext ? 'X' : 'O');
    }

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
                <button
                   disabled={board.every ((cell) => !cell)}
                   onClick={onReset}
                >Start over</button>
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
           <Grid.Column>
            <div>{status}</div>
           </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default GameController;
