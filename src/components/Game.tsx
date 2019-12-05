import React from 'react';
import { Container, Grid } from 'semantic-ui-react';

import Ledger from '../ledger/Ledger';
import { Game } from '../daml/Game'; // The model.

////////////////////////////////////////////////////////////////////////////////
// GameController

type GameControllerProps = {
  ledger: Ledger;
}

const GameController: React.FC<GameControllerProps> = ({ledger}) => {
  const [myGame, setMyGame] = React.useState<Game>(new Game());

  const loadMyGame = React.useCallback(async () => {
    try {
      const game = await ledger.pseudoFetchByKey(Game, {player: ledger.party()});
      setMyGame(game.data);

    } catch (error) {
      alert("Unknown error:\n" + error);
    }
  }, [ledger]);

  const handleClick = async (i : number) : Promise<boolean> => {
    try {
      await ledger.pseudoExerciseByKey(Game.Move, {player: ledger.party()}, {cell:i});
      await Promise.all([loadMyGame()]);
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  const handleReset = async () : Promise<boolean> => {
    try {
      await ledger.pseudoExerciseByKey(Game.Reset, {player: ledger.party()}, {});
      await Promise.all([loadMyGame()]);
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  React.useEffect(() => {
    const interval = setInterval(loadMyGame, 1000);
    return () => clearInterval(interval);
  }, [loadMyGame]);

  const props : GameViewProps = {
    myGame,
    onClick : handleClick,
    onReset : handleReset,
  };

  return GameView(props);
}

////////////////////////////////////////////////////////////////////////////////
// GameView

export type SquareProps = {
    value : (string | null)
  , onClick : () => Promise<boolean>
}
const Square : React.FC<SquareProps> = ({value, onClick}) => {
    return (
        <button className = "square" onClick ={onClick}>
      {value}
    </button>
    );
}

export type BoardProps = {
  cells : (string | null )[];
  onClick : (i : number) => Promise<boolean>;
}
const Board : React.FC<BoardProps> = ({cells, onClick}) => {
    return (
      <div>
        <div className="board-row">
        <Square value = {cells[0]} onClick={() => { return onClick(0); } } />
        <Square value = {cells[1]} onClick={() => { return onClick(1); } } />
        <Square value = {cells[2]} onClick={() => { return onClick(2); } } />
        </div>
        <div className="board-row">
        <Square value = {cells[3]} onClick={() => { return onClick(3); } } />
        <Square value = {cells[4]} onClick={() => { return onClick(4); } } />
        <Square value = {cells[5]} onClick={() => { return onClick(5); } } />
        </div>
        <div className="board-row">
        <Square value = {cells[6]} onClick={() => { return onClick(6); } } />
        <Square value = {cells[7]} onClick={() => { return onClick(7); } } />
        <Square value = {cells[8]} onClick={() => { return onClick(8); } } />
        </div>
      </div>
    );
}

export type GameViewProps = {
  myGame: Game;
  onClick : (i : number) => Promise<boolean>;
  onReset : () => Promise<boolean>
}

const GameView: React.FC<GameViewProps> = (props) => {
  const onClick = props.onClick;
  const onReset = props.onReset;
  const state = props.myGame.state;
  const {xPlaysNext, board, winningPlayer} = state;

  let status : string;
  if (winningPlayer != null) {
      status = 'すごい! ' + winningPlayer + ' wins the game!';
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
                   disabled={board.every ((cell) => cell == null)}
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
