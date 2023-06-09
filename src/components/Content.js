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
  // const [content, setContent] = useState("");

  useEffect(() => {
    if (activeCourse !== null && activeTopic !== null) {
      // const url = `/courses/${courseData[activeCourse].name}/${
      //   courseData[activeCourse].topics[activeTopic]
      // }/${mode.toLowerCase()}.md`;
      const url = `${process.env.PUBLIC_URL}/courses/${
        courseData[activeCourse].name
      }/${
        courseData[activeCourse].topics[activeTopic]
      }/${mode.toLowerCase()}.md`;

      console.log(url);

      fetch(url)
        .then((response) => response.text())
        .then((text) => setmyContent(text))
        .catch((err) => console.log(err));
    }
  }, [activeCourse, activeTopic, mode]);

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
