import { useContext } from "react";

import { SocketContext } from "../contexts/SocketContext";

export const useSocketContext = () => useContext(SocketContext);
