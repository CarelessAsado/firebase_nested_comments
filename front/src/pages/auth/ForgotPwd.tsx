import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  ContainerNotLogin,
  Input,
  Form,
  Error,
  Bottom,
  Header,
} from "components/styled-components/styled";

import { FRONTEND_ENDPOINTS } from "config/constants";
import { forgotPwd } from "context/userSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { dispatchNotification } from "config/utilsFns/dispatchNotification";

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
    !email && dispatchNotification(dispatch, "You must provide your email.");
    try {
      await dispatch(forgotPwd(email)).unwrap();
      dispatchNotification(
        dispatch,
        "Check your inbox to finish the password change. The email might be in your spam box"
      );
      setEmail("");
    } catch (error) {}
  }

  return (
    <ContainerNotLogin>
      <Form onSubmit={handleSubmit}>
        <Header>Forgot your password?</Header>
        <Error aria-live="assertive">{error}</Error>
        <Label htmlFor="email"></Label>
        <Input
          autoFocus
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Email *"
          id="email"
        ></Input>
        <Label htmlFor="email"></Label>

        <Input
          className="main"
          type="submit"
          value={loading ? "Loading..." : "Submit"}
        ></Input>
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
    </ContainerNotLogin>
  );
};
