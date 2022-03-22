import { parseCookies } from "nookies";
import { useCallback, useEffect } from "react";
import { socket } from "../utils/socket";

export const useSocket = () => {
  useEffect(() => {
    return () => {
      if (socket.connected) {
        socket.off();
        socket.disconnect();
      }
    };
  }, []);

  return {
    socket,
    connect: useCallback(() => {
      const { username } = parseCookies(null);

      socket.auth = { username };
      socket.connect();
    }, []),
  };
};
