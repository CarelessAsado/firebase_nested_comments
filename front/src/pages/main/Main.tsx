import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { useEffect, useState } from "react";
import {
  deleteComment,
  getComments,
  newCommentDeleted,
  newCommentPostedAdded,
  postNewComment,
} from "context/userSlice";
import Spinner from "components/loaders/loader";
import io, { Socket } from "socket.io-client";
import { BACKEND_ROOT, FRONTEND_ENDPOINTS } from "config/constants";
import { getHeadersChatAuth } from "API/axiosInstanceJWT";
import UsersOnline, { widthSideChat } from "components/UsersOnline/UsersOnline";
import {
  disappearUserName,
  picHeight,
  ProfilePic,
} from "components/UsersOnline/auxiliaries/UserOnlineItem";
import { dispatchNotification } from "config/utils/dispatchNotification";
import { Error } from "components/styled-components/styled";
import TimeAgo from "timeago-react";
import { Link } from "react-router-dom";

const Container = styled.div`
  margin-left: ${widthSideChat};
  border: 2px solid green;
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
  transition: 0.3s;
  @media (max-width: ${disappearUserName}) {
    margin-left: calc(${picHeight} + 20px);
  }
`;
const Center = styled.div`
  margin: 100px auto;
  min-height: 10vh;
  align-self: baseline;
  max-width: 1000px;
  width: 100%;
  background-color: white;
`;
const Input = styled.input`
  padding: 10px;

  border: 1px solid black;
  border-radius: 5px;
  font-size: inherit;
  width: 100%;
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
export const ContainerComments = styled.div`
  //the 10px-margin provides the nesting effect
  margin: 20px 0 0 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  & > * {
    background-color: grey;
    padding: 10px;
    border-radius: 5px;
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
const Form = styled.form`
  margin: 0 auto;
  max-width: 1000px;
  width: 100%;
  background-color: #d4d2c7;
`;
const Decoration = styled.div`
  border: 1px solid black;
  display: flex;
  width: 80%;
  margin: 50px auto;
  font-size: 1.5rem;
`;

const SubmitBtn = styled.button`
  font-size: inherit;
  background-color: #2775a8;
  color: white;
  padding: 20px;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #2d4d95;
  }
  &:active {
    transform: scale(0.8);
  }
`;
const LoadingRelative = styled.div`
  padding: 30px 10px;
  position: relative;
`;
const Loading = styled.h2`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 50%;
  color: #6e6a7a;
`;
const Top = styled.div`
  display: flex;
  align-items: center;
`;

export const GrowFlex1 = styled(Link)`
  flex: 1;
  display: flex;
  gap: 7px;
  align-items: center;
`;

export let socket: Socket | undefined;

//el problema de hacer esto es q el primer connect event se produce, pero yo no lo registro (ver q pasa si entro directamente en esta view, pero sospecho q va a ser lo mismo).

//puedo hacer un useRef en app, y q si no hay user, directamente logueé out, y hacer los users connected desde el STORE

export const Main = () => {
  const { loading, comments, user, error } = useAppSelector(
    (state) => state.user
  );
  /*   const { socket } = useAppSelector((state) => state.user); */
  const [comment, setComment] = useState("");

  const [usersOnline, setUsersOnline] = useState<UserNotNull[]>([]);
  const dispatch = useAppDispatch();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(postNewComment({ value: comment, id: "", path: "" }))
      .unwrap()
      .then(() => setComment(""));
  };
  useEffect(() => {
    dispatch(getComments());
  }, [dispatch]);

  useEffect(() => {
    socket = io(BACKEND_ROOT);
  }, []);

  useEffect(() => {
    //esto lo hago xq el LOGOUT no genera automaticamente un "disconnect" event en el backend como x ej lo hace el page refresh
    //no sirve, xq ya sin user, nunca llego a esta etapa
    if (!socket) return;

    socket.on("connect", () => {
      /* setIsConnected(true); */
      //send token for auth on first connection
      socket?.emit("first", getHeadersChatAuth());
    });

    socket.on("newUserConnected", (data: UserNotNull[]) => {
      setUsersOnline(data.filter((i) => i._id !== user?._id));
    });

    //estp es p/cuando me desconecta el server, podria usarlo en caso de error
    //tmb se dispara cuando hago un disconnect yo mismo en el logout, ver si saco el disconnect del logout si se dispara tmb
    socket.on("disconnect", () => {
      /*   alert("disconnected by the server"); */
      /*  setIsConnected(false); */
    });

    socket.on("userLeft", (data: UserNotNull[]) => {
      setUsersOnline(data.filter((i) => i._id !== user?._id));
    });

    //cuando envié al user conectado doble
    socket.on("commentPosted", (data: IComment) => {
      dispatch(newCommentPostedAdded(data));
      dispatchNotification(dispatch, "Alguien posteó un comentario.");
    });
    socket.on("commentDeleted", (data: IComment) => {
      dispatch(newCommentDeleted(data));
      dispatchNotification(dispatch, "Alguien borró un comentario.");
    });

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
      socket?.off("newUserConnected");
      socket?.off("userLeft");
      socket?.off("commentPosted");
      socket?.off("commentDeleted");
      /*   alert("about to disconnect"); */
      //no sirve poner un clean-up disconnect con useRef xq el socket no se vuelve a conectar automaticamente

      /* socket.disconnect(); */
    };
  }, [user?._id, dispatch]);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Decoration>
          <Input
            placeholder="Add new post"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></Input>
          <SubmitBtn>Submit</SubmitBtn>
        </Decoration>
        <LoadingRelative>
          {loading && (
            <Loading>
              <Spinner fz="3rem" h="100%" />
            </Loading>
          )}
          {error && <Error>{error}</Error>}
        </LoadingRelative>
      </Form>

      <Center>
        <UsersOnline users={usersOnline} />
        <ContainerComments>
          {comments
            .filter((it) => !it.path)
            .map((c) => (
              <CommentComp
                comment={c}
                /* setData={setData} */
                data={comments}
                key={c._id}
                user={user}
              />
            ))}
        </ContainerComments>
      </Center>
    </Container>
  );
};

function CommentComp({ comment, /* setData, */ data, user }: IProps) {
  const [newChildComment, setNewChildComment] = useState("");
  const dispatch = useAppDispatch();
  const expression = comment.path + "," + comment._id;
  const [children, setChildren] = useState<IComment[]>([]);

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

  useEffect(() => {
    const results = data.filter((it) => it.path && it.path === expression);
    console.log(data, "FULL DATA", 666);
    console.log(results);
    console.log(expression);
    setChildren(results);
  }, [data, expression]);

  const deleteBtn = (
    <Button style={{ backgroundColor: "crimson" }} onClick={handleDelete}>
      Eliminar
    </Button>
  );
  return (
    <div>
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
        {/* <Button>Likear</Button> */}
      </div>
      {}
      {children.length > 0 && (
        <ContainerComments>
          {children.map((c) => (
            <CommentComp
              comment={c}
              /* setData={setData} */ data={data}
              key={c._id}
              user={user}
            />
          ))}
        </ContainerComments>
      )}
    </div>
  );
}
