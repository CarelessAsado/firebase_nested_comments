import { useAppDispatch } from "hooks/reduxDispatchAndSelector";
import { deleteComment, likeUnlikeComment } from "context/generalSlice";
import styled from "styled-components";
import TimeAgo from "timeago-react";
import { NoPicOrPicUserImage } from "components/UsersOnline/auxiliaries/UserOnlineItem";
import {
  Button,
  ButtonContainer,
  commentContainerBaseStyles,
  Value,
} from "./styles";
import { BACKEND_URL, FRONTEND_ENDPOINTS } from "config/constants";
import { Link } from "react-router-dom";
import { LikeIcon } from "./ParentComments";
import { AiFillLike } from "react-icons/ai";
import Spinner from "components/loaders/loader";
import useApiCall from "hooks/useApiCall";
import { useState } from "react";
import LikesUsersDataModal from "./LikesUsersDataModal";

const SingleSubCommentContainer = styled.div`
  //copiar y pegar estilos

  // dejé este método de lado xq no me gustaba q el comment estuviera adentro del otro
  //c/subcommentContainer va a tomar una prop, y en base a ese indice va a multiplicar
  ${commentContainerBaseStyles}
  width: max-content;
`;

const ColoredPadding = styled.div`
  background-color: var(--fb3erBody);
  padding: 8px;
  border-radius: 10px;
  position: relative;
`;

export const LikeCountDisplay = styled.div`
  position: relative;
`;
//lo pongo antes de comment count p/poder referenciarlo en CommentCount:hover
export const ModalUserNamesHover = styled.div`
  background-color: rgb(248, 248, 243, 0.7);
  color: black;
  padding: 10px;
  border-radius: 10px;
  position: absolute;
  display: none;
`;

const CommentCount = styled.div`
  position: absolute;
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
const Functionalities = styled.div`
  display: flex;
  gap: 10px;
  //agrego padding p/separar el absolute container con la like count del text en Functionalities
  padding-top: 5px;
`;
const FlexIt = styled.div`
  display: flex;
  gap: 10px;
`;
const ColumnFlex = styled.div`
  display: flex;
  flex-direction: column;

  gap: 10px;
`;
const LikeFunctionality = styled.b`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const ReplyFunctionality = styled(LikeFunctionality)``;

interface IProps {
  comment: IComment;
  children?: JSX.Element | JSX.Element[];
  /*   setData: (value: React.SetStateAction<IComment[]>) => void; */
  data?: IComment[];
  user: IUser;
  focus: () => void;
  order?: number;
}

export function SingleSubComment({ comment, user, focus }: IProps) {
  /* const [newChildComment, setNewChildComment] = useState(""); */
  const [mouseEntered, setMouseEntered] = useState(false);
  const dispatch = useAppDispatch();

  const {
    data: usersLiking,
    error,
    loading: indLoading,
    execute,
  } = useApiCall<UserNotNull>({
    url: BACKEND_URL.LIKESUSERDATAdyn(comment._id),
    method: "get",
  });

  const handleDelete = () => {
    dispatch(deleteComment(comment));
  };

  const deleteBtn = (
    <Button style={{ backgroundColor: "crimson" }} onClick={handleDelete}>
      Eliminar
    </Button>
  );
  //si estamos en el limite de 4 pero no hay additionalChildren no tiene sentido mostrar el btn

  //add a btn to maybe fetch more, if there are more comments
  //update useState with the new topLevel when btnPressed
  //how can I deal with go back to previous comment
  //stop recursion

  return (
    <>
      <SingleSubCommentContainer>
        {typeof comment.userID !== "string" && (
          <FlexIt>
            <Link to={FRONTEND_ENDPOINTS.PROFILEdyn(comment.userID._id)}>
              <NoPicOrPicUserImage img={comment.userID?.img} />
            </Link>

            <ColumnFlex>
              <ColoredPadding>
                {/* ver si este growflex lo saco dsp */}
                <Link to={FRONTEND_ENDPOINTS.PROFILEdyn(comment.userID._id)}>
                  <b>{comment.userID.username}</b>
                </Link>
                <Value>{comment.value}</Value>
                {comment.likes.length > 0 && (
                  <LikesUsersDataModal comment={comment} isAbsolute />
                )}
              </ColoredPadding>
              <Functionalities>
                <LikeFunctionality
                  onClick={() => dispatch(likeUnlikeComment(comment))}
                >
                  Like
                </LikeFunctionality>
                <ReplyFunctionality onClick={focus}>Reply</ReplyFunctionality>
                <TimeAgo datetime={comment.createdAt} />
              </Functionalities>
              {/*     <Input
                placeholder="Add reply..."
                value={newChildComment}
                onChange={(e) => setNewChildComment(e.target.value)}
              ></Input>{" "} */}
              <ButtonContainer>
                {/*  <Button onClick={handleSubmit}>Comentar</Button> */}
                {comment.userID._id === user?._id && deleteBtn}

                {/* <Button>Likear</Button> */}
              </ButtonContainer>
            </ColumnFlex>
          </FlexIt>
        )}
      </SingleSubCommentContainer>
    </>
  );
}
