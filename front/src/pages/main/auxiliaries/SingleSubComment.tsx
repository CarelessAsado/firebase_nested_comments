import getImmediateChildren, {
  limitNestingUI,
} from "config/utils/nestedLevelUIFunctions";
import { useAppDispatch } from "hooks/reduxDispatchAndSelector";
import { useState } from "react";
import {
  deleteComment,
  getMoreSubComments,
  postNewComment,
} from "context/generalSlice";
import styled from "styled-components";
import TimeAgo from "timeago-react";
import { ProfilePic } from "components/UsersOnline/auxiliaries/UserOnlineItem";
import {
  Button,
  ButtonContainer,
  commentContainerBaseStyles,
  GrowFlex1,
  Input,
  Top,
  Value,
} from "./styles";
import { FRONTEND_ENDPOINTS } from "config/constants";

const SingleSubCommentContainer = styled.div`
  //copiar y pegar estilos

  // dejé este método de lado xq no me gustaba q el comment estuviera adentro del otro
  //c/subcommentContainer va a tomar una prop, y en base a ese indice va a multiplicar
  ${commentContainerBaseStyles}
  background-color:var(--mainBlue);
  width: 300px;
`;

interface IProps {
  comment: IComment;
  children?: JSX.Element | JSX.Element[];
  /*   setData: (value: React.SetStateAction<IComment[]>) => void; */
  data?: IComment[];
  user: IUser;

  order?: number;
}

export function SingleSubComment({ comment, user }: IProps) {
  const [newChildComment, setNewChildComment] = useState("");

  const dispatch = useAppDispatch();

  //LIMITE 5 LEVEL DEEP
  //CON ESTO DECIDO SI LOOPEAR O NO

  const handleSubmit = () => {
    dispatch(
      //armar esto dsp en el backend
      postNewComment({
        value: newChildComment,
        parentID: comment.parentID,
      })
    )
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
  //si estamos en el limite de 4 pero no hay additionalChildren no tiene sentido mostrar el btn

  //add a btn to maybe fetch more, if there are more comments
  //update useState with the new topLevel when btnPressed
  //how can I deal with go back to previous comment
  //stop recursion

  return (
    <>
      <SingleSubCommentContainer>
        {typeof comment.userID !== "string" && (
          <Top>
            <GrowFlex1 to={FRONTEND_ENDPOINTS.PROFILEdyn(comment.userID._id)}>
              <ProfilePic src={comment.userID.img || ""}></ProfilePic>
              <span>{comment.userID.username}</span>
            </GrowFlex1>
            <TimeAgo datetime={comment.createdAt} />
          </Top>
        )}
        <Value>{comment.value}</Value>
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

          {/* <Button>Likear</Button> */}
        </ButtonContainer>
      </SingleSubCommentContainer>
    </>
  );
}
