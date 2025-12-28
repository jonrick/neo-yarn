Project Context & Stack Selection (Revised)
Platform: Web (Mobile & Desktop).

Deployment: Docker Container (via Portainer/Docker Compose).

Backend: Node.js + Express + Socket.io.

Role: Serves the frontend, manages game lobbies, runs timers, handles voting logic.

Frontend: React + Vite + Tailwind CSS.

Database (Optional but recommended): SQLite (file-based).

Why? It requires no extra running container (unlike Postgres). We just mount a volume in Docker to keep your stories saved if the container restarts.