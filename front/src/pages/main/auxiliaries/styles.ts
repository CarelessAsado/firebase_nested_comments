import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

export const commentContainerBaseStyles = css`
  padding: 10px;
  border-radius: 5px;
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
export const GrowFlex1 = styled(Link)`
  flex: 1;
  display: flex;
  gap: 7px;
  align-items: center;
`;

export const Top = styled.div`
  display: flex;
  align-items: center;
`;

export const Value = styled.div`
  font-size: var(--fontMed);
  padding: 5px 0;
`;

export const Input = styled.input`
  padding: 10px;

  border: 1px solid black;
  border-radius: 5px;
  font-size: inherit;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const Button = styled.button`
  cursor: pointer;
  padding: 10px;
  color: inherit;
  background-color: var(--mainBlue);
  border-radius: 5px;
`;
