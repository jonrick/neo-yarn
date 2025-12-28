Artifact 2: Technical Design Document (TDD)
1. Server Architecture (Node.js)
The server index.js will maintain an in-memory GameManager class.

Room Class:

id: string (4 char code)

players: Map<socketId, Player>

phase: 'LOBBY' | 'WRITING' | 'VOTING' | 'RESULTS'

story: Array<string>

currentSubmissions: Array<Submission>

timer: NodeJS.Timeout

2. Socket.io Events
Client -> Server:

JOIN_ROOM(roomCode, userName)

START_GAME() (Host only)

SUBMIT_TEXT(text)

VOTE(submissionId)

Server -> Client:

ROOM_UPDATE(roomState) (Sent on any change to sync UI)

TIMER_TICK(secondsRemaining)

ERROR(message)

3. Docker Strategy
We will use a Multi-Stage Build to keep the image small.

Stage 1 (Build): Node image. Installs frontend deps, runs npm run build (Vite).

Stage 2 (Production): Node Alpine image. Copies the dist folder from Stage 1. Installs backend deps. Starts node server.js.

