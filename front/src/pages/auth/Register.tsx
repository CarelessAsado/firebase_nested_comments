import React, { useRef, useState } from "react";
import { useTareasGlobalContext } from "hooks/useTareasGlobalContext";
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
import { useResetErrors } from "hooks/useResetErrors";
import { FRONTEND_ENDPOINTS } from "config/constants";

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
  const errorAssert = useRef() as React.MutableRefObject<HTMLDivElement>;
  const { register, error, loading } = useTareasGlobalContext();
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
  useResetErrors();
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    /* IF REGISTRATION IS SUCCESSFUL IT RETURNS TRUE */
    if (await register(registerInput)) {
      navigate(FRONTEND_ENDPOINTS.LOGIN);
    }
  }
  return (
    <Container>
      <Form onSubmit={handleRegister}>
        <Header>Login to your account.</Header>
        <Error error={error} ref={errorAssert} aria-live="assertive">
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
