import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";
import { Playground } from "../game/Playground";
export function CasePage() {
  return (
    <main id="main" className="case-page">
      <Container>
        <Link href="/#cases" className="text-link">
          К проекту на главной <Arrow />
        </Link>
        <div className="case-intro">
          <div>
            <span className="eyebrow">Собственный демо-проект / 2026</span>
            <h1>Deploy Run</h1>
          </div>
          <p>
            Одна кнопка, тридцать секунд и еще одна попытка. Браузерная
            механика, которую мы собрали для этого сайта
          </p>
        </div>
        <Playground />
        <div className="case-facts">
          <div>
            <strong>30 секунд</strong>
            <span>на одну попытку</span>
          </div>
          <div>
            <strong>1 действие</strong>
            <span>чтобы начать играть</span>
          </div>
          <div>
            <strong>Без установки</strong>
            <span>на компьютере и телефоне</span>
          </div>
        </div>
        <div className="case-story">
          <h2>
            Механика, которую
            <br />
            легко понять
          </h2>
          <div>
            <p>
              Маркер движется по треку. Нужно нажать, пока он внутри окна
              деплоя. После попадания окно сужается, скорость растет, а серия
              приносит больше очков
            </p>
            <p>
              В рекламном проекте такой сценарий можно связать с продуктом,
              промокодами, аналитикой или серверным рейтингом. В этом демо
              рекорды хранятся только на вашем устройстве, а код в конце
              показывает механику выдачи награды
            </p>
          </div>
        </div>
        <div className="case-story">
          <h2>Что внутри</h2>
          <div>
            <p>
              Canvas отвечает за игровое поле, React управляет интерфейсом и состояниями.
              Управление работает мышью, касанием и клавиатурой. Игра не
              перехватывает клавиши за пределами своего поля
            </p>
            <p>
              Это демонстрация взаимодействия, а не клиентский кейс. Данные в
              примере production-отчета условные и показывают только структуру
              расчета
            </p>
            <Link href="/report" className="text-link">
              Посмотреть пример отчета <Arrow diagonal />
            </Link>
          </div>
        </div>
        <Link href="/?service=2#intake" className="action action-primary">
          Запустить похожий проект <Arrow diagonal />
        </Link>
      </Container>
    </main>
  );
}
