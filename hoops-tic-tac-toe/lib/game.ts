export type Player = "ball" | "hoop";
export type Cell = Player | null;
export type Status = "playing" | "won" | "draw";

export interface Scores {
  ball: number;
  hoop: number;
  draws: number;
}

export interface GameState {
  board: Cell[];
  current: Player;
  starter: Player;
  status: Status;
  winner: Player | null;
  line: readonly number[];
  scores: Scores;
}

export type GameAction =
  | { type: "move"; index: number }
  | { type: "newGame" }
  | { type: "resetScores" };

export const PLAYERS: Record<Player, { name: string; mark: string }> = {
  ball: { name: "Player 1", mark: "Ball" },
  hoop: { name: "Player 2", mark: "Hoop" },
};

export const WIN_LINES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function otherPlayer(player: Player): Player {
  return player === "ball" ? "hoop" : "ball";
}

export function findWinner(
  board: readonly Cell[]
): { winner: Player; line: readonly number[] } | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const mark = board[a];
    if (mark !== null && mark === board[b] && mark === board[c]) {
      return { winner: mark, line };
    }
  }
  return null;
}

function emptyBoard(): Cell[] {
  return Array<Cell>(9).fill(null);
}

export function createInitialState(): GameState {
  return {
    board: emptyBoard(),
    current: "ball",
    starter: "ball",
    status: "playing",
    winner: null,
    line: [],
    scores: { ball: 0, hoop: 0, draws: 0 },
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "move": {
      const { index } = action;

      // Ignore moves after the round ends, outside the board, or on taken cells.
      if (
        state.status !== "playing" ||
        index < 0 ||
        index > 8 ||
        state.board[index] !== null
      ) {
        return state;
      }

      const board = state.board.slice();
      board[index] = state.current;

      const result = findWinner(board);
      if (result) {
        return {
          ...state,
          board,
          status: "won",
          winner: result.winner,
          line: result.line,
          scores: {
            ...state.scores,
            [result.winner]: state.scores[result.winner] + 1,
          },
        };
      }

      if (board.every((cell) => cell !== null)) {
        return {
          ...state,
          board,
          status: "draw",
          scores: { ...state.scores, draws: state.scores.draws + 1 },
        };
      }

      return { ...state, board, current: otherPlayer(state.current) };
    }

    case "newGame": {
      // If the last round finished, the other player tips off next.
      // If New Game is pressed mid-round, the same player keeps the tip-off.
      const nextStarter =
        state.status === "playing" ? state.starter : otherPlayer(state.starter);
      return {
        ...state,
        board: emptyBoard(),
        current: nextStarter,
        starter: nextStarter,
        status: "playing",
        winner: null,
        line: [],
      };
    }

    case "resetScores":
      return { ...state, scores: { ball: 0, hoop: 0, draws: 0 } };

    default:
      return state;
  }
}
