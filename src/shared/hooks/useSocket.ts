import { useCallback, useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

import { tokenManager } from "@features/auth/auth-token.manager";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const POLL_INTERVAL = 1000;

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const disconnectSocket = useCallback(() => {
    const inst = socketRef.current;
    if (inst) {
      inst.off("connect");
      inst.off("disconnect");
      inst.off("connect_error");
      inst.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
      console.log("[Socket.IO] Socket desconectado");
    }
  }, []);

  const connectSocket = useCallback(() => {
    const token = tokenManager.getAccessToken();
    if (!token || socketRef.current) return;

    console.log("[Socket.IO] Conectando a:", BACKEND_URL);
    const instance = io(BACKEND_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = instance;
    setSocket(instance);

    instance.on("connect", () => {
      console.log("[Socket.IO] Conectado al servidor:", BACKEND_URL);
      setConnected(true);
    });

    instance.on("disconnect", (reason) => {
      console.log("[Socket.IO] Desconectado. Razón:", reason ?? "desconocida");
      setConnected(false);
    });

    instance.on("connect_error", (err: Error) => {
      console.error("[Socket.IO] Error de conexión:", err.message, `(url: ${BACKEND_URL})`);
      setConnected(false);
    });
  }, []);

  // Poll para detectar cambios de token (login/logout)
  useEffect(() => {
    pollRef.current = setInterval(() => {
      const hasToken = tokenManager.hasAccessToken();
      const hasSocket = !!socketRef.current;

      if (hasToken && !hasSocket) {
        console.log("[Socket.IO] Token detectado, conectando...");
        connectSocket();
      } else if (!hasToken && hasSocket) {
        console.log("[Socket.IO] Token eliminado, desconectando...");
        disconnectSocket();
      }
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  return { socket, connected };
}
