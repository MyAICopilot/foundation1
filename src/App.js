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
  {
    name: "AR & VR",
    topics: ["Augmented and Virtual Reality"],
  },
  {
    name: "Crypto and Blockchain",
    topics: ["Basics of Crypto and Blockchain"],
  },
  {
    name: "Basics of Entrepreneurship",
    topics: ["Basics of Entrepreneurshipn and Startups"],
  },
  {
    name: "Climate change",
    topics: ["Climate change and impact"],
  },
  {
    name: "Cultural & Globalization",
    topics: ["Cultural Intelligence in Globalized world"],
  },
  {
    name: "Data Privacy",
    topics: ["Data Privacy and Cybersecurity"],
  },
  {
    name: "Digital Marketing",
    topics: ["Digital Marketing and Social media strategies"],
  },
  {
    name: "Future of work",
    topics: ["Remote Work and Digital Nomads"],
  },
  {
    name: "IoT and Smart Homes",
    topics: ["Internet of Things (IoT) and smart homes"],
  },
  {
    name: "Intro to coding",
    topics: ["Intro to coding and software development"],
  },
  {
    name: "Quantum Computing",
    topics: ["Intro to Quantum Computing"],
  },
  {
    name: "Machine Learning",
    topics: ["Machine Learning and Predictive Analytics"],
  },
  {
    name: "Personal Finance",
    topics: ["Personal Finance and Investing"],
  },
  {
    name: "Renewable Energy Tech",
    topics: ["Renewable Energy Sources and Tech"],
  },
  {
    name: "Sustainable Living",
    topics: ["Sustainable living and green tech"],
  },
  {
    name: "Nutrition and Wellness",
    topics: ["The science of Nutrition and Wellness"],
  },
  {
    name: "Financial Management",
    topics: ["Overview", "Financial Statements"],
  },
  {
    name: "Startup Playbook",
    topics: [
      "The Idea",
      "The Team",
      "A Great Product",
      "Growth",
      "Focus and Intensity",
      // "Jobs of CEO",
      // "Hiring and Managing",
      // "Competitors",
      // "Making Money",
      // "Fundraising",
    ],
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
  const [mode, setMode] = useState("Learn"); // Add this line
  const [userPrompt, setUserPrompt] = useState(""); // Add this state variable to hold the user prompt
  const [loading, setLoading] = useState(false);
  const [fileClicked, setFileClicked] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  // Define a new state variable to hold the chat history
  const [chatHistory, setChatHistory] = useState("");

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
      messageWithContext = `Operating Mode: ${mode}\n Topic name:${
        courseData[activeCourse].name
      }: ${
        courseData[activeCourse].topics[activeTopic]
      } \nReference-Content: ${myContent}\nChat History between user and AI: ${newChatHistory.join(
        " "
      )}\n\n You must answer next question based on Reference-Content: ${inputValue}. `;
    }

    // Format message for display, which doesn't include the content
    let messageForDisplay = inputValue;
    messageForDisplay = `${mode}: ${courseData[activeCourse].name} > ${courseData[activeCourse].topics[activeTopic]}\nUser: ${inputValue}`;

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

  ////////////////////////////////////////////////////////////////////////////////

  const handleClearChat = () => {
    setMessages([]);
    setChatHistory([]); // Clear the chat history

    messageCounter.current = 1;
  };

  const handleLearn = () => {
    setMode("Learn");
  };

  const handleQuiz = () => {
    setMode("Quiz"); // If Quiz corresponds to 'test' mode
  };

  const handleApply = () => {
    setMode("Apply");
  };

  useEffect(() => {
    setMode("Learn");
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="App">
      <>
        <Navbar
          handleLearn={handleLearn}
          handleQuiz={handleQuiz}
          handleApply={handleApply}
          mode={mode}
          loading={loading}
          isWaitingForResponse={isWaitingForResponse} // Add this line
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
