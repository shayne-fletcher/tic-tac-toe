import { Party, TemplateId } from "../ledger/Types";

class Delete {
  static template = undefined as unknown as typeof User;

  static choiceName = 'Delete';

  static toJSON(delete_: Delete): unknown {
    return delete_;
  }
}

class Reset {
  static template = undefined as unknown as typeof User;
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

  static template = undefined as unknown as typeof User;
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

export class User {
  player: Party = '';
  state: State = new State();

  static templateId: TemplateId = {moduleName: "User", entityName: "User"};

  static fromJSON(json: unknown): User {
    return json as User;
  }

  static toJSON(user: User): unknown {
    return user;
  }

  static Delete = Delete;
  static Move = Move;
  static Reset = Reset;
}

Move.template = User;
Reset.template = User;
Delete.template = User;
