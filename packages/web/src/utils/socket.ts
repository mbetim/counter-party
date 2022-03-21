import { io } from "socket.io-client";

const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

if (!websocketUrl) throw new Error("Missing websocket url");

export const socket = io(websocketUrl, { autoConnect: false });
