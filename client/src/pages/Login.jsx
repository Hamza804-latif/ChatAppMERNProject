import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import { toast } from "react-toastify";
import axios from "axios";
import { loginRoute } from "../utils/APIs";

const Login = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, [navigate]);
  const HandleSubmit = async (event) => {
    event.preventDefault();
    if (HandleValidation()) {
      const { username, password } = values;
      try {
        const { data } = await axios.post(loginRoute, {
          username,
          password,
        });
        if (data?.status === 200) {
          toast.success(data?.msg, toastOptions);
          localStorage.setItem("chat-app-user", JSON.stringify(data?.data));
          navigate("/");
        }
        if (data?.status === 401) {
          toast.error(data?.msg, toastOptions);
        }
      } catch (error) {
        toast.error(error.message, toastOptions);
      }
    }
  };
  const HandleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const HandleValidation = () => {
    const { username, password } = values;
    if (!username || !password) {
      toast.error("Please fill all fields", toastOptions);
      return false;
    }

    return true;
  };
  return (
    <>
      <FormContainer>
        <form onSubmit={HandleSubmit}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Chat Me</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => HandleChange(e)}
            min="3"
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => HandleChange(e)}
          />

          <button type="submit">Login</button>
          <span>
            Dont have an account? <Link to="/register">Register</Link>
          </span>
        </form>
      </FormContainer>
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      font-size: 1rem;
      width: 100%;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button {
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
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        font-weight: bold;
        text-decoration: none;
      }
    }
  }
`;

export default Login;
