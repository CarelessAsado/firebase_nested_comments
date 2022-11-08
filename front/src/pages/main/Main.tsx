import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { useEffect, useState } from "react";
import {
  /*   getComments, */
  newCommentDeleted,
  newCommentPostedAdded,
} from "context/generalSlice";
import io, { Socket } from "socket.io-client";
import { BACKEND_ROOT } from "config/constants";
import { getHeadersChatAuth } from "API/axiosInstanceJWT";
import UsersOnline, { widthSideChat } from "components/UsersOnline/UsersOnline";
import {
  disappearUserName,
  picHeight,
} from "components/UsersOnline/auxiliaries/UserOnlineItem";
import { dispatchNotification } from "config/utils/dispatchNotification";

import ParentComment from "./auxiliaries/ParentComments";
import NewPostForm from "./auxiliaries/NewPostForm";
import { getComments } from "context/generalSlice";

const Container = styled.div<{ isChatOpen: boolean }>`
  //is chatClose, then margin-left:none
  margin-left: ${(props) => (props.isChatOpen ? widthSideChat : "none")};
  /* width: calc(100% - ${widthSideChat}); */
  border: 2px solid green;
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
  transition: 0.3s;
  border: 1px solid green;
  @media (max-width: ${disappearUserName}) {
    margin-left: ${(props) =>
      props.isChatOpen ? `calc(${picHeight} + 20px)` : "none"};
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

const ContainerAllComments = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export let socket: Socket | undefined;

//el problema de hacer esto es q el primer connect event se produce, pero yo no lo registro (ver q pasa si entro directamente en esta view, pero sospecho q va a ser lo mismo).

//puedo hacer un useRef en app, y q si no hay user, directamente logueé out, y hacer los users connected desde el STORE

export const Main = () => {
  const { user } = useAppSelector((state) => state.user);
  const { comments } = useAppSelector((state) => state.general);
  /*   const { comments } = useAppSelector((state) => state.general); */
  /*   const { socket } = useAppSelector((state) => state.user); */

  //antes openChat estaba en UsersOnline component, lo terminé guardando aca, ya q el container de Main varia en su margin-left (es decir la width), cuando cierro o abro el chat
  const [openChat, setOpenChat] = useState(true);
  const openAndCloseChat = () => {
    setOpenChat((v) => !v);
  };
  const [usersOnline, setUsersOnline] = useState<UserNotNull[]>([]);
  const dispatch = useAppDispatch();

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
  console.log(comments, 777);
  return (
    <Container isChatOpen={openChat}>
      <NewPostForm />
      <Center>
        <UsersOnline
          users={usersOnline}
          setOpenChat={openAndCloseChat}
          openChat={openChat}
        />
        <ContainerAllComments>
          {comments.length > 0 &&
            comments.map((c) => (
              <ParentComment
                comment={c}
                //fijarse dsp de borrar
                data={comments}
                key={c._id}
                user={user}
              />
            ))}
        </ContainerAllComments>
      </Center>
    </Container>
  );
};
