import "./MatchPage.css";
import React, { useState } from "react";
import SearchButtons from "@components/Search/SearchButtons";
import MatchCards from "@components/MatchCards/MatchCards";
import ViewMatchPage from "@pages/ViewMatchPages";
import AddMatchPage from "@pages/AddMatchPage";
import InsideCard from "../img/mobile/inside-card.png";
import OutsideCard from "../img/mobile/outside-card.png";

export default function MainPage() {
  const [matchCardsList, setMatchCardsList] = useState([]);
  const [viewCalendar, setViewCalendar] = useState(false);
  const [viewMatch, setViewMatch] = useState(false);
  const [viewAddMatch, setViewAddMatch] = useState(false);
  const [matchId, setMatchId] = useState("");

  return (
    <section className="match-page">
      <div className="logo-container">
        <img
          className="logo"
          src="src/img/mobile/logoGetMatch.png"
          alt="logo"
        />
      </div>
      <SearchButtons
        viewCalendar={viewCalendar}
        setViewCalendar={setViewCalendar}
        setMatchCardsList={setMatchCardsList}
      />
      <div className="cards-container">
        {matchCardsList.map((card) => (
          <MatchCards
            viewMatch={() => {
              setViewMatch(true);
              setMatchId(card.id);
            }}
            img={card.groundType === "Inside" ? InsideCard : OutsideCard}
            key={card.id}
            city={card.city}
            date={card.date}
            time={card.time}
            versus={card.versus}
            playersLeft={card.playersLeft}
            groundType={card.groundType}
          />
        ))}
      </div>
      <div
        className="add-match-button"
        type="button"
        onClick={() => {
          setViewAddMatch(true);
        }}
        onKeyDown={() => {
          setViewAddMatch(true);
        }}
        role="button"
        tabIndex={0}
      >
        <p>ADD MATCH</p>
      </div>
      <ViewMatchPage
        matchId={matchId}
        viewMatch={viewMatch}
        onClose={() => setViewMatch(false)}
      />
      <AddMatchPage
        viewAddMatch={viewAddMatch}
        setViewAddMatch={() => setViewAddMatch(false)}
        onClose={() => setViewAddMatch(false)}
        viewMatch={(id) => {
          setViewMatch(true);
          setMatchId(id);
        }}
      />
    </section>
  );
}
