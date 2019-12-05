import React from 'react';
import { Container, Grid, Header, Icon, Segment, Divider } from 'semantic-ui-react';
import { User } from '../daml/User';
import { Party } from '../ledger/Types';

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

/**
 * React component for the view of the `MainScreen`.
 */
export type Props = {
  myUser: User;
  onClick : (i : number) => Promise<boolean>;
  onReset : () => Promise<boolean>
}

const MainView: React.FC<Props> = (props) => {
  const onClick = props.onClick;
  const onReset = props.onReset;
  const {player, state} = props.myUser;
  const {xPlaysNext, board, winningPlayer} = state;

  let status : string;
  if (winningPlayer != null) {
      status = winningPlayer + ' wins the game!';
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

export default MainView;
