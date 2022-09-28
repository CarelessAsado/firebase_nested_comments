import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Input,
  Form,
  Error,
  Bottom,
  Header,
} from "components/styled-components/styled";

import { FRONTEND_ENDPOINTS } from "config/constants";
import { register } from "context/userSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";

const Label = styled.label``;

const RegisterLink = styled(Link)`
  color: inherit;
  padding: 0 0 0 5px;
  letter-spacing: 1px;
  transition: 0.3s;
  &:hover {
    color: #0a1722;
  }
`;

export const Register = () => {
  const navigate = useNavigate();

  const { error, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [registerInput, setregisterInput] = useState<IRegisterInput>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const changeReginInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setregisterInput({ ...registerInput, [name]: e.target.value });
  };

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    /* IF REGISTRATION IS SUCCESSFUL IT RETURNS TRUE */
    dispatch(register(registerInput))
      .unwrap()
      .then(() => navigate(FRONTEND_ENDPOINTS.LOGIN))
      .catch(() => {}); //pevitar uncaught in promise en el browser log
  }
  return (
    <Container>
      <Form onSubmit={handleRegister}>
        <Header>Create new account.</Header>
        <Error error={error} aria-live="assertive">
          {error}
        </Error>
        <Label htmlFor="username"></Label>
        <Input
          autoFocus
          type="text"
          name="username"
          onChange={changeReginInput}
          placeholder="Username *"
          id="username"
        ></Input>
        <Label htmlFor="email"></Label>
        <Input
          type="text"
          name="email"
          onChange={changeReginInput}
          placeholder="Email *"
          id="email"
        ></Input>
        <Label htmlFor="password"></Label>
        <Input
          type="password"
          name="password"
          onChange={changeReginInput}
          placeholder="Password *"
          id="password"
        ></Input>
        <Label htmlFor="Confirmpassword"></Label>
        <Input
          type="password"
          name="confirmPassword"
          onChange={changeReginInput}
          placeholder="Confirm password *"
          id="Confirmpassword"
        ></Input>
        <Input type="submit" value={loading ? "Loading..." : "Submit"}></Input>
        <Bottom>
          Already have an account?
          <RegisterLink to={FRONTEND_ENDPOINTS.LOGIN}>
            Log in here.
          </RegisterLink>{" "}
        </Bottom>
      </Form>
    </Container>
  );
};
