import { Party, TemplateId, Choice } from "../ledger/Types";

// Choice 'Reset'
class Reset {
  // Class variables
  static template : typeof Game =
    undefined as unknown as typeof Game;
  static choiceName : string= "Reset";

  // Class functions
  static fromJSON (json : unknown) : Reset { return json as Reset; }
  static toJSON (reset : Reset): unknown           { return reset; }
}

// Choice 'Move'
class Move {
  // Class variables
  static template : typeof Game =
    undefined as unknown as typeof Game;
  static choiceName : string = "Move";

  // Instance variables
  cell : number = 0;

  // Class functions
  static fromJSON (json : unknown) : Move { return json as Move; }
  static toJSON (move : Move): unknown            { return move; }
}

export class Solution {
  tag : string="";
  solution : number[] = new Array(3).fill(null); // 3 cell indicies
}

export type OptString = (string | null);
export type OptSolution = (Solution| null)
export class GameState {
  xPlaysNext : boolean = true;
  board : OptString[] = new Array(9).fill(null);
  winningPlayer : OptSolution = null;
}

// Template 'Game'
export class Game {
  // Instance members
  player: Party = '';
  state : GameState = new GameState();

  // Class members
  static templateId: TemplateId = {moduleName: "Game", entityName: "Game"};
  static Move : Choice<Game, Move> = Move;
  static Reset : Choice<Game, Reset> = Reset;

  // Class functions
  static fromJSON(json: unknown): Game            { return json as Game; }
  static toJSON(game: Game): unknown                      { return game; }
}

Move.template = Game;
Reset.template = Game;
