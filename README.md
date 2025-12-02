# CP-Nexus

**CP-Nexus** is a centralized platform for competitive programmers to track progress, visualize statistics, and practice in a focused environment.

## Project Proposal

### Problem Statement
Competitive programmers often struggle with:
- **Fragmented Data:** Tracking progress across multiple platforms (Codeforces, LeetCode, etc.) is tedious.
- **Lack of Visualization:** Standard platforms provide basic stats but lack deep insights into daily activity and verdict trends.
- **Distraction:** Maintaining focus during practice sessions is difficult without enforcement mechanisms.
- **Missed Contests:** Keeping track of contest schedules across different sites requires manual checking.

### Solution
**CP-Nexus** solves these problems by providing:
1.  **Unified Dashboard:** Aggregates Codeforces data (rating, submissions) into a single, beautiful interface.
2.  **Advanced Visualization:** Interactive charts and heatmaps to analyze performance trends over time.
3.  **Hardcore Editor (Zen Mode):** A specialized coding environment that deletes your code if you stop typing for 30 seconds, forcing flow state.
4.  **Contest Calendar:** A consolidated view of upcoming contests to ensure you never miss a round.

### Key Features
- **Real-time Data Sync:** Fetches latest stats from Codeforces API.
- **Interactive Graphs:** Rating history and submission verdict breakdown using Recharts.
- **Activity Heatmap:** GitHub-style contribution graph for CP submissions.
- **Hardcore Editor:**
    - **Monaco Editor:** VS Code-like experience.
    - **Judge0 Integration:** Compile and run code (Python, C++, Java, JS) directly in the browser.
    - **Zen Mode:** 30-second wipe timer (pausable).
    - **Input/Output:** Dedicated tabs for testing.
- **Contest Calendar:** List of upcoming contests sorted by start time.

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State:** SWR, React Hooks
- **Charts:** Recharts
- **Editor:** Monaco Editor

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Auth:** JWT

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jigyasu-kalyan/cp-nexus.git
    cd cp-nexus
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Create .env file with DATABASE_URL and JWT_SECRET
    npx prisma migrate dev
    npm run dev
    ```

3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access:**
    Open `https://cp-nexus.vercel.app/` in your browser.

## License
MIT
