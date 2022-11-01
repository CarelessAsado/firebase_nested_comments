import getImmediateChildren, {
  limitNestingUI,
} from "config/utils/nestedLevelUIFunctions";
import { useAppDispatch } from "hooks/reduxDispatchAndSelector";
import { useState } from "react";
import {
  deleteComment,
  getSubComments,
  postNewComment,
} from "context/userSlice";
import styled from "styled-components";
import TimeAgo from "timeago-react";
import { ProfilePic } from "components/UsersOnline/auxiliaries/UserOnlineItem";
import { Input } from "./styles";
import { Link } from "react-router-dom";
import { FRONTEND_ENDPOINTS } from "config/constants";

const Top = styled.div`
  display: flex;
  align-items: center;
`;
const SingleSubCommentContainer = styled.div`
  //copiar y pegar estilos

  //the 10px-margin provides the nesting effect
  /*   margin: 20px 0 0 10px;
 
  & > * {
    background-color: grey;
    padding: 10px;
    border-radius: 5px;
  } */
`;

const Value = styled.div`
  color: white;
  font-size: 1.2rem;
  padding: 5px 0;
`;

const GrowFlex1 = styled(Link)`
  flex: 1;
  display: flex;
  gap: 7px;
  align-items: center;
`;
const Button = styled.button`
  padding: 10px;
  color: white;
  background-color: blue;
  border: 1px solid black;
  border-radius: 5px;
  margin-left: 5px;
`;

interface IProps {
  comment: IComment;
  children?: JSX.Element | JSX.Element[];
  /*   setData: (value: React.SetStateAction<IComment[]>) => void; */
  data: IComment[];
  user: IUser;
  topLevel: string;
  setTopLevel: (commID: string) => void;
}

export function SingleSubComment({
  comment,
  topLevel,
  setTopLevel,
  data,
  user,
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
      <Value>{comment.value}</Value>{" "}
      <div>
        <Input
          placeholder="Agregar comentario/child"
          value={newChildComment}
          onChange={(e) => setNewChildComment(e.target.value)}
        ></Input>{" "}
        <Button onClick={handleSubmit}>Comentar</Button>
        {typeof comment.userID !== "string" &&
          comment.userID._id === user?._id &&
          deleteBtn}
        {comment.userID === user?._id && deleteBtn}
        {!!comment.subComments && comment.subComments > 0 && (
          //esto setea los children en PARENTCOMPONENT AHORA
          <Button onClick={() => dispatch(getSubComments(comment._id))}>
            {comment.subComments > 1
              ? `See all ${comment.subComments} answers`
              : "See response"}
          </Button>
        )}
        {/* <Button>Likear</Button> */}
      </div>
      {/* como evaluo si el comment tiene o no comentarios nested adicionales???
        en ppio dejar p/el final, primero fetchear todo y hacer esa tarea en el front con la data q ya tenemos, es decir q si no hay remaining children no mostramos este boton */}
      {limitNestingUI(comment, topLevel) && immediateChildren.length > 0 && (
        <button onClick={() => setTopLevel(comment._id)}>
          LOOPEAR A PARTIR DE OTRO PUNTO
        </button>
      )}
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
          />
        ))}
    </SingleSubCommentContainer>
  );
}
