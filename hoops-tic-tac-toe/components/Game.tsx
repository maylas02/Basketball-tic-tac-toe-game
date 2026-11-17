"use client";

import { useReducer, useRef, type KeyboardEvent } from "react";
import { BallMark, HoopMark } from "./Marks";
import {
  PLAYERS,
  createInitialState,
  gameReducer,
  type Cell,
  type Player,
} from "@/lib/game";

/* Shared class strings (kept as full literals so Tailwind can detect them) */
const focusRing =
  "focus-visible:outline-4 focus-visible:outline-offset-[3px] focus-visible:outline-gold";

const scoreCard =
  "flex flex-col items-center gap-1 rounded-[10px] bg-panel px-1 py-2.5 text-center";
const scoreLabel =
  "flex flex-col items-center gap-1 text-[0.78rem] font-semibold leading-tight";
const scoreValue =
  "font-display text-[clamp(2rem,9vw,2.75rem)] leading-none text-gold tabular-nums";

const cellClass =
  "relative flex aspect-square min-w-0 cursor-pointer items-center justify-center " +
  "rounded-xl bg-cream text-hoop transition duration-100 " +
  "[-webkit-tap-highlight-color:transparent] " +
  "aria-disabled:cursor-default " +
  "aria-[disabled=false]:hover:-translate-y-0.5 aria-[disabled=false]:hover:bg-cream-hover " +
  "data-[winning]:animate-win-pulse data-[winning]:bg-gold " +
  "focus-visible:z-10 " +
  focusRing;

function Mark({ player, className }: { player: Player; className?: string }) {
  return player === "ball" ? (
    <BallMark className={className} />
  ) : (
    <HoopMark className={className} />
  );
}

function cellLabel(index: number, value: Cell): string {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const content = value
    ? `${PLAYERS[value].mark}, played by ${PLAYERS[value].name}`
    : "empty";
  return `Row ${row}, column ${col}, ${content}`;
}

export default function Game() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialState
  );
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { board, current, starter, status, winner, line, scores } = state;
  const isOver = status !== "playing";
  const winningCells = new Set(line);

  let statusText: string;
  if (status === "won" && winner) {
    statusText = `${PLAYERS[winner].name} (${PLAYERS[winner].mark}) wins the game!`;
  } else if (status === "draw") {
    statusText = "It's a draw! Nobody scores this round.";
  } else {
    statusText = `${PLAYERS[current].name}'s turn: place the ${PLAYERS[current].mark}`;
  }

  function handleCellKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    let next = index;

    if (event.key === "ArrowLeft" && col > 0) next = index - 1;
    else if (event.key === "ArrowRight" && col < 2) next = index + 1;
    else if (event.key === "ArrowUp" && row > 0) next = index - 3;
    else if (event.key === "ArrowDown" && row < 2) next = index + 3;
    else if (!event.key.startsWith("Arrow")) return;

    event.preventDefault();
    cellRefs.current[next]?.focus();
  }

  return (
    <main
      className={
        "relative isolate flex min-h-dvh items-start justify-center overflow-hidden " +
        "bg-hardwood px-4 pb-12 pt-[clamp(16px,4vw,40px)] " +
        "shadow-[inset_0_0_0_10px_rgba(255,255,255,0.75)] " +
        /* half-court line */
        "before:absolute before:inset-x-0 before:top-1/2 before:-z-10 before:h-1.5 " +
        "before:-translate-y-1/2 before:bg-white/70 " +
        /* center-court circle */
        "after:absolute after:left-1/2 after:top-1/2 after:-z-10 after:aspect-square " +
        "after:w-[min(92vw,600px)] after:-translate-x-1/2 after:-translate-y-1/2 " +
        "after:rounded-full after:border-[6px] after:border-white/70"
      }
    >
      <div className="flex w-full max-w-[480px] flex-col gap-4">
        {/* Header */}
        <header className="rounded-2xl border-b-[6px] border-buzzer bg-navy px-4 pb-3 pt-3.5 text-center text-white shadow-lg shadow-black/25">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">
            Local two-player game
          </p>
          <h1 className="mt-1 font-display text-[clamp(1.9rem,8vw,2.6rem)] uppercase leading-tight tracking-wide">
            Hoops Tic-Tac-Toe
          </h1>
        </header>

        {/* Scoreboard */}
        <section
          className="rounded-2xl border-[3px] border-gold bg-ink p-3 pb-3.5 text-white shadow-lg shadow-black/25"
          aria-labelledby="scoreboard-heading"
        >
          <h2
            id="scoreboard-heading"
            className="mb-2.5 text-center text-[0.8rem] uppercase tracking-[0.2em] text-gold"
          >
            Scoreboard
          </h2>
          <dl className="grid grid-cols-3 gap-2">
            <div className={scoreCard}>
              <dt className={scoreLabel}>
                <Mark player="ball" className="size-7 text-white" />
                <span>Player 1 wins</span>
              </dt>
              <dd className={scoreValue}>{scores.ball}</dd>
            </div>
            <div className={scoreCard}>
              <dt className={scoreLabel}>
                <span
                  className="inline-flex size-7 items-center justify-center text-2xl font-extrabold leading-none"
                  aria-hidden="true"
                >
                  =
                </span>
                <span>Draws</span>
              </dt>
              <dd className={scoreValue}>{scores.draws}</dd>
            </div>
            <div className={scoreCard}>
              <dt className={scoreLabel}>
                <Mark player="hoop" className="size-7 text-white" />
                <span>Player 2 wins</span>
              </dt>
              <dd className={scoreValue}>{scores.hoop}</dd>
            </div>
          </dl>
        </section>

        {/* Status banner (announced to screen readers) */}
        <div
          role="status"
          className={
            "rounded-xl border-[3px] border-navy px-4 py-3 text-center text-[1.05rem] font-bold text-navy " +
            (isOver ? "animate-banner-pop bg-gold" : "bg-cream")
          }
        >
          {statusText}
        </div>

        {/* Board */}
        <div className="rounded-[20px] bg-navy p-3 shadow-xl shadow-black/30">
          <div
            className="grid grid-cols-3 gap-2.5"
            role="group"
            aria-label="Tic-tac-toe board, 3 by 3"
          >
            {board.map((value, index) => {
              const unavailable = isOver || value !== null;
              return (
                <button
                  key={index}
                  type="button"
                  ref={(el) => {
                    cellRefs.current[index] = el;
                  }}
                  className={cellClass}
                  aria-label={cellLabel(index, value)}
                  aria-disabled={unavailable}
                  data-winning={winningCells.has(index) || undefined}
                  onClick={() => dispatch({ type: "move", index })}
                  onKeyDown={(event) => handleCellKeyDown(event, index)}
                >
                  {value && (
                    <Mark
                      player={value}
                      className="block size-[70%] animate-pop"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="grid gap-2.5">
          <button
            type="button"
            className={
              "min-h-[60px] cursor-pointer rounded-[14px] bg-buzzer px-5 py-3.5 " +
              "font-display text-2xl uppercase tracking-[0.08em] text-white " +
              "shadow-[0_6px_0_#7f0d14] transition duration-100 " +
              "hover:-translate-y-px active:translate-y-[5px] active:shadow-[0_1px_0_#7f0d14] " +
              focusRing +
              (isOver ? " animate-attention" : "")
            }
            onClick={() => dispatch({ type: "newGame" })}
          >
            New Game
          </button>
          <button
            type="button"
            className={
              "min-h-12 cursor-pointer rounded-xl border-[3px] border-navy bg-cream " +
              "px-4 py-2.5 text-base font-bold text-navy hover:bg-cream-hover " +
              focusRing
            }
            onClick={() => dispatch({ type: "resetScores" })}
          >
            Reset Scores
          </button>
        </div>

        <p className="rounded-xl bg-cream/95 px-3.5 py-2.5 text-center text-[0.9rem] leading-snug text-navy">
          Tip-off this round: {PLAYERS[starter].name} ({PLAYERS[starter].mark}).
          Use the arrow keys to move between squares, and Enter or Space to
          place your mark.
        </p>
      </div>
    </main>
  );
}
