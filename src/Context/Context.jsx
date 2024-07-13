/* eslint-disable no-unused-vars */
import { createContext, useState } from "react";
import run from "../Config/Gemini";
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSend = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let result;
    if (prompt !== undefined) {
      result = await run(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      result = await run(input);
    }

    let resultResponse = result.split("**");
    let newArray = "";
    for (let i = 0; i < resultResponse.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newArray += resultResponse[i];
      } else {
        newArray += "<b>" + resultResponse[i] + "</b>";
      }
    }
    let newResponse = newArray.split("*").join("</br>");
    let newResponse2 = newResponse.split(" ");
    for (let i = 0; i < newResponse2.length; i++) {
      const nextWord = newResponse2[i];
      delayPara(i, nextWord + " ");
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSend,
    setRecentPrompt,
    recentPrompt,
    loading,
    resultData,
    input,
    setInput,
    showResult,
    newChat,
  };

  return (
    // eslint-disable-next-line react/prop-types
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
