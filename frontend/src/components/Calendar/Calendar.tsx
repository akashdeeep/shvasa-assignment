import React, { useState } from "react";
import EventForm from "../Event/EventForm";
import "./Calendar.css"; // Import the CSS file

interface Event {
	datetime: string;
	name: string;
	tag: string;
}

interface User {
	googleSync: boolean; // Check if Google Sync is enabled
}

interface CalendarProps {
	events: Event[];
	user: User;
}

const Calendar: React.FC<CalendarProps> = ({ events, user }) => {
	const currentDate = new Date();
	const [showEventForm, setShowEventForm] = useState(false);
	const [eventList, setEventList] = useState<Event[]>(events); // Keep the event list updated in state

	const handleEventSubmit = (event: {
		name: string;
		datetime: string;
		tag: string;
	}) => {
		// Add the new event to the list
		setEventList((prevList) => [...prevList, event]);
	};

	const handleAddEventClick = () => {
		setShowEventForm(true);
	};

	const weekDays = Array.from({ length: 7 }, (_, i) => {
		const date = new Date(currentDate);
		date.setDate(currentDate.getDate() - currentDate.getDay() + i);
		return date;
	});

	const getHourlySlots = (day: Date) => {
		const slots = [];
		for (let hour = 0; hour < 24; hour++) {
			const time = new Date(day);
			time.setHours(hour, 0, 0, 0);
			slots.push(time);
		}
		return slots;
	};

	const formatDate = (date: Date) =>
		`${date.getHours()}:${date.getMinutes() === 0 ? "00" : "30"}`;

	return (
		<div>
			<button onClick={handleAddEventClick} className="add-event-button">
				Add Event
			</button>
			{showEventForm && (
				<EventForm
					onClose={() => setShowEventForm(false)}
					onSubmit={handleEventSubmit}
				/>
			)}

			{/* Render calendar */}
			<div className="calendar-table">
				<div className="calendar-header">
					{weekDays.map((day, index) => (
						<div key={index} className="calendar-day">
							<h3>{day.toDateString()}</h3>
						</div>
					))}
				</div>
				<div className="calendar-body">
					{weekDays.map((day, dayIdx) => (
						<div key={dayIdx} className="calendar-column">
							{getHourlySlots(day).map((time, idx) => (
								<div key={idx} className="calendar-row">
									<div className="time-slot">{formatDate(time)}</div>
									<div className="day-cell">
										{eventList
											.filter(
												(event) =>
													new Date(event.datetime).toDateString() ===
														day.toDateString() &&
													new Date(event.datetime).getHours() ===
														time.getHours()
											)
											.map((event, eventIdx) => (
												<div key={eventIdx} className="event-item">
													<span className="event-name">{event.name}</span>
													<br />
													<span className="event-tag">{event.tag}</span>
												</div>
											))}
									</div>
								</div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Calendar;
