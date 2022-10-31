import { useState } from "react";

import UserOnlineItem, {
  disappearUserName,
  picHeight,
} from "./auxiliaries/UserOnlineItem";

import styled from "styled-components";
import { navHeight } from "components/Nav/Nav";
import { ScrollStyles } from "Global styles/Globalstyle";
import { AiFillWechat, AiOutlineCloseCircle } from "react-icons/ai";
export const widthSideChat = "300px";
//2 width, una p/
interface SideContProps {
  openChat: boolean;
}
export const SideContainer = styled.div<SideContProps>`
  position: fixed;
  top: ${navHeight};
  left: 0;
  height: calc(100vh - ${navHeight});
  transform: ${(props) => !props.openChat && "translateX(-100%)"};
  width: ${widthSideChat};
  transition: 0.3s;
  @media (max-width: ${disappearUserName}) {
    width: calc(${picHeight} + 20px);
  }
`;
export const SolapaChat = styled.div<SideContProps>`
  position: absolute;
  left: 100%;
  top: 0;
  padding: 10px;
  background-color: white;
  border: 1px solid grey;
  cursor: pointer;
  display: ${(props) => props.openChat && "none"};
`;

export const CloseTab = styled.span`
  padding: 10px;
  display: inline-flexbox;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  float: right;
  & > * {
    font-size: var(--fontMed);
  }
  @media (max-width: ${disappearUserName}) {
    width: 100%;
    display: grid;
    place-items: center;
  }
`;
const UsersOnline = ({
  users,
  setOpenChat,
  openChat,
}: {
  users: UserNotNull[];
  setOpenChat: () => void;
  openChat: boolean;
}) => {
  return (
    <SideContainer className="CONTAINER SIDE CHAT" openChat={openChat}>
      <div>
        <CloseTab onClick={() => setOpenChat()}>
          <AiOutlineCloseCircle />
        </CloseTab>
      </div>
      {users.length === 0 ? (
        <>"NO USERS ONLINE AT THE MOMENT"</>
      ) : (
        users.map((i) => {
          return <UserOnlineItem userOnline={i} />;
        })
      )}
      <SolapaChat openChat={openChat} onClick={() => setOpenChat()}>
        <AiFillWechat />
      </SolapaChat>
      {users.length === 0 && "blabla"}
    </SideContainer>
  );
};

export default UsersOnline;
