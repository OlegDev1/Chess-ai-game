import "./Home.css";
import GameSettings from "../GameSettings/GameSettings";

export default function Home() {
  return (
    <main className="main">
      <section className="homeSection">
        <h1 className="homeSection__title">Enjoy the chess!</h1>
        <GameSettings />
      </section>
    </main>
  );
}
