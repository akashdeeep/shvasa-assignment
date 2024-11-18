# Events Calendar App

A React-based application for managing events. Users can add, view, and organize events in a calendar format, with an option to sync with Google Calendar.

## Features:

- View events for the current week.
- Add new events with details like name, datetime, and tag.
- Events are displayed in a daily schedule format.
- Option to add new events via a form.

## Tech Stack:

- **Frontend**: React, TypeScript
- **Styling**: CSS
- **State Management**: React hooks (useState)

## Setup:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend server:

   ```bash
   npm start
   ```

4. Start the backend serverL

   ```bash
   nodemon backend/src/index
   ```

## Usage:

- **Add Event**: Click the "Add Event" button to open the event form.
- **View Events**: The calendar shows events for the current week, with hourly slots.

## File Structure:

- `src/`: Contains the main codebase for the app
  - `components/`: Contains the `Calendar` and `EventForm` components
  - `styles/`: Contains the CSS file for the calendar layout
