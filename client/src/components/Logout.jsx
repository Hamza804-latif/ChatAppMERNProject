import React from "react";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Logout = () => {
  const navigate = useNavigate();
  const HandleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Button onClick={HandleLogout}>
      <BiLogOut />
    </Button>
  );
};

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
export default Logout;
