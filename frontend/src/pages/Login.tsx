import React, { useState } from "react";
import "./Login.css"; // Import the CSS file

interface LoginProps {
	setUser: React.Dispatch<React.SetStateAction<any>>;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [error, setError] = useState<string>("");

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch("http://localhost:5000/user/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});
			const data = await response.json();

			if (response.ok) {
				localStorage.setItem("authToken", data.token);
				setUser({ name: data.name, googleSync: data.googleSync }); // Set user data and Google Sync flag
			} else {
				setError(data.message || "Login failed");
			}
		} catch (error) {
			console.error("Error logging in:", error);
			setError("Error logging in");
		}
	};

	return (
		<div className="login-container">
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<div>
					<label>Email:</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				{error && <p>{error}</p>}
				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default Login;
