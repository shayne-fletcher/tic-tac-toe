import React from 'react';
import Login from './Login';
import Main from './Main';
import Ledger from '../ledger/Ledger';

const App: React.FC = () => {
  const [ledger, setLedger] = React.useState<Ledger | undefined>(undefined);

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
