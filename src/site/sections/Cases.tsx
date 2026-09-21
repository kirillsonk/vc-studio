"use client";
import React from "react";
import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";
import { DeployRun } from "../game/DeployRun";
export function Cases() {
  return (
    <section id="cases" className="editorial-section showcase-section">
      <Container>
        <div className="section-kicker">
          <span>01 / В деле</span>
          <span>Собственный эксперимент студии</span>
        </div>
        <div className="section-heading">
          <h2>
            Хороший digital
            <br />
            чувствуется в деле
          </h2>
          <p>
            Поэтому здесь можно поиграть. Собрали короткую браузерную механику —
            такую можно встроить в кампанию, запуск продукта или спецпроект
          </p>
        </div>
        <Playground />
        <div className="project-caption">
          <div>
            <h3>Deploy Run</h3>
            <p>Браузерная игра · Демо-проект · 2026</p>
          </div>
          <Link href="/case" className="text-link">
            Как это устроено <Arrow diagonal />
          </Link>
        </div>
      </Container>
    </section>
  );
}

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
            <span>VC / Playground</span>
            <span>Одна кнопка. Тридцать секунд.</span>
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
