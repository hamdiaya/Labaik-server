

# Labaik_Server

## Description
Labaik_Server is the backend of a platform designed to organize and manage the Hajj process in Algeria. The platform aims to streamline various administrative and logistical tasks associated with the Hajj pilgrimage, providing tailored interfaces for different user roles, including the Ministry (Admin), Commune Agents, Candidates (El Hadj), and Doctors.

## Key Features
- **Admin Interface:**
  - Set Hajj conditions (number of places, date of lottery, selection algorithm)
  - Check statistics
  - Automatically send notifications to agents after setting conditions

- **Commune Agent Interface:**
  - Validate candidate dossiers
  - Launch the lottery
  - Consult information about El Hadj
  - Manage payments
  - Receive notifications

- **Candidate (El Hadj) Interface:**
  - Register for the lottery
  - Submit dossier
  - Check dossier status
  - Reserve hotel and flight
  - View profile
  - Consult Mahram information
  - Send questions to commune agents
  - Receive notifications after dossier validation or medical visit

- **Doctor Interface:**
  - Provide medical assessments for candidates

## Technologies Used
- **Backend:** Node.js with Express
- **Database:** Supabase

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/hamdiaya/Labaik_Server.git
   ```
2. Navigate to the project directory:
   ```sh
   cd Labaik_Server
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Usage
1. Start the server:
   ```sh
   npm start
   ```
2. The server will run on `http://localhost:3000`.

## Contributors
- Hamdiaya (Backend Developer)
- Amieur Zineb Ichraq (Backend Developer)


