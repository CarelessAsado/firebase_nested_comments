import { FRONTEND_ENDPOINTS } from "config/constants";
import { deleteComment, postNewComment } from "context/userSlice";
import * as commentAPI from "API/commentsAPI";
import { useAppDispatch } from "hooks/reduxDispatchAndSelector";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import TimeAgo from "timeago-react";
import { ProfilePic } from "components/UsersOnline/auxiliaries/UserOnlineItem";
import getImmediateChildren, {
  goBackToPreviousNestedLevel,
} from "config/utils/nestedLevelUIFunctions";
import { SingleSubComment } from "./SingleSubComment";

const ParentCommentContainer = styled.div`
  padding: 10px;
  border-radius: 5px;
  background-color: black;
  color: white;
`;

const Button = styled.button`
  padding: 10px;
  color: white;
  background-color: blue;
  border: 1px solid black;
  border-radius: 5px;
  margin-left: 5px;
`;
export const Value = styled.div`
  color: white;
  font-size: 1.2rem;
  padding: 5px 0;
`;
export const ContainerAllSubComments = styled.div`
  //the 10px-margin provides the nesting effect
  /*   margin: 20px 0 0 10px; */
  /* display: flex;
  flex-direction: column;
  gap: 10px; */
  //ESTO APLICA A C/SUBCOMMENT y al CHILD CONTROLLER COMPONENT
  & > * {
    background-color: grey;
    padding: 10px;
    border-radius: 5px;
    border: 1px yellow solid;
  }
`;

interface IProps {
  comment: IComment;
  children?: JSX.Element | JSX.Element[];
  /*   setData: (value: React.SetStateAction<IComment[]>) => void; */
  data: IComment[];
  user: IUser;
}
/* ---------------------------------REEMPLAZAR OLD FORM */

const Top = styled.div`
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  padding: 10px;

  border: 1px solid black;
  border-radius: 5px;
  font-size: inherit;
  width: 100%;
`;
export const GrowFlex1 = styled(Link)`
  flex: 1;
  display: flex;
  gap: 7px;
  align-items: center;
`;

const ParentComment = ({ comment, user }: IProps) => {
  const dispatch = useAppDispatch();

  const [children, setChildren] = useState<IComment[]>([]);
  const [newChildComment, setNewChildComment] = useState("");
  async function getSubComments() {
    try {
      const { data } = await commentAPI.getSubComments(comment._id);
      console.log(data, 666, "TODOS LOS CHILDREN Q TIENE Q APARECER ");
      setChildren(data);
    } catch (error) {}
  }
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
    children
  );

  console.log("immediateChildren: ", immediateChildren);
  console.log("remainder: ", remainder);

  const deleteBtn = (
    <Button style={{ backgroundColor: "crimson" }} onClick={handleDelete}>
      Eliminar
    </Button>
  );
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
            //getSubComments va a pasar a ser parte del parentComponent
            <Button onClick={getSubComments}>
              {comment.subComments > 1
                ? `See all ${comment.subComments} answers`
                : "See response"}
            </Button>
          )}
        </div>
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
      <div>
        {/* antes loopeaba aca, pero dsp me di cuenta q no es necesario xq el parent ya me manda los comments individuales */}
        <SingleSubComment
          comment={currentComment}
          data={data}
          topLevel={topLevel}
          setTopLevel={changeTopLevel}
          key={currentComment._id}
          user={user}
        />
      </div>
    </>
  );
};

export default ParentComment;
