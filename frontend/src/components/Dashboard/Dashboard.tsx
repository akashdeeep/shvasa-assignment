import React, { useState } from "react";
import Calendar from "../Calendar/Calendar";

const Dashboard: React.FC = () => {
	// Update type to allow `null`
	const [user, setUser] = useState<{ name: string } | null>({ name: "User" }); // Mock user

	const handleLogout = () => {
		setUser(null);
	};

	return (
		<div>
			<header className="flex justify-between p-4 bg-blue-600 text-white">
				<h1>Welcome, {user ? user.name : "Guest"}</h1>{" "}
				{/* Adjusted for null check */}
				<button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
					Logout
				</button>
			</header>
			<Calendar events={[]} user={{ googleSync: false }} />
		</div>
	);
};

export default Dashboard;
