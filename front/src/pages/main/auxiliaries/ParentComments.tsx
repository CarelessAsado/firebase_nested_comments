import { FRONTEND_ENDPOINTS } from "config/constants";
import {
  deleteComment,
  getMoreSubComments,
  likeUnlikeComment,
  postNewComment,
} from "context/generalSlice";
import { useAppDispatch } from "hooks/reduxDispatchAndSelector";
import { useRef, useState } from "react";
import styled from "styled-components";
import TimeAgo from "timeago-react";
import { NoPicOrPicUserImage } from "components/UsersOnline/auxiliaries/UserOnlineItem";
import { SingleSubComment } from "./SingleSubComment";
import {
  commentContainerBaseStyles,
  FormSubmitNewSubComment,
  GrowFlex1,
  Input,
  SendButton,
  Top,
  Value,
} from "./styles";
import { AiFillLike, AiOutlineComment, AiFillDelete } from "react-icons/ai";
import LikesUsersDataModal from "./LikesUsersDataModal";

const ParentCommentContainer = styled.div`
  ${commentContainerBaseStyles}
`;
const ContainerAllSubComments = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Functionalities = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--fbWhiteComments);

  border-top: 1px solid var(--mainGray);
  & > * {
    padding: 10px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    &:hover {
      background-color: var(--fb3erBody);
    }
  }
`;
const MeGustaFunctionality = styled.div<{ likedBefore: boolean }>`
  color: ${(props) => props.likedBefore && "var(--fbBlue)"};
`;
const ComentarFunctionality = styled.div``;
const FetchMoreSubComments = styled.div`
  font-weight: bold;
  cursor: pointer;
  padding: 10px 0;
  &:hover {
    text-decoration: underline;
  }
`;

const LikeSection = styled.div`
  display: flex;
  gap: 8px;
  padding: 5px 10px;
  align-items: center;
  position: relative;
`;

interface IProps {
  comment: IComment;
  children?: JSX.Element | JSX.Element[];
  /*   setData: (value: React.SetStateAction<IComment[]>) => void; */
  data: IComment[];
  user: IUser;
}
//esto eventualmente lo puedo borrar: "data"
const ParentComment = ({ comment, user, data }: IProps) => {
  const dispatch = useAppDispatch();
  const inputFocus = useRef<HTMLInputElement>(null);
  const [newChildComment, setNewChildComment] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(postNewComment({ value: newChildComment, parentID: comment._id }))
      .unwrap()
      .then(() => setNewChildComment(""));
  };

  const handleDelete = () => {
    dispatch(deleteComment(comment));
  };

  async function getSubCommentsFn() {
    dispatch(getMoreSubComments(comment.children[0]));
  }

  const focusAndScrollInput = () => {
    inputFocus.current?.focus();
    //false hace q el input quede en la parte inferior de la screen, asi se puede leer los comentarios on top mientras escribis
    inputFocus.current?.scrollIntoView(false);
  };

  return (
    <>
      <ParentCommentContainer>
        {typeof comment.userID !== "string" && (
          <Top>
            <GrowFlex1 to={FRONTEND_ENDPOINTS.PROFILEdyn(comment.userID._id)}>
              <NoPicOrPicUserImage img={comment.userID.img} />
              <span>{comment.userID.username}</span>
            </GrowFlex1>
            <TimeAgo datetime={comment.createdAt} />
          </Top>
        )}
        <Value>{comment.value}</Value>{" "}
        {/* -------------------------------------------------------------- */}
        <LikeSection>
          {comment.likes.length > 0 && (
            <LikesUsersDataModal comment={comment} />
          )}
        </LikeSection>
        {/* --------------------------------------------------------------- */}
        <Functionalities>
          <MeGustaFunctionality
            likedBefore={comment.likes.includes(user?._id || "")}
            onClick={() => dispatch(likeUnlikeComment(comment))}
          >
            <AiFillLike /> Like
          </MeGustaFunctionality>
          <ComentarFunctionality onClick={focusAndScrollInput}>
            <AiOutlineComment />
            Comment
          </ComentarFunctionality>
          {/* -------------DELETE BUTTON ONLY FOR OWNER OF THE COMMENT---------- */}
          {typeof comment.userID !== "string" &&
            comment.userID._id === user?._id && (
              <ComentarFunctionality onClick={handleDelete}>
                <AiFillDelete />
                Delete
              </ComentarFunctionality>
            )}
          {/* ------------------------------------------------------------------- */}
        </Functionalities>
        {/* --------------------FETCH MORE SUBCOMMENTS--------------------- */}
        {!!comment.remainingChildren && comment.remainingChildren > 0 && (
          //esto setea los children en PARENTCOMPONENT AHORA
          <FetchMoreSubComments onClick={getSubCommentsFn}>
            {comment.remainingChildren > 1
              ? `See all ${comment.remainingChildren} answers`
              : "See response"}
          </FetchMoreSubComments>
        )}
        {!!comment.children && comment.children.length > 0 && (
          <ContainerAllSubComments>
            {comment.children.map((c) => {
              return (
                <SingleSubComment
                  comment={c}
                  key={c._id}
                  user={user}
                  focus={focusAndScrollInput}
                />
              );
            })}
          </ContainerAllSubComments>
        )}
        <FormSubmitNewSubComment onSubmit={handleSubmit}>
          <NoPicOrPicUserImage img={user?.img} />
          <Input
            placeholder="Write a comment..."
            value={newChildComment}
            onChange={(e) => setNewChildComment(e.target.value)}
            ref={inputFocus}
          ></Input>{" "}
          <SendButton />
        </FormSubmitNewSubComment>
      </ParentCommentContainer>
    </>
  );
};

export default ParentComment;
