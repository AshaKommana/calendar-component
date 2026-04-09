import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notes, setNotes] = useState("");
  const [flip, setFlip] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
    "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;

  const fixedHolidays = {
    0: {1: "New Year", 26: "Republic Day"},
    3: {14: "Ambedkar Jayanti"},
    4: {1: "Labour Day"},
    7: {15: "Independence Day"},
    8: {5: "Teacher's Day"},
    9: {2: "Gandhi Jayanti"},
    10: {14: "Children's Day"},
    11: {25: "Christmas"}
  };

  const holidayData = {
    2026: {
      2: {3: "Holi", 20: "Eid"},
      3: {19: "Ugadi"},
      4: {3: "Good Friday", 5: "Easter"},
      8: {15: "Ganesh Chaturthi"},
      9: {20: "Dussehra"},
      10: {8: "Diwali"}
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", notes);
  }, [notes]);

  const getHoliday = (day) =>
    fixedHolidays[month]?.[day] ||
    holidayData[year]?.[month]?.[day];

  const handleClick = (day) => {
    if (!startDate) setStartDate(day);
    else if (!endDate) {
      if (day < startDate) {
        setEndDate(startDate);
        setStartDate(day);
      } else setEndDate(day);
    } else {
      setStartDate(day);
      setEndDate(null);
    }
  };

  const inRange = (d) =>
    startDate && endDate && d > startDate && d < endDate;

  const changeMonth = (dir) => {
    setFlip(true);
    setTimeout(() => {
      setCurrentDate(new Date(year, month + dir, 1));
      setStartDate(null);
      setEndDate(null);
      setFlip(false);
    }, 300);
  };

  const renderDays = () => {
    const arr = [];

    for (let i = 0; i < firstDay; i++) arr.push(<div key={"e"+i}></div>);

    for (let i = 1; i <= daysInMonth; i++) {
      const holiday = getHoliday(i);

      arr.push(
        <div
          key={i}
          className={`day
            ${holiday ? "holiday" : ""}
            ${i === startDate ? "start" : ""}
            ${i === endDate ? "end" : ""}
            ${inRange(i) ? "range" : ""}`}
          onClick={() => handleClick(i)}
          title={holiday || ""}
        >
          {i}
        </div>
      );
    }

    return arr;
  };

  const getFestivals = () => {
    const list = [];
    const fixed = fixedHolidays[month];
    const dynamic = holidayData[year]?.[month];

    if (fixed) Object.entries(fixed).forEach(([d,n]) => list.push(`${d} - ${n}`));
    if (dynamic) Object.entries(dynamic).forEach(([d,n]) => list.push(`${d} - ${n}`));

    return list;
  };

  return (
    <div className={darkMode ? "dark container" : "container"}>

      <div className="image-section">
        <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" alt="" />
        <div className="overlay">
          <h2>{monthNames[month]}</h2>
          <span>{year}</span>
        </div>
      </div>

      <div className="content">

        <div className="notes">
          <h3>📝 Notes</h3>
          <textarea value={notes} onChange={(e)=>setNotes(e.target.value)} />
          <button onClick={()=>{setStartDate(null);setEndDate(null);}}>
            Clear Selection
          </button>
          <button onClick={()=>setDarkMode(!darkMode)}>
            Toggle Dark Mode 🌙
          </button>
        </div>

        <div className="festival">
          <h3>🎉 Festivals</h3>
          <ul>
            {getFestivals().map((f,i)=>(
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div className={`calendar-box ${flip ? "flip" : ""}`}>

          <div className="nav">
            <button onClick={()=>changeMonth(-1)}>⬅</button>
            <h3>{monthNames[month]} {year}</h3>
            <button onClick={()=>changeMonth(1)}>➡</button>
          </div>

          <div className="weekdays">
            {["MON","TUE","WED","THU","FRI","SAT","SUN"].map(d=>(
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="calendar">
            {renderDays()}
          </div>

        </div>

      </div>

    </div>
  );
}
