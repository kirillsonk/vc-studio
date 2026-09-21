import Link from "next/link";
import { Container } from "./Chrome";
import { STUDIO_EMAIL, STUDIO_TELEGRAM } from "./constants";
export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top">
          <Link href="/" className="wordmark">
            vc<span className="wordmark-slash">/</span>studio
          </Link>
          <p>
            AI ускоряет код
            <br />
            Мы отвечаем за продукт
          </p>
          <div className="footer-contacts">
            {STUDIO_EMAIL && (
              <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>
            )}
            {STUDIO_TELEGRAM && (
              <a
                href={`https://t.me/${STUDIO_TELEGRAM.replace("@", "")}`}
                target="_blank"
                rel="noreferrer"
              >
                Telegram ↗
              </a>
            )}
            <Link href="/#intake">Обсудить проект ↗</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} VC Studio</span>
          <span>Дизайн с характером. Разработка с ответственностью</span>
          <a href="#main">Наверх ↑</a>
        </div>
      </Container>
    </footer>
  );
}
