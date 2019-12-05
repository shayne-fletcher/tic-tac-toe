import React from 'react';
import MainView from './MainView';
import Ledger from '../ledger/Ledger';
import { Party } from '../ledger/Types';
import { Game } from '../daml/Game';

type Props = {
  ledger: Ledger;
}

/**
 * React component to control the `MainView`.
 */
const MainController: React.FC<Props> = ({ledger}) => {
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
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  // Run every second
  React.useEffect(() => {
    const interval = setInterval(loadMyGame, 1000);
    return () => clearInterval(interval);
  }, [loadMyGame]);

  const props = {
    myGame,
    onClick : handleClick,
    onReset : handleReset,
  };

  return MainView(props);
}

export default MainController;
