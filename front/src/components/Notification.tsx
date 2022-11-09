import React from "react";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { showOrCloseNotification } from "context/generalSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";

interface StyleProps {
  show: string;
}
export const ContainerNot = styled.div<StyleProps>`
  z-index: 1000;
  max-width: 300px;
  position: fixed;
  left: 15%;
  right: 0;
  bottom: 5%;
  transition: 0.3s;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  transform: ${(props) => !props.show && "translateX(-1000vw)"};
  background-color: var(--fbBody);
  color: var(--mainWhite);
  border: 1px solid var(--fb3erBody);
  @media (max-width: 500px) {
    max-width: calc(100% - 20px);
    left: 10px;
    bottom: 30vh;
  }
`;
export const ReactIconClose = styled.div`
  border-radius: 50%;
  cursor: pointer;
  border: 1px solid var(--fb3erBody);
  font-size: var(--fontSmall);
  padding: 10px;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${(props) => props.theme.secondaryText};
  }
`;
export const Texto = styled.div`
  flex: 1;
  font-size: var(--fontSmall);
`;
export const Notification = () => {
  const { notification } = useAppSelector((state) => state.general);
  const dispatch = useAppDispatch();
  return (
    <ContainerNot show={notification}>
      <Texto>{notification}</Texto>
      <ReactIconClose
        onClick={() => {
          dispatch(showOrCloseNotification(""));
        }}
      >
        <AiOutlineClose />
      </ReactIconClose>
    </ContainerNot>
  );
};
