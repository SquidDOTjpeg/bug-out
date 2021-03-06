import React, { useState, useEffect } from "react";
import BugBox from "../components/BugBox/BugBox";
import Nav from "../components/Nav/Nav";
import InProgress from "../components/InProgress/InProgress";
import Completed from "../components/Completed/Completed";
// import NeedHelp from "../components/NeedHelp/NeedHelp";
import BugCard from "../components/BugCards/BugCards";
import ModalBox from "../components/ModalBox/ModalBox";
// import BugName from "../components/BugName/BugName";
import API from "../utils/API";
// import Image from "../assets/images/1iwcit1gidyy.jpg";
// import BugCards from "../components/BugCards/BugCards";
import UpdateModalBtn from "../components/UpdateModalBtn/UpdateModalBtn";
import { Input, TextArea, FormBtn } from "../components/Form/Form";
import "./dragula.css";
import "./app.css";
import dragula from "react-dragula";
import axios from "axios";
import SubmitModal from "../components/SubmitModal/SubmitModal";
import DeleteBtn from "../components/DeleteBtn/DeleteBtn";
import BugInfo from "../components/BugInfo/BugInfo";

function Test() {
  const data = JSON.parse(localStorage.getItem("data"));
  const [bugs, setBugs] = useState([]);
  const [formObject, setFormObject] = useState({});
  const [submitModalState, setSubmitModalState] = useState({});
  const [editModalState, setEditModalState] = useState({});
  const [editModalInfo, setEditModalInfo] = useState({});

  useEffect(() => {
    setSubmitModalState("hide");
    setEditModalState("hide");
    loadBugs();
    var first = "#first";
    var second = "#second";
    var third = "#third";

    var containers = [
      document.querySelector(first),
      document.querySelector(second),
      document.querySelector(third),
    ];

    var drake = dragula(containers);
    drake.on("drop", (el, target) => {
      if (target === document.querySelector(first)) {
        API.updateBug(el.id, {
          inProgress: false,
          completed: false,
        });
      } else if (target === document.querySelector(second)) {
        API.updateBug(el.id, {
          inProgress: true,
          completed: false,
        }).then((res) => {
          console.log(res.data);
        });
      } else if (target === document.querySelector(third)) {
        API.updateBug(el.id, {
          inProgress: false,
          completed: true,
        });
      }
    });
  }, []);

  function loadBugs() {
    API.getBugs()
      .then((res) => {
        console.log(res.data);
        setBugs(res.data);
      })
      .catch((err) => console.log(err));
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormObject({ ...formObject, [name]: value });
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (formObject.author && formObject.title && formObject.description) {
      API.saveBug({
        title: formObject.title,
        author: formObject.author,
        description: formObject.description,
        projectID: data.user._id,
      })
        .then((res) => loadBugs())
        .catch((err) => console.log(err));
    } else alert("Please fill out all inputs");

    toggleSubmitModal();
  }

  function handleFormUpdate(event) {
    event.preventDefault();
    if (formObject.assigned || formObject.description) {
      API.updateBug(editModalInfo._id, {
        assigned: formObject.assigned,
        description: formObject.description,
      })
        .then((res) => loadBugs())
        .catch((err) => console.log(err));
    } else alert("Please fill out all inputs");
    toggleEditModal();
  }
  function deleteBug() {
    console.log(editModalInfo);
    API.deleteBug(editModalInfo._id)
      .then((res) => {
        loadBugs();
        toggleEditModal();
      })
      .catch((err) => console.log(err));
  }

  let notAssigned = [];
  let inProgress = [];
  let completed = [];
  let projectID = [];

  function main() {
    for (let i = 0; i <= bugs.length; i++) {
      if (bugs[i] != null) {
        if (bugs[i].projectID === data.user._id) {
          if (bugs[i].completed === true) {
            completed.push(bugs[i]);
            continue;
          } else if (bugs[i].inProgress === true) {
            inProgress.push(bugs[i]);
            continue;
          } else if (bugs[i].inProgress === false) {
            notAssigned.push(bugs[i]);
            continue;
          } else if (bugs[i].projectID !== projectID) {
            continue;
          }
          continue;
        }
      }
      continue;
    }
  }

  main();

  function toggleSubmitModal() {
    if (submitModalState === "hide") {
      setSubmitModalState("show");
    } else {
      setSubmitModalState("hide");
    }
  }

  function toggleEditModal() {
    if (editModalState === "hide") {
      setEditModalState("show");
    } else {
      setEditModalState("hide");
    }
  }

  function getEditModalInfo(id) {
    API.getBug(id).then((res) => {
      console.log(res.data);
      setEditModalInfo(res.data);
    });
  }

  return (
    <div
      className="row justify-content-md-center"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div className="col-8 ">
        <Nav></Nav>

        <UpdateModalBtn wasd={toggleSubmitModal} />

        <div className="row">
          <div className="col-lg-4 col-sm-10">
            <BugBox>
              <BugCard
                bugs={notAssigned}
                wasd={toggleEditModal}
                getEditModalInfo={getEditModalInfo}
                id="first"
              />
            </BugBox>
          </div>
          <div className="col-lg-4 col-sm-10">
            <InProgress>
              <BugCard
                bugs={inProgress}
                wasd={toggleEditModal}
                getEditModalInfo={getEditModalInfo}
                id="second"
              />
            </InProgress>
          </div>
          <div className="col-lg-4 col-sm-10">
            <Completed>
              <BugCard
                bugs={completed}
                wasd={toggleEditModal}
                getEditModalInfo={getEditModalInfo}
                id="third"
              />
            </Completed>
          </div>
        </div>

        <ModalBox
          modalState={submitModalState}
          close={toggleSubmitModal}
          className="row"
          id="newBug"
        >
          <form>
            <p className="form-text">Bug Name:</p>
            <Input
              onChange={handleInputChange}
              name="title"
              placeholder="Bug Name (required)"
              className="form"
              style={{
                height: "25px",
                width: "200px",
              }}
            />
            <p className="form-text">Submitted By:</p>
            <Input
              onChange={handleInputChange}
              name="author"
              placeholder="Submitted By (required)"
              className="form"
              style={{
                height: "25px",
                width: "200px",
              }}
            />
            <p className="form-text">Bug Description:</p>
            <TextArea
              onChange={handleInputChange}
              name="description"
              placeholder="Description (required)"
              className="form"
              style={{
                height: "150px",
                width: "300px",
              }}
            />

            <FormBtn
              style={{ cursor: "pointer" }}
              className="submitBtn"
              onClick={handleFormSubmit}
            >
              Submit Bug
            </FormBtn>
          </form>
        </ModalBox>

        <ModalBox
          modalState={editModalState}
          close={toggleEditModal}
          className="row"
          id="newBug"
        >
          <form>
            <p className="form-text">
              Bug Name: <span className="nameFont">{editModalInfo.title}</span>
            </p>

            <p className="form-text bugName">
              Submitted By:{" "}
              <span className="nameFont">{editModalInfo.author}</span>
            </p>

            <p className="form-text">Assigned To:</p>
            <Input
              onChange={handleInputChange}
              name="assigned"
              placeholder={editModalInfo.assigned}
              className="form"
              style={{
                height: "25px",
                width: "200px",
              }}
            />
            <p className="form-text">Bug Description:</p>
            <TextArea
              onChange={handleInputChange}
              name="description"
              placeholder={editModalInfo.description}
              className="form"
              style={{
                height: "150px",
                width: "300px",
              }}
            />

            <FormBtn
              style={{ cursor: "pointer" }}
              className="submitBtn"
              id="updateBug"
              onClick={handleFormUpdate}
            >
              Update Bug
            </FormBtn>
            <DeleteBtn delete={deleteBug} />
          </form>
        </ModalBox>
      </div>
    </div>
  );
}

export default Test;
