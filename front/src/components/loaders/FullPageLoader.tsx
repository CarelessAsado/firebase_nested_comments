import React from "react";
import Spinner from "./loader";

import styled from "styled-components";
export const FullPage = styled.div`
  height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
`;

const FullPageLoader = () => {
  return (
    <FullPage>
      <Spinner color={"var(--mainGray)"}></Spinner>
    </FullPage>
  );
};

export default FullPageLoader;
