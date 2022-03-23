import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useSnackbar } from "notistack";
import { useCallback, useEffect } from "react";
import { socket } from "../utils/socket";

export const useSocket = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  useEffect(() => {
    socket.once("connect_error", (reason) => {
      const message = reason.message ?? "Failed to connected to socket";

      enqueueSnackbar(message, { variant: "error" });
      router.replace("/login");
    });

    if (!socket.hasListeners("exception")) {
      socket.on("exception", (reason) => {
        console.log("exception", reason);
        const messagesToRedirect = ["Party does not exist", "Party name is required"];

        enqueueSnackbar(reason.message, { variant: "error" });

        if (messagesToRedirect.includes(reason.message)) {
          router.replace("/");
        }
      });
    }

    return () => {
      if (socket.connected) {
        socket.removeAllListeners();
        socket.disconnect();
      }
    };
  }, [enqueueSnackbar, router]);

  return {
    socket,
    connect: useCallback(() => {
      const { username } = parseCookies(null);

      socket.auth = { username };
      socket.connect();
    }, []),
  };
};
