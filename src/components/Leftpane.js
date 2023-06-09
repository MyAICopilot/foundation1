import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import "../styles/Leftpane.css";

function Leftpane({ courseData, onTopicClick }) {
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState([]); // Add this state

  // const handleCourseClick = (courseIndex) => {
  //   // If the course being clicked is currently active, set the active course to null
  //   // Otherwise, set the active course to the course being clicked
  //   setActiveCourse(activeCourse === courseIndex ? null : courseIndex);
  //   setActiveTopic(null);
  // };

  const handleCourseClick = (courseIndex) => {
    setActiveCourse(courseIndex);
    setActiveTopic(null);

    // Handle the expanded courses
    if (expandedCourses.includes(courseIndex)) {
      // If the course is already in the array, remove it
      setExpandedCourses(
        expandedCourses.filter((index) => index !== courseIndex)
      );
    } else {
      // Otherwise, add it to the array
      setExpandedCourses([...expandedCourses, courseIndex]);
    }
  };

  const handleTopicClick = (courseIndex, topicIndex) => {
    setActiveCourse(courseIndex); // Set the course as active
    setActiveTopic(topicIndex);
    onTopicClick(courseIndex, topicIndex);
  };

  return (
    <div className="left-pane">
      <h2 className="title-leftpane">Courses</h2>
      {courseData.map((course, courseIndex) => (
        <div className="course" key={courseIndex}>
          <h3 onClick={() => handleCourseClick(courseIndex)}>
            <FontAwesomeIcon
              icon={
                expandedCourses.includes(courseIndex)
                  ? faChevronUp
                  : faChevronDown
              }
            />{" "}
            {course.name}{" "}
          </h3>
          <Collapse isOpened={expandedCourses.includes(courseIndex)}>
            {course.topics.map((topic, topicIndex) => (
              <div
                key={topicIndex}
                className={
                  activeTopic === topicIndex && activeCourse === courseIndex
                    ? "active-topic topic"
                    : "topic"
                }
                onClick={() => handleTopicClick(courseIndex, topicIndex)}
              >
                {topic}
              </div>
            ))}
          </Collapse>
        </div>
      ))}
    </div>
  );
}

export default Leftpane;
