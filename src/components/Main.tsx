import React from 'react'
import { Image, Menu } from 'semantic-ui-react'
import Ledger from '../ledger/Ledger';
import GameController from './Game';

////////////////////////////////////////////////////////////////////////////////
// Main

type MainProps = {
  ledger: Ledger;
  onLogout: () => void;
}
type MainFC = React.FC<MainProps>

const Main : MainFC = ({ledger, onLogout}) => {
  return (
    <>
      <Menu icon borderless >
        <Menu.Item>
          <Image
            as='a'
            href='https://www.daml.com/'
            target='_blank'
            src='/daml.svg'
            alt='DAML Logo'
            size='tiny'
          />
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item position='right'>
            You are logged in as {ledger.party()}.
          </Menu.Item>
          <Menu.Item
            position='right'
            active={false}
            onClick={onLogout}
            icon='log out'
          />
        </Menu.Menu>
      </Menu>

      <GameController ledger={ledger}/>
    </>
  );
};

export default Main;
