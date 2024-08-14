> Everything, including this README is generated with [saoudrizwan/claude-dev](https://github.com/saoudrizwan/claude-dev) in less than 5 minutes.
>
> Needs https for microphone access.
>
> Certificate generation needs `openssl`.

# Microphone-Controlled Flappy Bird

This is a web-based Flappy Bird game that uses microphone input to control the bird's flight. Make noise to make the bird fly!

## Setup and Running the Game

To run this game, you need to serve it over HTTPS. This is because modern browsers require a secure context to access the microphone. We'll use Bun to serve the game and generate a self-signed certificate for localhost.

### Prerequisites

1. Install Bun if you haven't already:
   ```
   curl -fsSL https://bun.sh/install | bash
   ```

2. Install the required dependencies:
   ```
   bun install
   ```

### Running the Game

1. Run the setup script to generate the certificate and start the server:
   ```
   bun setup-cert
   bun start
   ```

2. Your default browser should open automatically. If not, open your browser and navigate to `https://localhost:3000`.

3. Your browser will likely warn you about the self-signed certificate. This is normal for local development. You can proceed by clicking "Advanced" and then "Proceed to localhost (unsafe)".

4. The game should now load in your browser. Click the "Start Game" button and allow microphone access when prompted.

5. Make noise (e.g., clap, speak, or blow into the microphone) to make the bird jump. Navigate through the pipes to score points.

6. If you hit a pipe or the ground, the game ends, and you can restart by clicking the "Restart" button.

## Adjusting Sensitivity

If the bird is too sensitive or not sensitive enough to sound, you can adjust the threshold in the `analyseAudio` function in `game.js`. Look for this line:

```javascript
if (average > 50) { // Adjust this threshold as needed
```

Increase the number to make it less sensitive, or decrease it to make it more sensitive to sound.

Enjoy the game!