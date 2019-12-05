import React from 'react';
import MainView from './MainView';
import Ledger from '../ledger/Ledger';
import { Party } from '../ledger/Types';
import { User } from '../daml/User';

type Props = {
  ledger: Ledger;
}

/**
 * React component to control the `MainView`.
 */
const MainController: React.FC<Props> = ({ledger}) => {
  const [myUser, setMyUser] = React.useState<User>(new User());

  const loadMyUser = React.useCallback(async () => {
    try {
      const user = await ledger.pseudoFetchByKey(User, {player: ledger.party()});
      setMyUser(user.data);

    } catch (error) {
      alert("Unknown error:\n" + error);
    }
  }, [ledger]);

  const handleClick = async (i : number) : Promise<boolean> => {
    try {
      await ledger.pseudoExerciseByKey(User.Move, {player: ledger.party()}, {cell:i});
      await Promise.all([loadMyUser()]);
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  const handleReset = async () : Promise<boolean> => {
    try {
      await ledger.pseudoExerciseByKey(User.Reset, {player: ledger.party()}, {});
      return true;
    } catch (error) {
      alert("Unknown error:\n" + JSON.stringify(error));
      return false;
    }
  }

  // Run every second
  React.useEffect(() => {
    const interval = setInterval(loadMyUser, 1000);
    return () => clearInterval(interval);
  }, [loadMyUser]);

  const props = {
    myUser,
    onClick : handleClick,
    onReset : handleReset,
  };

  return MainView(props);
}

export default MainController;
