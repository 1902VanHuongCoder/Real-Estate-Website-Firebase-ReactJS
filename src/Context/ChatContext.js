import { createContext, useContext, useReducer } from "react";
import { AppContext } from "./AppContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { session } = useContext(AppContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        console.log(action.payload);
        return {
          user: action.payload,
          chatId:
            session.userId > action.payload.userId
              ? session.userId + action.payload.userId
              : action.payload.userId + session.userId,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
