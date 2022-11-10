import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { AiOutlineSend } from "react-icons/ai";

export const commentContainerBaseStyles = css`
  padding: 10px;
  border-radius: 5px;
  background-color: var(--fbMessageBody);
  color: var(--mainWhite);
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
`;

export const Input = styled.input`
  padding: 10px;

  border: none;
  outline: none;
  border-radius: 5px;
  font-size: inherit;
  width: 100%;
  border-radius: 8px;
  color: var(--mainWhite);
  background-color: var(--fb3erBody);
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

/* ----------------------------------------------------- */

export const FormSubmitNewSubComment = styled.form`
  display: flex;
  gap: 5px;
  align-items: center;
`;
export const AddNewComment = styled.button`
  background-color: inherit;
  color: inherit;
  cursor: pointer;
  font-size: var(--fontMed);
`;

export const SendButton = () => {
  return (
    <AddNewComment>
      <AiOutlineSend />
    </AddNewComment>
  );
};
