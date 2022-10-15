import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  Container,
  Input,
  Form,
  Error,
  Bottom,
  Header,
} from "components/styled-components/styled";

import { FRONTEND_ENDPOINTS } from "config/constants";
import { forgotPwd } from "context/userSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { dispatchNotification } from "config/utils/dispatchNotification";

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

export const ForgotPwd = () => {
  const { error, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await dispatch(forgotPwd(email)).unwrap();
      dispatchNotification(
        dispatch,
        "Check your inbox to finish the password change."
      );
    } catch (error) {}
  }

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Header>¿Te olvidaste tu contraseña?</Header>
        <Error error={error} aria-live="assertive">
          {error}
        </Error>
        <Label htmlFor="email"></Label>
        <Input
          autoFocus
          type="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email *"
          id="email"
        ></Input>
        <Label htmlFor="email"></Label>

        <Input type="submit" value={loading ? "Loading..." : "Submit"}></Input>
        <Bottom>
          We will send you an email. Follow the steps therein and you will be
          able to recover your account.
          <br />
          <br />
          <RegisterLink to={`${FRONTEND_ENDPOINTS.LOGIN}#`}>
            Go back to login.
          </RegisterLink>
        </Bottom>
      </Form>
    </Container>
  );
};
