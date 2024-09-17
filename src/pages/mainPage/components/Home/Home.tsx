import "./Home.css";
import GameSettings from "../GameSettings/GameSettings";

export default function Home() {
  return (
    <main className="main">
      <section className="home-section">
        <header>
          <h1 className="home-section__title">Play chess versus AI!</h1>
        </header>
        <GameSettings />
      </section>
    </main>
  );
}
