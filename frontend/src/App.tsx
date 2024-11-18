import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Calendar from "./components/Calendar/Calendar";

// Define the user type
interface User {
	name: string;
	googleSync: boolean; // Add feature flag for Google Calendar sync
}

const App: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	// Fetch user data when the app loads
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = localStorage.getItem("authToken");
				if (token) {
					const response = await fetch(
						"http://localhost:5000/api/user/getUser",
						{
							method: "GET",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
						}
					);

					if (response.ok) {
						const data = await response.json();
						setUser(data); // Set the user data
					} else {
						setUser(null); // Handle unauthenticated case
					}
				} else {
					setUser(null); // No token found
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
				setUser(null); // If there's an error, treat as not authenticated
			} finally {
				setLoading(false); // Stop the loading state
			}
		};

		fetchUser();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{user ? (
				<Calendar events={[]} user={user} />
			) : (
				<Login setUser={setUser} />
			)}
		</div>
	);
};

export default App;
