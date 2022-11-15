import styled from "styled-components";
import { AiFillLike } from "react-icons/ai";
import Spinner from "components/loaders/loader";
import { useState } from "react";
import useTestApiCall from "hooks/TEST";
import * as commentAPI from "API/commentsAPI";

const LikeCountDisplay = styled.div`
  position: relative;
  z-index: 3;
`;
//lo pongo antes de comment count p/poder referenciarlo en CommentCount:hover
const ModalUserNamesHover = styled.div`
  background-color: var(--mainSolapa);
  color: black;
  padding: 10px;
  border-radius: 10px;
  position: absolute;
  display: none;
  overflow-y: auto;
  max-height: 50vh;
  width: max-content;
  max-width: 50vh;
`;

const CommentCount = styled.div<{ isAbsolute?: boolean }>`
  position: ${(props) => props.isAbsolute && "absolute"};
  right: 0;
  background-color: var(--fb3erBody);
  border-radius: 10px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: calc(var(--fontSmall) - 0.2rem);
  &:hover ${ModalUserNamesHover} {
    display: block;
  }
`;

const LikeIcon = styled.span`
  background-color: var(--fbBlue);
  height: 18px;
  min-width: 18px;
  border-radius: 50%;
  font-size: calc(var(--fontSmall) - 0.3rem);
  cursor: pointer;
  color: var(--mainWhite);
  display: grid;
  place-items: center;
`;
const LikesUsersDataModal = ({
  comment,
  isAbsolute,
}: {
  comment: IComment;
  isAbsolute?: boolean;
}) => {
  const [mouseEntered, setMouseEntered] = useState(false);

  const {
    data: usersLiking,
    error,
    loading: indLoading,
    execute,
  } = useTestApiCall({
    apiCallPromise: commentAPI.getLikesUserData,
    args: comment,
  });

  if (comment.likes.length > 0) {
    return (
      <CommentCount
        onMouseOver={() => {
          !mouseEntered && execute();
          setMouseEntered(true);
        }}
        onMouseLeave={() => setMouseEntered(false)}
        //uso esto p/distinguir la position entre relative y absolute cuando estoy en Parent o Subcomment
        isAbsolute={isAbsolute}
      >
        <LikeIcon>
          <AiFillLike />
        </LikeIcon>
        <LikeCountDisplay>
          {comment.likes.length}
          {!error && (
            <ModalUserNamesHover>
              {indLoading ? (
                <Spinner fz="var(--fontSmall)" h="100%" />
              ) : usersLiking.length > 0 ? (
                usersLiking.map((i) => <div>{i?.username}</div>)
              ) : null}
            </ModalUserNamesHover>
          )}
        </LikeCountDisplay>
      </CommentCount>
    );
  } else {
    return null;
  }
};

export default LikesUsersDataModal;
