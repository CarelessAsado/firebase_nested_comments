import { useState } from "react";

import UserOnlineItem, {
  disappearUserName,
  picHeight,
} from "./auxiliaries/UserOnlineItem";

import styled from "styled-components";
import { navHeight } from "components/Nav/Nav";
import { ScrollStyles } from "Global styles/Globalstyle";
import { AiFillWechat } from "react-icons/ai";
export const widthSideChat = "300px";
//2 width, una p/
interface SideContProps {
  openChat: boolean;
}
export const SideContainer = styled.div<SideContProps>`
  background-color: pink;
  position: fixed;
  top: ${navHeight};
  left: 0;
  height: calc(100vh - ${navHeight});
  border: 1px solid yellow;
  transform: ${(props) => !props.openChat && "translateX(-100%)"};
  width: ${widthSideChat};
  transition: 0.3s;
  @media (max-width: ${disappearUserName}) {
    width: calc(${picHeight} + 20px);
  }
`;
export const SolapaChat = styled.div`
  position: absolute;
  left: 100%;
  top: 0;
  padding: 10px;
  background-color: white;
  border: 1px solid grey;
  cursor: pointer;
`;

const UsersOnline = ({ users }: { users: UserNotNull[] }) => {
  const [openChat, setOpenChat] = useState(false);
  return (
    <SideContainer className="CONTAINER SIDE CHAT" openChat={openChat}>
      {users.length === 0 ? (
        <>"NO USERS ONLINE AT THE MOMENT"</>
      ) : (
        users.map((i) => {
          return <UserOnlineItem userOnline={i} />;
        })
      )}
      <SolapaChat onClick={() => setOpenChat((v) => !v)}>
        <AiFillWechat />
      </SolapaChat>
      {users.length === 0 && "blabla"}
    </SideContainer>
  );
};

export default UsersOnline;
