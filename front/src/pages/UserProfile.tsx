import styled from "styled-components";
import { Link } from "react-router-dom";
const Error = styled.div`
  color: crimson;
  font-size: 1.5rem;
  padding: 50px 10px 10px 50px;
  margin-top: 200px;
`;
const Bold = styled.div`
  font-weight: bold;
`;
const HomeLink = styled(Link)`
  color: #2775a8;
  font-size: 1.5rem;
  padding: 50px 10px 10px 50px;
  margin-top: 200px;
  transition: 0.5s;
  &:hover {
    font-weight: bold;
  }
`;
export const UserProfile = () => {
  return (
    <>
      <Error>
        Still in development. Soon you will be able to view and modify your
        profile.<Bold>We are sorry for the inconvenience</Bold>
      </Error>
      <HomeLink to="/">Back to home</HomeLink>
    </>
  );
};
