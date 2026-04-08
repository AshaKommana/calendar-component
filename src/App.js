import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [notes, setNotes] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const monthNames = [
    "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
    "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
  ];

  useEffect(() => {
    const saved = localStorage.getItem("notes");
    if (saved) setNotes(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", notes);
  }, [notes]);

  const handleDateClick = (day) => {
    if (!startDate) {
      setStartDate(day);
    } else if (!endDate) {
      if (day < startDate) {
        setEndDate(startDate);
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    } else {
      setStartDate(day);
      setEndDate(null);
    }
  };

  const isInRange = (day) => {
    return startDate && endDate && day >= startDate && day <= endDate;
  };

  const clearSelection = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    clearSelection();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    clearSelection();
  };

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={"empty-" + i}></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div
          key={i}
          className={`day 
          ${i === startDate ? "start" : ""}
          ${i === endDate ? "end" : ""}
          ${isInRange(i) ? "range" : ""}`}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="container">

      {/* IMAGE */}
      <div className="image-section">
        <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" alt="hero"/>
        <div className="overlay">
          <h2>{monthNames[month]}</h2>
          <span>{year}</span>
        </div>
      </div>

      <div className="content">

        {/* NOTES */}
        <div className="notes">
          <h3>📝 Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write something..."
          />
          <button onClick={clearSelection}>Clear Selection</button>
        </div>

        {/* CALENDAR */}
        <div className="calendar-section">

          <div className="nav">
            <button onClick={prevMonth}>⬅</button>
            <h3>{monthNames[month]} {year}</h3>
            <button onClick={nextMonth}>➡</button>
          </div>

          <div className="weekdays">
            <span>MON</span><span>TUE</span><span>WED</span>
            <span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
          </div>

          <div className="calendar">
            {renderDays()}
          </div>

        </div>

      </div>

    </div>
  );
}