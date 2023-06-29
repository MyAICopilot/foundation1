import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import "../styles/Content.css";

function Content({
  myContent,
  setmyContent,
  courseData,
  activeCourse,
  activeTopic,
  mode,
}) {
  useEffect(() => {
    setmyContent("");
  }, [mode]);

  // Generate title
  const title =
    activeCourse !== null && activeTopic !== null
      ? `${courseData[activeCourse].name} > ${courseData[activeCourse].topics[activeTopic]}`
      : "";

  return (
    <div className="content-pane">
      <h1 className="content-title">{title}</h1>
      <ReactMarkdown>{myContent}</ReactMarkdown>
    </div>
  );
}

export default Content;
