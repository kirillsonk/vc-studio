"use client";
import React from "react";
import { DeployRun } from "./DeployRun";

/** Deploy Run poster and launcher, used on the /case page */
export function Playground() {
  const [playing, setPlaying] = React.useState(false);
  return (
    <div className={`game-stage ${playing ? "is-playing" : ""}`}>
      {playing ? (
        <>
          <DeployRun />
          <button
            className="game-close"
            onClick={() => setPlaying(false)}
            aria-label="Закрыть игру"
          >
            Закрыть <span aria-hidden="true">×</span>
          </button>
        </>
      ) : (
        <>
          <div className="game-poster" aria-hidden="true">
            <span className="poster-cross cross-one">+</span>
            <span className="poster-cross cross-two">+</span>
            <div className="poster-orbit orbit-one" />
            <div className="poster-orbit orbit-two" />
            <div className="poster-orbit orbit-three" />
            <div className="poster-beam" />
            <div className="poster-type">
              deploy<span>run_</span>
            </div>
            <div className="poster-target">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="game-poster-top">
            <span>Сборка / Playground</span>
            <span>Одна кнопка. Тридцать секунд</span>
          </div>
          <button
            className="action action-light game-launch"
            onClick={() => setPlaying(true)}
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="m8 5 11 7-11 7z" />
            </svg>
            Запустить игру
          </button>
        </>
      )}
    </div>
  );
}

