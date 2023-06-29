import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

function Navbar({
  handleDoc,
  handleLearn,
  handleQuiz,
  handleApply,
  mode,
  loading,
  isWaitingForResponse,
  setmyContent,
  documentContent,
}) {
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState({
    name: "",
    background: "",
    objectives: "",
    other: "",

    // etc...
  });
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // handleAccount(settings);
    handleCloseModal();
  };

  const handleLinkClick = (e, handler) => {
    e.preventDefault();
    if (!loading) handler();
  };

  const handleRefDocumentClick = (e) => {
    e.preventDefault();
    if (!loading) {
      handleDoc();
      setmyContent(documentContent);
    }
  };

  return (
    <>
      <nav className="navbar">
        <a
          href="#"
          className="nav-item"
          onClick={(e) => {
            e.preventDefault();
            // handleHelp();
          }}
        >
          Help
        </a>
        <a
          href="#"
          className={`nav-item ${mode === "Doc" ? "active" : ""} ${
            isWaitingForResponse ? "link-disabled" : ""
          }`}
          onClick={handleRefDocumentClick}
        >
          Ref Document
        </a>
        <a
          href="#"
          className={`nav-item ${mode === "Learn" ? "active" : ""} ${
            isWaitingForResponse ? "link-disabled" : ""
          }`}
          onClick={(e) => handleLinkClick(e, handleLearn)}
        >
          Learn
        </a>
        <a
          href="#"
          className={`nav-item ${mode === "Quiz" ? "active" : ""} ${
            isWaitingForResponse ? "link-disabled" : ""
          }`}
          onClick={(e) => handleLinkClick(e, handleQuiz)}
        >
          Quiz
        </a>

        <a
          href="#"
          className={`nav-item ${mode === "Apply" ? "active" : ""} ${
            isWaitingForResponse ? "link-disabled" : ""
          }`}
          onClick={(e) => handleLinkClick(e, handleApply)}
        >
          Apply
        </a>

        <a
          href="#"
          className="nav-item"
          onClick={(e) => {
            e.preventDefault();
            handleOpenModal();
          }}
        >
          Account
        </a>
      </nav>
      <Modal
        className="account-modal"
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <div>
            <Modal.Title>Account Settings</Modal.Title>
            <p></p>
          </div>{" "}
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group>
              {/* <Form.Label>Name</Form.Label> */}
              {/* <Form.Control
                type="text"
                name="name"
                value={settings.name}
                onChange={handleChange}
                className="expandable-input"
              /> */}
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Brief background in few lines (education, profession, work
                experience, hobbies/interests, etc.).
              </Form.Label>
              <Form.Control
                as="textarea"
                name="background"
                value={settings.background}
                onChange={handleChange}
                className="expandable-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Learning objectives (personal/career goals){" "}
              </Form.Label>
              <Form.Control
                as="textarea"
                name="objectives"
                value={settings.objectives}
                onChange={handleChange}
                className="expandable-input"
              />
            </Form.Group>
            {/* <Form.Group>
              <Form.Label>Other Interests</Form.Label>
              <Form.Control
                as="textarea"
                name="other"
                value={settings.other}
                onChange={handleChange}
                className="expandable-input"
              />
            </Form.Group> */}
            {/* Add more form groups as needed... */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default Navbar;
