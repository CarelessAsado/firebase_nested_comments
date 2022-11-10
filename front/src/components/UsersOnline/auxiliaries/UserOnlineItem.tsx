import React from "react";
import { BiUser } from "react-icons/bi";
import styled from "styled-components";

export const disappearUserName = "730px";
export const HoverInfo = styled.div`
  display: none;
  position: absolute;
  top: 0;
  left: 100%;
  bottom: 0;
  align-items: center;
  gap: 5px;
  padding: 5px;
  &:hover {
    display: flex;
  }
`;

const ContainerItem = styled.div`
  display: flex;

  align-items: center;
  gap: 10px;
  font-size: var(--fontMed);
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  padding: 10px;
  cursor: pointer;
  position: relative;
  width: 100%;
  @media (max-width: ${disappearUserName}) {
    justify-content: center;
    &:hover ${HoverInfo} {
      display: flex;
    }
  }
`;

export const picHeight = "40px";
export const ProfilePic = styled.img`
  min-width: ${picHeight};
  min-height: ${picHeight};
  height: ${picHeight};
  width: ${picHeight};
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid white;
`;
const NoProfilePic = styled.div`
  min-width: ${picHeight};
  height: ${picHeight};
  display: grid;
  place-items: center;
  border-radius: 50%;
  background-color: var(--mainGray);
  & svg {
    height: calc(100% - 10px);
    width: 100%;
  }
`;
export const NoPicOrPicUserImage = ({
  img,
}: {
  img: string | null | undefined;
}) => {
  {
    return img ? (
      <ProfilePic src={img}></ProfilePic>
    ) : (
      <NoProfilePic>
        <BiUser />
      </NoProfilePic>
    );
  }
};
const UserNameText = styled.span`
  @media (max-width: ${disappearUserName}) {
    display: none;
  }
`;
const UserOnlineItem = ({ userOnline }: { userOnline: UserNotNull }) => {
  return (
    <>
      <ContainerItem>
        {userOnline.img ? (
          <ProfilePic src={userOnline.img}></ProfilePic>
        ) : (
          <NoProfilePic>
            <BiUser />
          </NoProfilePic>
        )}
        <UserNameText>{userOnline.username}</UserNameText>
        <HoverInfo>
          <span>{userOnline.username}</span>
        </HoverInfo>
      </ContainerItem>
    </>
  );
};

export default UserOnlineItem;
