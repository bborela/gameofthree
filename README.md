# gameofthree

## How to run

First, clone this repository.

### Server

Run <code>npm install</code> to install dependencies.

To run unit tests, simply type <code>npm t</code> from the console.

To run the server, run <code>npm start</code>. To quit it, type <code>/quit</code> or <code>/q</code> in the console. The server is run on port 8080 by default; to change this, simply set the environment variable PORT to the desired value.

### Client

Run <code> npm install</code> to install dependencies.

To run the client, run <code>npm start http://host:port</code>. If no address is given, default is http://localhost:8080.

##### Advanced options

You can set the environment variable *AUTO_DELAY* to an integer to change the delay between autoplayer moves. (default is 3 seconds)

#### How to play

Commands should be typed directly into the console.

|  Command  | Description   |
| ------------ | ------------ |
|  /say (or /s) <code>text</code> |  sends chat message  |
|  /play (or /p) <code>- &#124; 0 &#124; +</code>  |  makes a move (-1, 0 or +1) |
|  /auto (or /a) |  disables/enables auto-play (initially on)  |
|  /quit (or /q) | closes the client and disconnects |
