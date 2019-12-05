import React from 'react';
import Login from './Login';
import Main from './Main';
import Ledger from '../ledger/Ledger';

////////////////////////////////////////////////////////////////////////////////
// App (entry point)

const App: React.FC = () => {
  type OptLedger = Ledger | undefined
  type State =
    [  OptLedger
     , React.Dispatch<React.SetStateAction<OptLedger>>
    ];
  const [ledger, setLedger] : State = React.useState<OptLedger>(undefined);

  if (ledger === undefined) {
    return (
      <Login
        onLogin={(ledger) => setLedger(ledger)}
      />
    );
  } else {
    return (
      <Main
        ledger={ledger}
        onLogout={() => setLedger(undefined)}
      />
    );
  }
}

export default App;
