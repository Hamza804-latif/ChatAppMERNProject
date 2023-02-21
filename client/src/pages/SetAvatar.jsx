import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Buffer } from "buffer";
import Loader from "../assets/loader.gif";
import { setAvatar } from "../utils/APIs";

const SetAvatar = () => {
  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatars, setSelecedAvatars] = useState(null);
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, [navigate]);
  const setProfilePicture = async () => {
    if (!selectedAvatars) {
      return toast.error("Please select profile picture", toastOptions);
    } else {
      try {
        const user = await JSON.parse(localStorage.getItem("chat-app-user"));
        if (user) {
          const { data } = await axios.post(`${setAvatar}/${user._id}`, {
            image: avatars[selectedAvatars],
          });
          if (data.status === 201) {
            toast.success(data.msg, toastOptions);
            user.isAvatarImageSet = true;
            user.avatarImage = data.data.image;
            localStorage.setItem("chat-app-user", JSON.stringify(user));
            navigate("/");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        return toast.error(error.response.msg, toastOptions);
      }
    }
  };

  const GetRandomAvatars = async () => {
    let data = [];
    for (let i = 0; i <= 4; i++) {
      try {
        let image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );

        let buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      } catch (error) {
        setIsLoading(false);
        return toast.error(error?.response?.data, toastOptions);
      }
    }
    setAvatars(data);
    setIsLoading(false);
  };

  useEffect(() => {
    GetRandomAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <img src={Loader} alt="Loading" className="loader" />
      ) : (
        <Container>
          <div className="title-container">
            <h1>Please select an avatar for your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars?.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatars === index ? "selected" : ""
                  }`}
                  key={index}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelecedAvatars(index)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
export default SetAvatar;
