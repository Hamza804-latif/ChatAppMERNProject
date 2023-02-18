import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import Contacts from "../components/Contacts";
import { allUsers } from "../utils/APIs";

const Chat = () => {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    } else {
      GetCurrentUser();
    }
  }, []);
  useEffect(() => {
    GetContacts();
  }, []);
  const GetContacts = async () => {
    console.log("get con");
    console.log("curr", currentUser);

    if (currentUser) {
      if (currentUser?.isAvatarImageSet) {
        try {
          const { data } = await axios.get(`${allUsers}/${currentUser?._id}`);
          console.log("data", data);
        } catch (error) {
          return toast.error(error.message);
        }
      } else {
        navigate("/setAvatar");
      }
    }
  };
  const GetCurrentUser = async () => {
    let local = await JSON.parse(localStorage.getItem("chat-app-user"));
    console.log("get curr", local);
    setCurrentUser(local);
  };
  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} />
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and(max-width:1024px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
