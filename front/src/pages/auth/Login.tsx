import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Input,
  Error,
  Bottom,
  Header,
} from "components/styled-components/styled";

import { FRONTEND_ENDPOINTS } from "config/constants";
import { login } from "context/userSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";

const SuccessRegister = styled(Error)`
  color: green;
`;
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

export const Login = () => {
  const { error, successRegister, loading } = useAppSelector(
    (state) => state.user
  );
  const [loginInput, setLoginInput] = useState<ILoginInput>({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const changeLoginInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setLoginInput({ ...loginInput, [name]: e.target.value });
  };

  const navigate = useNavigate();
  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(login(loginInput))
      .unwrap() //hacer el navigate automatico con el expel user q tengo guardado
      .then(() => navigate(FRONTEND_ENDPOINTS.HOME))
      .catch(() => {}); //pevitar uncaught in promise en el browser log
  }
  return (
    <Container>
      <Form onSubmit={handleLogin}>
        <Header>Login to your account.</Header>
        <Error error={error} aria-live="assertive">
          {error}
        </Error>
        <SuccessRegister error={successRegister}>
          {successRegister}
        </SuccessRegister>
        <Label htmlFor="email"></Label>
        <Input
          autoFocus
          type="text"
          name="email"
          onChange={changeLoginInput}
          placeholder="Email *"
          id="email"
        ></Input>
        <Label htmlFor="password"></Label>
        <Input
          type="password"
          name="password"
          onChange={changeLoginInput}
          placeholder="Password *"
          id="password"
        ></Input>
        <Input type="submit" value={loading ? "Loading..." : "Submit"}></Input>
        <Bottom>
          No account yet?
          <RegisterLink to={FRONTEND_ENDPOINTS.REGISTER}>
            Register here.
          </RegisterLink>{" "}
        </Bottom>
      </Form>
    </Container>
  );
};
