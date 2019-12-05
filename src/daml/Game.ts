import { Party, TemplateId } from "../ledger/Types";

class Reset {
  static template = undefined as unknown as typeof Game;
  static choiceName = 'Reset';

  static fromJSON (json : unknown) : unknown {
    return json as Reset;
  }

  static toJSON (reset : Reset): unknown {
    return reset;
  }
}

class Move {
  cell : number = 0;

  static template = undefined as unknown as typeof Game;
  static choiceName = 'Move';

  static fromJSON (json : unknown) : unknown {
    return json as Move;
  }

  static toJSON (move : Move): unknown {
    return move;
  }
}

export class State {
  xPlaysNext : boolean = true;
  board : (string | null)[] = [null, null, null,null, null, null,null, null, null]
  winningPlayer : (string | null) = null;
}

export class Game {
  player: Party = '';
  state: State = new State();

  static templateId: TemplateId = {moduleName: "Game", entityName: "Game"};

  static fromJSON(json: unknown): Game {
    return json as Game;
  }

  static toJSON(game: Game): unknown {
    return game;
  }

  static Move = Move;
  static Reset = Reset;
}

Move.template = Game;
Reset.template = Game;
