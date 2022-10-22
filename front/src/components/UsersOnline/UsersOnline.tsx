import React from "react";

import UserOnlineItem, {
  disappearUserName,
  picHeight,
} from "./auxiliaries/UserOnlineItem";

import styled from "styled-components";
import { navHeight } from "components/Nav/Nav";
import { ScrollStyles } from "Global styles/Globalstyle";
export const widthSideChat = "300px";
//2 width, una p/
export const SideContainer = styled.div`
  background-color: pink;
  position: fixed;
  top: ${navHeight};
  left: 0;
  height: calc(100vh - ${navHeight});
  border: 1px solid yellow;

  width: ${widthSideChat};
  transition: 0.3s;
  @media (max-width: ${disappearUserName}) {
    width: calc(${picHeight} + 20px);
  }
`;

const UsersOnline = ({ users }: { users: UserNotNull[] }) => {
  return (
    <SideContainer className="CONTAINER SIDE CHAT">
      {users.length === 0 ? (
        <>"NO USERS ONLINE AT THE MOMENT"</>
      ) : (
        users.map((i) => {
          return <UserOnlineItem userOnline={i} />;
        })
      )}
    </SideContainer>
  );
};

export default UsersOnline;
