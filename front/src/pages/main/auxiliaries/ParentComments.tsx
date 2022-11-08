import { FRONTEND_ENDPOINTS } from "config/constants";
import {
  deleteComment,
  getMoreSubComments,
  postNewComment,
} from "context/generalSlice";
import { useAppDispatch } from "hooks/reduxDispatchAndSelector";
import { useState } from "react";
import styled from "styled-components";
import TimeAgo from "timeago-react";
import { ProfilePic } from "components/UsersOnline/auxiliaries/UserOnlineItem";
import getImmediateChildren, {
  goBackToPreviousNestedLevel,
} from "config/utils/nestedLevelUIFunctions";
import { SingleSubComment } from "./SingleSubComment";
import {
  Button,
  ButtonContainer,
  commentContainerBaseStyles,
  GrowFlex1,
  Input,
  Top,
  Value,
} from "./styles";

const ParentCommentContainer = styled.div`
  ${commentContainerBaseStyles}
`;

export const ContainerAllSubComments = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f1c6c6;
  gap: 5px;
  //ESTO APLICA A C/SUBCOMMENT y al CHILD CONTROLLER COMPONENT
  /*   & > * {
    border-radius: 5px;
    border: 1px yellow solid;
  } */
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

  const [newChildComment, setNewChildComment] = useState("");

  const handleSubmit = () => {
    dispatch(postNewComment({ value: newChildComment, parentID: comment._id }))
      .unwrap()
      .then(() => setNewChildComment(""));
  };

  const handleDelete = () => {
    dispatch(deleteComment(comment));
  };

  const deleteBtn = (
    <Button style={{ backgroundColor: "crimson" }} onClick={handleDelete}>
      Eliminar
    </Button>
  );

  async function getSubCommentsFn() {
    dispatch(getMoreSubComments(comment.children[0]));
  }

  return (
    <>
      <ParentCommentContainer>
        {typeof comment.userID !== "string" && (
          <Top>
            <GrowFlex1 to={FRONTEND_ENDPOINTS.PROFILEdyn(comment.userID._id)}>
              <ProfilePic src={comment.userID.img || ""}></ProfilePic>
              <span>{comment.userID.username}</span>
            </GrowFlex1>
            <TimeAgo datetime={comment.createdAt} />
          </Top>
        )}
        <Value>{comment.value}</Value>{" "}
        <Input
          placeholder="Agregar comentario/child"
          value={newChildComment}
          onChange={(e) => setNewChildComment(e.target.value)}
        ></Input>{" "}
        <ButtonContainer>
          <Button onClick={handleSubmit}>Comentar</Button>
          {typeof comment.userID !== "string" &&
            comment.userID._id === user?._id &&
            deleteBtn}
          {comment.userID === user?._id && deleteBtn}
        </ButtonContainer>
      </ParentCommentContainer>
      {/* --------------------FETCH MORE SUBCOMMENTS--------------------- */}

      {!!comment.remainingChildren && comment.remainingChildren > 0 && (
        //esto setea los children en PARENTCOMPONENT AHORA
        <Button onClick={getSubCommentsFn}>
          {comment.remainingChildren > 1
            ? `See all ${comment.remainingChildren} answers`
            : "See response"}
        </Button>
      )}
      {!!comment.children && comment.children.length > 0 && (
        <ContainerAllSubComments>
          {comment.children.map((c) => {
            return <SingleSubComment comment={c} key={c._id} user={user} />;
          })}
        </ContainerAllSubComments>
      )}
    </>
  );
};

export default ParentComment;
