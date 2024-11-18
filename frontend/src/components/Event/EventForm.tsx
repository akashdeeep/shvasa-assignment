import React, { useState } from "react";

interface EventFormProps {
	onSubmit: (event: { name: string; datetime: string; tag: string }) => void;
	onClose: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, onClose }) => {
	const [name, setName] = useState("");
	const [datetime, setDatetime] = useState("");
	const [tag, setTag] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name && datetime && tag) {
			onSubmit({ name, datetime, tag });
			onClose(); // Close the form after submitting
		} else {
			alert("Please fill all fields.");
		}
	};

	return (
		<div>
			<h2>Add Event</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Event Name:</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>
				<div>
					<label>Date & Time:</label>
					<input
						type="datetime-local"
						value={datetime}
						onChange={(e) => setDatetime(e.target.value)}
					/>
				</div>
				<div>
					<label>Tag:</label>
					<input
						type="text"
						value={tag}
						onChange={(e) => setTag(e.target.value)}
					/>
				</div>
				<button type="submit">Add Event</button>
			</form>
		</div>
	);
};

export default EventForm;
