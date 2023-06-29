import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap"; // or your preferred UI library
import Docxtemplater from "docxtemplater";
import * as mammoth from "mammoth/mammoth.browser";
import JSZip from "jszip";
import { Collapse } from "react-collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import "../styles/Leftpane.css";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { pdfjsWorker } from "pdfjs-dist/webpack";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

function Leftpane({
  courseData,
  onTopicClick,
  mode,
  setmyContent,
  setDocumentContent,
  handleButtonClick,
  isWaitingForResponse,
  downloadContent,
  buttonPrompts,
}) {
  const [activeLearnButton, setActiveLearnButton] = useState(null);
  const [activeQuizButton, setActiveQuizButton] = useState(null);
  const [activeApplyButton, setActiveApplyButton] = useState(null);
  const [fileName, setFileName] = useState(null); // Add this line

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    let reader = new FileReader();

    reader.onloadend = async () => {
      const content = reader.result;
      let trimmedContent;

      if (fileExtension === "txt") {
        trimmedContent = content.slice(0, 33050);
      } else if (fileExtension === "docx") {
        try {
          const docxContent = await mammoth.extractRawText({
            arrayBuffer: content,
          });
          trimmedContent = docxContent.value.slice(0, 33050);
        } catch (error) {
          console.error("Error parsing docx:", error);
        }
      } else if (fileExtension === "pdf") {
        try {
          const pdf = await getDocument({ data: new Uint8Array(content) })
            .promise;
          let textContent = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map((item) => item.str).join(" ");
          }
          trimmedContent = textContent.slice(0, 33050);
        } catch (error) {
          console.error("Error parsing PDF:", error);
        }
      } else {
        console.error("Unsupported file format!");
        return;
      }

      setmyContent(trimmedContent);
      setDocumentContent(trimmedContent);
      setFileName(file.name);
    };

    reader.onerror = function (event) {
      console.error("File could not be read! Code " + event.target.error.code);
    };

    if (fileExtension === "txt") {
      reader.readAsText(file);
    } else if (fileExtension === "docx" || fileExtension === "pdf") {
      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    // Reset all active buttons when the mode changes
    setActiveLearnButton(null);
    setActiveQuizButton(null);
    setActiveApplyButton(null);
  }, [mode]);

  function ModeButton({ name, onClick, active, disabled, highlighted }) {
    return (
      <button
        className={`mode-button ${active ? "active" : ""} ${
          highlighted ? "highlighted" : ""
        }`}
        onClick={onClick}
        disabled={disabled || isWaitingForResponse} // Added isWaitingForResponse here
      >
        {name}
      </button>
    );
  }
  function ModeContainer({ mode, onButtonClick, active }) {
    const activeButton =
      mode === "Learn"
        ? activeLearnButton
        : mode === "Quiz"
        ? activeQuizButton
        : activeApplyButton;
    const setActiveButton =
      mode === "Learn"
        ? setActiveLearnButton
        : mode === "Quiz"
        ? setActiveQuizButton
        : setActiveApplyButton;

    const learnButtons = [
      "Create Summary",
      "List main topics",
      "Summarize main topics",
      "Create a slide deck",
    ];
    const quizButtons = [
      "Create multiple choice Q&A",
      "Create True/False Q&A",
      "Create open ended Q&A",
      "Create thought provoking questions",
    ];
    const applyButtons = [
      "How to apply this in my work",
      "Give examples based on this",
      "Create actionable steps",
      "Provide further learning material",
    ];

    let buttons;
    if (mode === "Learn") {
      buttons = learnButtons;
    } else if (mode === "Quiz") {
      buttons = quizButtons;
    } else if (mode === "Apply") {
      buttons = applyButtons;
    }

    return (
      <div className={`mode-container ${mode}`}>
        {buttons.map((button, index) => (
          <ModeButton
            key={index}
            name={button}
            active={activeButton === index}
            onClick={() => {
              setActiveButton(index);
              handleButtonClick(mode, buttonPrompts[button]);
            }}
            disabled={!active}
            highlighted={activeButton === index}
            isWaitingForResponse={isWaitingForResponse} // Added isWaitingForResponse here
          />
        ))}
      </div>
    );
  }
  return (
    <div className="left-pane">
      <h2 className="title-leftpane">Tool box</h2>

      <input
        className="upload-button"
        type="file"
        accept=".txt,.docx, .pdf"
        onChange={handleFileChange}
        style={{ margin: "10px 0" }}
      />
      {/* Display the file name */}
      <div className="filename">
        {"File Name:  "}
        {fileName}
      </div>
      <h3> Learn </h3>
      <ModeContainer
        mode="Learn"
        onButtonClick={handleButtonClick}
        active={mode === "Learn"}
        isWaitingForResponse={isWaitingForResponse}
      />
      <h3> Quiz </h3>

      <ModeContainer
        mode="Quiz"
        onButtonClick={handleButtonClick}
        active={mode === "Quiz"}
        isWaitingForResponse={isWaitingForResponse}
      />
      <h3> Apply </h3>

      <ModeContainer
        mode="Apply"
        onButtonClick={handleButtonClick}
        active={mode === "Apply"}
        isWaitingForResponse={isWaitingForResponse}
      />
      <Button className="download-button" onClick={downloadContent}>
        Download Session in Text file
      </Button>
    </div>
  );
}

export default Leftpane;
