import React from 'react'
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react'
import Credentials, { computeToken } from '../ledger/Credentials';
import Ledger from '../ledger/Ledger';
import { Game, GameState } from '../daml/Game';

type LoginProps = {
  onLogin: (ledger: Ledger) => void;
}

const Login: React.FC<LoginProps> = ({onLogin}) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async (event?: React.FormEvent) => {
    try {
      if (event) {
        event.preventDefault();
      }
      if (password !== computeToken(username)) {
        alert('Wrong password.');
        return;
      }
      let credentials: Credentials = {party: username, token: password};
      const ledger = new Ledger(credentials);
      const game = await ledger.pseudoLookupByKey(Game, {player: username});
      if (game === undefined) {
        alert("You have not yet signed up.");
        return;
      }
      onLogin(ledger);
    } catch(error) {
      alert("Unknown error:\n" + error);
    }
  }

  const handleSignup = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      let credentials: Credentials = {party: username, token: password};
      const ledger = new Ledger(credentials);
      const game: Game = {player : username, state : new GameState()};
      await ledger.create(Game, game);
      await handleLogin();
    } catch(error) {
      if (error instanceof Ledger.Error) {
        const {errors} = error;
        if (errors.length === 1 && errors[0].includes("DuplicateKey")) {
          alert("You are already signed up.");
          return;
        }
      }
      alert("Unknown error:\n" + error);
    }
  }

  const handleCalculatePassword = (event: React.FormEvent) => {
    event.preventDefault();
    const password = computeToken(username);
    setPassword(password);
  }

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h1' textAlign='center' size='huge' style={{color: '#223668'}}>
          <Header.Content>
            <Image
              as='a'
              href='https://www.daml.com/'
              target='_blank'
              src='/daml.svg'
              alt='DAML Logo'
              spaced
              size='small'
              verticalAlign='middle'
            />
            Tic-tac-toe
          </Header.Content>
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='user'
              iconPosition='left'
              placeholder='Username'
              value={username}
              onChange={e => setUsername(e.currentTarget.value)}
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              action={{
                icon: 'calculator',
                onClick: handleCalculatePassword,
              }}
              value={password}
              onChange={e => setPassword(e.currentTarget.value)}
            />
            <Button.Group fluid size='large'>
              <Button
                primary
                onClick={handleLogin}
              >
                Log in
              </Button>
              <Button
                secondary
                onClick={handleSignup}
              >
                Sign up
              </Button>
            </Button.Group>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
