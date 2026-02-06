import { createContext, useContext } from "react";

const ChatContext = createContext(null);

export const ChatProvider = ({ value, children }) => {
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};
