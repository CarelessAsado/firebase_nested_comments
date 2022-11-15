import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { useEffect, useState } from "react";
import {
  newCommentDeleted,
  newCommentLikedUnliked,
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
import { dispatchNotification } from "config/utilsFns/dispatchNotification";
import { APP_WIDTH } from "pages/main/auxiliaries/NewPostForm";
import { Outlet } from "react-router-dom";

const Container = styled.div<{ isChatOpen: boolean }>`
  //is chatClose, then margin-left:none
  margin-left: ${(props) => (props.isChatOpen ? widthSideChat : "none")};
  /* width: calc(100% - ${widthSideChat}); */
  /*   min-height: 100vh; */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
  transition: 0.3s;
  min-height: 100vh;
  @media (max-width: ${disappearUserName}) {
    margin-left: ${(props) =>
      props.isChatOpen ? `calc(${picHeight} + 20px)` : "none"};
  }
`;
const Center = styled.div`
  margin: 50px auto;
  min-height: 10vh;
  align-self: baseline;
  max-width: ${APP_WIDTH};
  width: 100%;
`;

export let socket: Socket | undefined;

type ISocketResponse = { data: IComment; user: IUser };
//el problema de hacer esto es q el primer connect event se produce, pero yo no lo registro (ver q pasa si entro directamente en esta view, pero sospecho q va a ser lo mismo).

export const ChatLayout = () => {
  const { user } = useAppSelector((state) => state.user);

  //antes openChat estaba en UsersOnline component, lo terminé guardando aca, ya q el container de Main varia en su margin-left (es decir la width), cuando cierro o abro el chat
  const [openChat, setOpenChat] = useState(true);
  const openAndCloseChat = () => {
    setOpenChat((v) => !v);
  };
  const [usersOnline, setUsersOnline] = useState<UserNotNull[]>([]);
  const dispatch = useAppDispatch();

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
      /*  setIsConnected(false); */
    });

    socket.on("userLeft", (data: UserNotNull[]) => {
      setUsersOnline(data.filter((i) => i._id !== user?._id));
    });

    //cuando envié al user conectado doble
    socket.on("commentPosted", ({ data, user }: ISocketResponse) => {
      dispatch(newCommentPostedAdded(data));
      dispatchNotification(
        dispatch,
        `${user?.username || "Somebody"} posted a comment`
      );
    });

    socket.on("commentDeleted", ({ data, user }: ISocketResponse) => {
      dispatch(newCommentDeleted(data));
      dispatchNotification(
        dispatch,
        `${user?.username || "Somebody"} deleted a comment`
      );
    });

    socket.on(
      "commentLikedUnliked",
      ({ data, user: liker }: ISocketResponse) => {
        dispatch(newCommentLikedUnliked(data));
        if (typeof data.userID !== "string") {
          /* si el usuario owner del comment just liked coincide con el usuario, lo notificamos q ahora es un influencer */

          if (data.userID._id === user?._id) {
            dispatchNotification(
              dispatch,
              `${liker?.username || "Somebody"} has liked/unliked your comment`
            );
          }
        }
      }
    );

    return () => {
      socket?.off("connect");
      socket?.off("disconnect");
      socket?.off("newUserConnected");
      socket?.off("userLeft");
      socket?.off("commentPosted");
      socket?.off("commentDeleted");
      socket?.off("commentLikedUnliked");
      /*   alert("about to disconnect"); */
      //no sirve poner un clean-up disconnect con useRef xq el socket no se vuelve a conectar automaticamente

      /* socket.disconnect(); */
    };
  }, [user?._id, dispatch]);

  return (
    <Container isChatOpen={openChat}>
      <Center>
        <UsersOnline
          users={usersOnline}
          setOpenChat={openAndCloseChat}
          openChat={openChat}
        />

        <Outlet />
      </Center>
    </Container>
  );
};
