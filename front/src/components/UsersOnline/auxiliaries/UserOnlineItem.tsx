import React from "react";
import { BiUser } from "react-icons/bi";
import styled from "styled-components";

const ContainerItem = styled.div`
  display: flex;

  align-items: center;
  gap: 5px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  padding: 10px;
  cursor: pointer;
`;
const picHeight = "70px";
const ProfilePic = styled.img`
  width: ${picHeight};
  height: ${picHeight};
  border-radius: 50%;
  object-fit: cover;
`;
const NoProfilePic = styled.div`
  width: ${picHeight};
  height: ${picHeight};
  border-radius: 50%;
  background-color: #cfc9c9;
  & svg {
    height: calc(100% - 10px);
    width: 100%;
  }
`;
const UserOnlineItem = ({ userOnline }: { userOnline: UserNotNull }) => {
  return (
    <ContainerItem>
      {userOnline.img ? (
        <ProfilePic src={userOnline.img}></ProfilePic>
      ) : (
        <NoProfilePic>
          <BiUser />
        </NoProfilePic>
      )}
      {userOnline.username}
    </ContainerItem>
  );
};

export default UserOnlineItem;
