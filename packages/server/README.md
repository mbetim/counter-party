# Counter Party Backend

A simple server for the **Counter Party** application

## Features

- A user can create a party with possible increments values
  - Which party will be a socket room
    - Use a unique name generator for the room name?

1. A user will try to connect
   1. The user must have at least a `ts auth.name ` in the handshake
   2. The client.id will be saved to a map that'll have all users
2. The server will listen to mainly 2 events
   1. **party:create**: which will create a new party (room)
   2. **party:join**: which will join the user to an existing party
