import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Input,
  Error,
  Header,
  Bottom,
  SecondaryButton,
  SectionLeft,
  RodriBook,
  SectionRight,
} from "components/styled-components/styled";
import { FRONTEND_ENDPOINTS } from "config/constants";
import { login } from "context/userSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";

const Label = styled.label``;

const MarginLine = styled.div`
  height: 0.2px;
  width: 100%;
  border: 0.1px solid var(--light);
  margin: 50px 0 30px 0;
`;
const RegisterLink = styled(Link)`
  color: inherit;
  padding: 0 0 0 5px;
  letter-spacing: 1px;
  transition: 0.3s;
`;

export const Login = () => {
  const { error, loading } = useAppSelector((state) => state.user);
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
    <>
      <Container>
        <SectionLeft>
          <RodriBook>rodribook</RodriBook>
          <p>Connect with friends and the world around you on Facebook.</p>
        </SectionLeft>
        <SectionRight>
          <Form onSubmit={handleLogin}>
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
            <Input type="submit" value={loading ? "Loading..." : "Log In"} />
            <Error aria-live="assertive">{error}</Error>
            <MarginLine className="marginLine"></MarginLine>
            <SecondaryButton
              as="div"
              onClick={() => navigate(FRONTEND_ENDPOINTS.REGISTER)}
              id="abrirRegisterOverlay"
            >
              New account
            </SecondaryButton>

            <RegisterLink to={FRONTEND_ENDPOINTS.FORGOT + "#"}>
              Forgot your password?
            </RegisterLink>
          </Form>
          <div className="textoAdicional">
            <strong>Create a Page </strong>for a celebrity, brand or business.
          </div>
        </SectionRight>
      </Container>
    </>
  );
};
