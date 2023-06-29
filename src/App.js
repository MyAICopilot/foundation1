import React, { useState, useRef, useEffect } from "react"; // Add useRef here
import { sendMessageToServer } from "./components/Chatapi";
import Navbar from "./components/Navbar";
import Leftpane from "./components/Leftpane";
import Chatbox from "./components/Chatbox";
import Content from "./components/Content";
import Loginform from "./components/Loginform";

import "./styles/App.css";

const courseData = [
  {
    name: "AI",
    topics: ["AI in everyday life"],
  },

  // Add more courses as needed
];

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messageCounter = useRef(1);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [myContent, setmyContent] = useState("");
  const [mode, setMode] = useState("Doc"); // Add this line
  const [userPrompt, setUserPrompt] = useState(""); // Add this state variable to hold the user prompt
  const [loading, setLoading] = useState(false);
  const [fileClicked, setFileClicked] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  // Define a new state variable to hold the chat history
  const [chatHistory, setChatHistory] = useState("");
  const [documentContent, setDocumentContent] = useState("");

  const [savedResponses, setSavedResponses] = useState({});

  const modeResponses = useRef({});
  const handleTopicClick = (courseIndex, topicIndex) => {
    setActiveCourse(courseIndex);
    setActiveTopic(topicIndex);
  };
  const handleLogin = ({ email, password }) => {
    const hardcodedCred = {
      email: "test@example.com",
      password: "test123",
    };

    if (email === hardcodedCred.email && password === hardcodedCred.password) {
      setUser({ email });
    } else {
      alert("Invalid Credentials!");
    }
    // Here you would typically send a request to your server to authenticate the user
    // For now, let's just simulate this process with a setTimeout function

    setTimeout(() => {
      // This is the user data you would typically receive from your server
      const userData = { id: "123", name: "John Doe", email: email };

      // Save the user data in the state
      setUser(userData);
    }, 1000);
  };
  ////////////////////////////////// call from chat ///////////////////////
  const handleSendMessage_chat = async (inputValue = false) => {
    if (inputValue.trim() === "") return;
    const words = inputValue.trim().split(" ");

    // Calculate total word count (content + user input)
    let totalWordsCount = myContent.split(" ").length + words.length;

    // Calculate total words in chatHistory
    let chatHistoryWordsCount = 0;
    for (let i = 0; i < chatHistory.length; i++) {
      chatHistoryWordsCount += chatHistory[i].split(" ").length;
    }

    // Add chatHistoryWordsCount to totalWordsCount
    totalWordsCount += chatHistoryWordsCount;

    // Maximum tokens we can send to GPT-3
    const maxTokens = 4096; // Put your actual maximum here

    // Assume that on average, one word is approximately five characters (tokens)
    const avgWordTokens = 4;

    const maxWords = Math.floor(maxTokens / avgWordTokens);
    const maxWordsForHistory = maxWords - totalWordsCount;
    let historyWordsCount = 0;
    const newChatHistory = [];

    // Iterate over chat history from the most recent message
    for (let i = chatHistory.length - 1; i >= 0; i--) {
      const messageWordsCount = chatHistory[i].split(" ").length;
      if (historyWordsCount + messageWordsCount <= maxWordsForHistory) {
        historyWordsCount += messageWordsCount;
        newChatHistory.unshift(chatHistory[i]); // Add the message at the beginning of newChatHistory
      } else {
        break;
      }
    }

    setChatHistory(newChatHistory);
    console.log("Updated chat history:", newChatHistory);

    // Modify here: Format message with context
    let messageWithContext = inputValue;
    if (mode && myContent) {
      messageWithContext = `Mode:: ${mode}\nContent:: ${myContent}\n Question:: ${inputValue}. `;
    }

    messageWithContext = `Mode:: ${mode}\nContent:: ${myContent}\n Question:: ${inputValue}. `;

    // Format message for display, which doesn't include the content
    let messageForDisplay = inputValue;
    messageForDisplay = `Mode:${mode} \nUser: ${inputValue}`;

    const newMessage = {
      text: messageForDisplay,
      sender: "user",
      id: `Q${messageCounter.current}`,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setChatHistory((prevChatHistory) => [...prevChatHistory, newMessage.text]); // Add the user's message to the chat history

    // Send the user's message to your server
    try {
      setIsWaitingForResponse(true);
      const botMessageText = await sendMessageToServer(messageWithContext);

      const botMessage = {
        text: botMessageText,
        sender: "bot",
        id: `A${messageCounter.current}`,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        botMessage.text,
      ]); // Add the bot's message to the chat history
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating a response.");
    } finally {
      setIsWaitingForResponse(false);
    }
    messageCounter.current++;
    setInputValue("");
  };

  ////////////////////////////  Call from Leftpane //////////////////////////////////////

  const handleSendMessage_leftpane = async (mode, buttonPrompt) => {
    // Format message with mode, button prompt, and content
    let messageWithContext = `Mode:: ${mode}\nContent:: ${documentContent}\nButton Prompt:: ${buttonPrompt}`;

    // Send the user's message to your server
    try {
      setIsWaitingForResponse(true);
      const modeButtonKey = `${mode}-${buttonPrompt}`;
      // If this mode has a stored response, use it
      if (modeResponses.current[modeButtonKey]) {
        setmyContent(modeResponses.current[modeButtonKey]);
      } else {
        // Otherwise, request a response from the server
        const botMessageText = await sendMessageToServer(messageWithContext);
        setmyContent(botMessageText); // <-- this is the new line you should add
        // And store the response for future use
        modeResponses.current[modeButtonKey] = botMessageText;
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating a response.");
    } finally {
      setIsWaitingForResponse(false);
    }
    messageCounter.current++;
  };

  //////////////////////////////////////////////////////////////////////////////////

  const handleClearChat = () => {
    setMessages([]);
    setChatHistory([]); // Clear the chat history

    messageCounter.current = 1;
  };

  const handleDoc = () => {
    if (mode !== "Doc") {
      setMode("Doc");
      modeResponses.current["Doc"] = "";
    }
  };

  const handleLearn = () => {
    if (mode !== "Learn") {
      setMode("Learn");
      modeResponses.current["Learn"] = "";
    }
  };

  const handleQuiz = () => {
    if (mode !== "Quiz") {
      setMode("Quiz");
      modeResponses.current["Quiz"] = "";
    }
  };

  const handleApply = () => {
    if (mode !== "Apply") {
      setMode("Apply");
      modeResponses.current["Apply"] = "";
    }
  };

  useEffect(() => {
    setMode("Doc");
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
    if (mode === "Doc") {
      setmyContent(documentContent);
    }
  }, [mode, documentContent]);

  const downloadContent = () => {
    // gather all your data
    let data = "";

    const modes = ["Learn", "Quiz", "Apply"]; // Define the fixed order of modes here
    const modeButtonNames = {
      Learn: [
        "Create Summary",
        "List main topics",
        "Summarize main topics",
        "Create a slide deck",
      ],
      Quiz: [
        "Create multiple choice Q&A",
        "Create True/False Q&A",
        "Create open ended Q&A",
        "Create thought provoking questions",
      ],
      Apply: [
        "How to apply this in my work",
        "Give examples based on this",
        "Create actionable steps",
        "Provide further learning material",
      ],
    }; // Define the button names for each mode
    modes.forEach((mode) => {
      modeButtonNames[mode].forEach((buttonName) => {
        const modeKey = `${mode}-${buttonPrompts[buttonName]}`;
        if (modeResponses.current[modeKey]) {
          data += `Mode:: ${mode}\n`;
          data += `Task:: ${buttonName}\n`;
          data += `Content:: ${modeResponses.current[modeKey]}\n\n`;
        }
      });
    });

    // create a downloadable text file
    const element = document.createElement("a");
    const file = new Blob([data], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "myContent.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const buttonPrompts = {
    "Create Summary": "Create high level summary for this Content",
    "List main topics":
      "List the main topics covered(numbered bullets) in this Content",
    "Summarize main topics":
      "List main topics covered in the Content and create a good summary for each of those topics",
    "Create a slide deck":
      "Create up to 10 slides (with 4-5 bullets in each slide) based on this Content",
    "Create multiple choice Q&A":
      "Create up to 10 multiple choice questions. Number each question. List all the answers together after the last question.",
    "Create True/False Q&A":
      "Create up to 10 True/False type questions. Number each question. List all the answers together after the last question.",
    "Create open ended Q&A":
      "Create up to 10 open ended questions whos answers should be in this Content. Number each question.",
    "Create thought provoking questions":
      "Create up to 10 thought provoking questions based on this Content. Number each question. After the last question, provide hints for each question.",
    "How to apply this in my work":
      "How can apply the knowledge from this Content in my life and work.",
    "Give examples based on this":
      "Create up to 10 examples (better if they are from real-life) to explain different topics convered in this Content.",
    "Create actionable steps":
      "Create some next steps or action items from this Content",
    "Provide further learning material":
      "what are some good online material to better understand the topics covered in the Content.",

    // add the rest of the button names here
  };
  return (
    <div className="App">
      <>
        <Navbar
          handleDoc={handleDoc}
          handleLearn={handleLearn}
          handleQuiz={handleQuiz}
          handleApply={handleApply}
          mode={mode}
          loading={loading}
          isWaitingForResponse={isWaitingForResponse} // Add this line
          setmyContent={setmyContent}
          documentContent={documentContent}
        />
        <div className="panes-container">
          <Leftpane
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            mode={mode}
            setUserPrompt={setUserPrompt}
            loading={loading}
            isWaitingForResponse={isWaitingForResponse} // Add this line
            setFileClicked={setFileClicked}
            setmyContent={setmyContent}
            courseData={courseData}
            onTopicClick={handleTopicClick}
            handleButtonClick={handleSendMessage_leftpane}
            setDocumentContent={setDocumentContent}
            downloadContent={downloadContent}
            buttonPrompts={buttonPrompts} // Pass it here
          />
          <Content
            myContent={myContent}
            setmyContent={setmyContent}
            courseData={courseData}
            activeCourse={activeCourse}
            activeTopic={activeTopic}
            mode={mode}
          />
          <div className="chatbox-container">
            <Chatbox
              handleSendMessage_chat={handleSendMessage_chat}
              messages={messages}
              setInputValue={setInputValue}
              inputValue={inputValue} // add this line
              handleClearChat={handleClearChat}
              isWaitingForResponse={isWaitingForResponse}
            />
          </div>
        </div>
      </>
    </div>
  );
}

export default App;
