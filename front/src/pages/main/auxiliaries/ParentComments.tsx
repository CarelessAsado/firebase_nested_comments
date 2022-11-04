import { FRONTEND_ENDPOINTS } from "config/constants";
import {
  deleteComment,
  getSubComments,
  postNewComment,
} from "context/generalSlice";
import * as commentAPI from "API/commentsAPI";
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
  console.log(
    "PARENT: ssssssssssssssssssssssssssssssssssssssss",
    comment.value
  );
  /*  alert(comment.value); */
  const [newChildComment, setNewChildComment] = useState("");

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

  //ESTO PUEDE GENERAR PROBLEMAS DSP, VER SI LO TENGO Q JUNTAR CON EL CHILD CONTROLLER
  let { immediateChildren, remainder } = getImmediateChildren(
    comment,
    comment.children
  );
  /*  immediateChildren.length && alert(comment.value); */
  console.log("immediateChildren: ", immediateChildren);
  console.log("remainder: ", remainder);

  const deleteBtn = (
    <Button style={{ backgroundColor: "crimson" }} onClick={handleDelete}>
      Eliminar
    </Button>
  );

  async function getSubCommentsFn() {
    dispatch(getSubComments(comment._id));
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
          {!!comment.totalSubcomments && comment.totalSubcomments > 0 && (
            //getSubComments va a pasar a ser parte del parentComponent
            <Button onClick={getSubCommentsFn}>
              {comment.totalSubcomments > 1
                ? `See all ${comment.totalSubcomments} answers`
                : "See response"}
            </Button>
          )}
        </ButtonContainer>
      </ParentCommentContainer>

      {immediateChildren.length > 0 && (
        <ContainerAllSubComments>
          {/* TIENE Q LOOPEAR SOLO LOS 1EROS COMMENTS, creo q ahi juega lo de expression */}
          {immediateChildren.map((c) => {
            return (
              <ChildrenControllerTopLevel
                comment={c}
                data={remainder}
                key={c._id}
                user={user}
              />
            );
          })}
        </ContainerAllSubComments>
      )}
    </>
  );
};

const ChildrenControllerTopLevel = ({
  comment: secondLevelDeepComment,
  user,
  data,
}: IProps) => {
  const [topLevel, setTopLevel] = useState(secondLevelDeepComment._id);

  function changeTopLevel(commID: string) {
    setTopLevel(commID);
  }

  //TOPLEVEL DEBERIA DECIDIR A PARTIR DE NIVEL RENDERIZO

  //AGREGAR DSP EN EL CHILDREN COMP EL RETURN CUANDO ALCANCE EL NESTED LEVEL 5
  const { immediateChildren, remainder } = getImmediateChildren(
    secondLevelDeepComment,
    data,
    topLevel
  );

  //getPreviousChildren as well
  let found = data.find((i) => i._id === topLevel);

  //nunca vas a encontrar en children al topLevel A LA PRIMERA VUELTA, ya q lo filtré previamente. No obstante, si cambio el topLevel a un _id nested deeper in the Comment tree, then you will find sth

  //ESTO ES VIEJO: todavia no entiendo bien xq pero cuando recien arranco nunca hay found, asi q puedo usar eso a mi favor p/solo buscar prevChildren cuando hay un found (?)
  const currentComment = found ? found : secondLevelDeepComment;
  console.log(
    "FOUND TOP LEVEL COMMENT: ",
    currentComment,
    "check path and _id"
  );
  //data cuando hago modificaciones al topLevel, es mas grande de lo q necesito

  return (
    <>
      <div>CONTROLLER</div>
      {/* BOTON P/ VOLVER A ATRAS CUANDO ESTOY DEEP IN THE SUBCOMMENT TREE */}
      {topLevel !== secondLevelDeepComment._id && (
        <button
          onClick={() =>
            setTopLevel(goBackToPreviousNestedLevel(currentComment))
          }
        >
          Volver atras
        </button>
      )}

      {/* antes loopeaba aca, pero dsp me di cuenta q no es necesario xq el parent ya me manda los comments individuales */}
      <SingleSubComment
        comment={currentComment}
        data={data}
        topLevel={topLevel}
        setTopLevel={changeTopLevel}
        key={currentComment._id}
        user={user}
      />
    </>
  );
};

export default ParentComment;
