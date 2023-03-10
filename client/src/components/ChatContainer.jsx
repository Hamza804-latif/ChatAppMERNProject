import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getAllMsg, sendMessageRoute } from "../utils/APIs";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import Messages from "./Messages";
import { v4 } from "uuid";

const ChatContainer = ({ currentChat, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  const GetAllMessages = async () => {
    try {
      let { data } = await axios.post(getAllMsg, {
        from: currentUser._id,
        to: currentChat._id,
      });
      if (data.status === 200) {
        setMessages(data.data);
      } else {
        toast.error("something went wrong ");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    GetAllMessages();
  }, [currentChat]);
  const HandleSendMsg = async (msg) => {
    try {
      let { data } = await axios.post(sendMessageRoute, {
        from: currentUser?._id,
        to: currentChat._id,
        message: msg,
      });
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        msg,
      });
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
      if (data.status === 201) {
        toast.success("message sent");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("message receive", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);
  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat?.avatarImage}`}
              alt="profile"
            />
          </div>
          <div className="username">
            <h3>{currentChat?.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={v4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sender" : "recevier"
                }`}
              >
                <div className="content">
                  <p>{message?.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput HandleSendMsg={HandleSendMsg} />
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and(max-width:1024px) {
    grid-auto-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
    .sender {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recevier {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;

export default ChatContainer;
