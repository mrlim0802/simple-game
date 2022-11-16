import "./SearchButtons.css";
import { useState, useEffect } from "react";
import ReactSelect from "react-select";
import HashtagList from "../../data/HashtagList";
import MatchCardsInfos from "../../data/MatchCardsInfos";
import ModalCalendar from "./ModalCalendar";


function HashtagBar({ onChange }) {
  const [hashtagBarSearch, SethashtagBarSearch] = useState();

  const handleChange = (selectedHashtag) => {
    SethashtagBarSearch(selectedHashtag);
    onChange(selectedHashtag);
  };

  const styles = {
    container: (base) => ({
      ...base,
      width: 360,
    }),
  };

  return (
    <div>
      <ReactSelect
        value={hashtagBarSearch}
        onChange={handleChange}
        options={HashtagList}
        isMulti
        autoFocus
        isSearchable
        placeholder="#"
        styles={styles}
        theme={(theme) => ({
          ...theme,
          borderRadius: 10,
          colors: {
            ...theme.colors,
            primary25: "orange", // background on select
            primary: "white", // border selected
            danger: "orange", // cross selected
            dangerLight: "gba(49, 49, 51, 0.5)", // cross selected
            neutral0: "rgba(49, 49, 51, 0.5)", //  background container
            neutral10: "rgba(49, 49, 51, 0.2)", // background selected
            neutral20: "rgba(49, 49, 51, 1)", // borders unselected
            neutral50: "rgba(49, 49, 51, 1)", // placeholder
            neutral30: "rgba(49, 49, 51, 0.2)", // border hover
            neutral60: "white", // button when pick
            neutral80: "white", // hashtag text
          },
        })}
      />
    </div>
  );
}

export function Timer({ time }) {
  return (
    <div className="inline">
      <img
        className="icons"
        src="src/img/icons/schedule-white.png"
        alt="schedule-icons"
      />
      <p className="borders-styled">
        {time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

export function City({ city, setCity }) {
  const [defaultCity] = useState(city);

  const handleChange = (e) => {
    setCity(e.target.value);
  };
  return (
    <div className="inline">
      <img
        className="icons"
        src="src/img/icons/localisation-white.png"
        alt="localisation-icons"
      />
      <div className="select-dropdown borders-styled">
        <select className="select" value={city} onChange={handleChange}>
          <option value={defaultCity}>{defaultCity}</option>
          <option value="BOSTON">BOSTON</option>
          <option value="CHICAGO">CHICAGO</option>
        </select>
      </div>
    </div>
  );
}


export function Calendar({ date, setViewCalendar }) {
  return (
    <div
      onClick={() => setViewCalendar(true)}
      onKeyDown={() => setViewCalendar(true)}
      role="button"
      tabIndex={0}
      className="inline"
    >
      <img
        className="icons"
        src="src/img/icons/calendar-white.png"
        alt="calendar-icons"
      />
      <p className="borders-styled">{date.toLocaleDateString("en-US")}</p>
    </div>
  );
}


export default function SearchButtons({
  viewCalendar,
  setViewCalendar,
  setMatchCardsList,
}) {
  const [cardsList, setCardsList] = useState([]);
  useEffect(() => {
    setMatchCardsList(cardsList);
  }, [cardsList]);

  const [city, setCity] = useState("NEW-YORK");
  const [hashtagList, setHashtagList] = useState([]);
  const [time] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const dateAndTime = new Date(
    `${date.toLocaleDateString("en-US")} 
      ${time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
  );

  useEffect(() => {
    const FilterByDateAndTime = (cards, lastDate) => {
      return cards.filter((card) => {
        return new Date(`${card.time} ${card.date}`) >= lastDate;
      });
    };
    const FilterByCity = (cardsFilterByDate) => {
      return cardsFilterByDate.filter((card) => {
        return card.city === city;
      });
    };
    const FilterByHashtag = (cardsFilterByCityAndDate, hashtag) => {
      const hashtagSelectedKeys = [
        ...new Set(
          hashtag
            .map((element) => {
              return Object.keys(element);
            })
            .flat()
        ),
      ].filter((element, index) => index > 1);
      const filterKeysByHashtag = (cards, keys) => {
        return hashtag.some((card) => cards[keys].includes(card[keys]));
      };
      const FilterCards = cardsFilterByCityAndDate.filter((cards) => {
        if (hashtag.length === 0) return cards;

        if (hashtagSelectedKeys.length === 1)
          return filterKeysByHashtag(cards, hashtagSelectedKeys[0]);
        if (hashtagSelectedKeys.length === 2) {
          return (
            filterKeysByHashtag(cards, hashtagSelectedKeys[0]) &&
            filterKeysByHashtag(cards, hashtagSelectedKeys[1])
          );
        }
        if (hashtagSelectedKeys.length === 3) {
          return (
            filterKeysByHashtag(cards, hashtagSelectedKeys[0]) &&
            filterKeysByHashtag(cards, hashtagSelectedKeys[1]) &&
            filterKeysByHashtag(cards, hashtagSelectedKeys[2])
          );
        }
        return false;
      });
      return FilterCards;
    };
    setCardsList(
      FilterByHashtag(
        FilterByCity(FilterByDateAndTime(MatchCardsInfos, dateAndTime)),
        hashtagList
      )
    );
  }, [date, city, hashtagList]);

  return (
    <div className="search-container">
      <HashtagBar onChange={setHashtagList} />
      <div className="search-buttons">
        <Timer time={time} />
        <City city={city} setCity={setCity} />
        <Calendar date={date} setViewCalendar={setViewCalendar} />
        <ModalCalendar
          viewCalendar={viewCalendar}
          setViewCalendar={setViewCalendar}
          date={date}
          setDate={setDate}
        />
      </div>
    </div>
  );
}
