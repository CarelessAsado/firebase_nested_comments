import { FRONTEND_ENDPOINTS } from "config/constants";
import { BiUser } from "react-icons/bi";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const disappearUserName = "730px";
const HoverInfo = styled.div`
  display: none;
  position: absolute;
  top: 0;
  left: 100%;
  bottom: 0;
  align-items: center;
  gap: 5px;
  padding: 5px;
  background-color: var(--mainSolapa);
  color: var(--fbBody);
  &:hover {
    display: flex;
  }
`;

const ContainerItem = styled(Link)`
  display: flex;

  align-items: center;
  gap: 10px;
  font-size: var(--fontMed);

  &:nth-child(even) {
    background-color: var(--fb3erBodyDarker);
  }
  &:nth-child(even):hover,
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
  return img ? (
    <ProfilePic src={img}></ProfilePic>
  ) : (
    <NoProfilePic>
      <BiUser />
    </NoProfilePic>
  );
};
const UserNameText = styled.span`
  @media (max-width: ${disappearUserName}) {
    display: none;
  }
`;
const UserOnlineItem = ({ userOnline }: { userOnline: UserNotNull }) => {
  return (
    <>
      <ContainerItem to={FRONTEND_ENDPOINTS.PROFILEdyn(userOnline._id)}>
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
