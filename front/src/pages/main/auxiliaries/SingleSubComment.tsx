import getImmediateChildren, {
  limitNestingUI,
} from "config/utils/nestedLevelUIFunctions";
import { useAppDispatch } from "hooks/reduxDispatchAndSelector";
import { useState } from "react";
import {
  deleteComment,
  getSubComments,
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

const SingleSubCommentContainer = styled.div<{ order: number }>`
  //copiar y pegar estilos

  //the 10px-margin provides the nesting effect
  /* margin: 20px 0 0 10px; */
  margin-left: ${(props) => `calc(${props.order * 20}px)`};

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
  data: IComment[];
  user: IUser;
  topLevel: string;
  setTopLevel: (commID: string) => void;
  order?: number;
}

export function SingleSubComment({
  comment,
  topLevel,
  setTopLevel,
  data,
  user,
  order = 0,
}: IProps) {
  const [newChildComment, setNewChildComment] = useState("");

  const dispatch = useAppDispatch();

  //LIMITE 5 LEVEL DEEP
  //CON ESTO DECIDO SI LOOPEAR O NO

  const { immediateChildren, remainder } = getImmediateChildren(comment, data);

  const handleSubmit = () => {
    dispatch(
      //armar esto dsp en el backend
      postNewComment({
        value: newChildComment,
        id: comment._id,
        path: comment.path,
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
      <SingleSubCommentContainer order={order}>
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
          {!!comment.remainingChildren && comment.remainingChildren > 0 && (
            //esto setea los children en PARENTCOMPONENT AHORA
            <Button onClick={() => dispatch(getSubComments(comment._id))}>
              {comment.remainingChildren > 1
                ? `See all ${comment.remainingChildren} answers`
                : "See response"}
            </Button>
          )}
          {/* <Button>Likear</Button> */}
        </ButtonContainer>
        {/* como evaluo si el comment tiene o no comentarios nested adicionales???
        en ppio dejar p/el final, primero fetchear todo y hacer esa tarea en el front con la data q ya tenemos, es decir q si no hay remaining children no mostramos este boton */}
        {limitNestingUI(comment, topLevel) && immediateChildren.length > 0 && (
          <Button onClick={() => setTopLevel(comment._id)}>
            SEE MORE COMMENTS
          </Button>
        )}
        {/* {
          /* immediateChildren.length > 0  comment.remainingChildren &&
            comment.remainingChildren > 0 && (
              <Button onClick={() => setTopLevel(comment._id)}>
                SEE MORE COMMENTS
              </Button>
            )
        } */}
      </SingleSubCommentContainer>
      {!limitNestingUI(comment, topLevel) &&
        immediateChildren.length > 0 &&
        immediateChildren.map((c) => (
          <SingleSubComment
            comment={c}
            data={remainder}
            topLevel={topLevel}
            setTopLevel={setTopLevel}
            key={c._id}
            user={user}
            order={order + 1}
          />
        ))}
    </>
  );
}
