
Artifact 1: Game Design Document (GDD)
1. Game Overview
NEO-YARN is a server-authoritative multiplayer browser game. Players join a lobby to collaboratively write a story.

2. Core Loop (Server-Controlled)
Lobby: Players connect to the server via WebSocket. The server assigns them to a "Room" object.

The Hook: The Server sends a GAME_START event with a randomized opening sentence.

Writing Phase: The Server starts an internal 60s timer. Players emit SUBMIT_TEXT events.

Voting Phase: When the timer hits 0, the Server shuffles submissions and emits START_VOTING. Players emit CAST_VOTE events.

Result Phase: The Server calculates the winner, updates the master_story variable, and emits ROUND_WINNER.

End Game: After X rounds, the Server emits GAME_OVER with the full text file for download.

3. UI/UX
Theme: "Cyber-Noir" (Green/Black).

Connection Handling: Needs a "Reconnecting..." spinner if the WebSocket drops.