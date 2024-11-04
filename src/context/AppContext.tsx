import { createContext } from "react";

interface AppContextType {
    username?: string;
    setUserName?: (username: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export default AppContext;
