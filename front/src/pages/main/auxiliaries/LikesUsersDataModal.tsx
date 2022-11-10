import styled from "styled-components";

import { BACKEND_URL } from "config/constants";
import { LikeIcon } from "./ParentComments";
import { AiFillLike } from "react-icons/ai";
import Spinner from "components/loaders/loader";
import useApiCall from "hooks/useApiCall";
import { useState } from "react";
import useTestApiCall from "hooks/TEST";
import * as commentAPI from "API/commentsAPI";

const LikeCountDisplay = styled.div`
  position: relative;
`;
//lo pongo antes de comment count p/poder referenciarlo en CommentCount:hover
const ModalUserNamesHover = styled.div`
  background-color: rgb(248, 248, 243, 0.7);
  color: black;
  padding: 10px;
  border-radius: 10px;
  position: absolute;
  display: none;
  overflow-y: auto;
  max-height: 50vh;
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
