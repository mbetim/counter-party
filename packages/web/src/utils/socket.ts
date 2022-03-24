import { io, Socket } from 'socket.io-client';
import { Party } from '../types/party';

type PartyCallback = (party: Party) => void;

interface ServerToClientEvents {
  'party:update': PartyCallback;
  exception: (error: Error) => void;
}

interface ClientToServerEvents {
  'party:create': (
    data: { incrementOptions: number[] },
    callback: PartyCallback,
  ) => void;
  'party:join': (data: { name: string }, callback: PartyCallback) => void;
  'party:update-counter': (data: { points: number }) => void;
}

const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

if (!websocketUrl) throw new Error('Missing websocket url');

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  websocketUrl,
  {
    autoConnect: false,
  },
);
