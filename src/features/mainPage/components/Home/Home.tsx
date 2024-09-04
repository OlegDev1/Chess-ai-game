import "./Home.css";
import GameSettings from "../GameSettings/GameSettings";

export default function Home() {
  return (
    <main className="main">
      <section className="home-section">
        <h1 className="home-section__title">Enjoy the chess!</h1>
        <GameSettings />
      </section>
    </main>
  );
}
