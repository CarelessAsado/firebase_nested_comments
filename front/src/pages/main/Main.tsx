import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { useEffect, useRef, useState } from "react";
import {
  likeUnlikeComment,
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
import { dispatchNotification } from "config/utils/dispatchNotification";

import ParentComment from "./auxiliaries/ParentComments";
import NewPostForm, { APP_WIDTH } from "./auxiliaries/NewPostForm";
import { getComments } from "context/generalSlice";
import { useIntersectionObserver } from "hooks/useIntersectionObserver";
import { FacetResponse } from "API/commentsAPI";

const Container = styled.div<{ isChatOpen: boolean }>`
  //is chatClose, then margin-left:none
  margin-left: ${(props) => (props.isChatOpen ? widthSideChat : "none")};
  /* width: calc(100% - ${widthSideChat}); */
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
  transition: 0.3s;

  @media (max-width: ${disappearUserName}) {
    margin-left: ${(props) =>
      props.isChatOpen ? `calc(${picHeight} + 20px)` : "none"};
  }
`;
const Center = styled.div`
  margin: 100px auto;
  min-height: 10vh;
  align-self: baseline;
  max-width: ${APP_WIDTH};
  width: 100%;
`;

const ContainerAllComments = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const HitRockBottomInfinite = styled.div`
  height: 22px;
  background-color: red;
`;
export let socket: Socket | undefined;

type ISocketResponse = { data: IComment; user: IUser };
//el problema de hacer esto es q el primer connect event se produce, pero yo no lo registro (ver q pasa si entro directamente en esta view, pero sospecho q va a ser lo mismo).

//puedo hacer un useRef en app, y q si no hay user, directamente logueé out, y hacer los users connected desde el STORE
let firstLoad: boolean = false;

export const Main = () => {
  const { user } = useAppSelector((state) => state.user);
  const { comments, totalComments } = useAppSelector((state) => state.general);
  const [nextPage, setNextPage] = useState<number>(1);
  /*   const { comments } = useAppSelector((state) => state.general); */
  /*   const { socket } = useAppSelector((state) => state.user); */

  //antes openChat estaba en UsersOnline component, lo terminé guardando aca, ya q el container de Main varia en su margin-left (es decir la width), cuando cierro o abro el chat
  const [openChat, setOpenChat] = useState(true);
  const openAndCloseChat = () => {
    setOpenChat((v) => !v);
  };
  const [usersOnline, setUsersOnline] = useState<UserNotNull[]>([]);
  const dispatch = useAppDispatch();

  const checkIfThereAreMoreComments = (facetResponse: FacetResponse) => {
    //ver como hago p/establecer next page
    /*     alert(JSON.stringify({ totalComments, commentsAhora: comments.length })); */
    if (facetResponse.commentsData.length < facetResponse.count) {
      setNextPage((v) => v + 1);
    } else {
      setNextPage(0);
    }
  };

  useEffect(() => {
    //le tengo q pasar el nextPage p/q sepa

    // tengo q ir al back y agregar ma logica p/determinar si nextPage se llama o no

    dispatch(getComments(nextPage))
      .unwrap() //when page loads, bottom is intersecting, so to avoid calling for comment-results-page 2 before its necessary, we wait for this variable to become true
      .then((data) => {
        firstLoad = true;

        checkIfThereAreMoreComments(data);
      });
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

  const { entriesCB, setHTMLElementsObserved } = useIntersectionObserver();

  const InfiniteScrollPagContainer = useRef<HTMLDivElement>(null);
  //page 1, hacemos call, y incrementamos a page 2, cuando llegamos a rock bottom hacemos pedido con page 2, e incrementamos
  useEffect(() => {
    if (
      //onfirst load comment section is empty so bottom is intersecting
      firstLoad &&
      nextPage &&
      entriesCB.length > 0 &&
      entriesCB[0].isIntersecting
    ) {
      alert("aca aun no");

      dispatch(getComments(nextPage))
        .unwrap() //when page loads, bottom is intersecting, so to avoid calling for comment-results-page 2 before its necessary, we wait for this variable to become true
        .then(checkIfThereAreMoreComments);
    }
  }, [entriesCB]);

  useEffect(() => {
    if (InfiniteScrollPagContainer.current) {
      setHTMLElementsObserved([InfiniteScrollPagContainer.current]);
    }
  }, [setHTMLElementsObserved]);

  return (
    <Container isChatOpen={openChat}>
      <NewPostForm user={user} />
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

        <HitRockBottomInfinite
          ref={InfiniteScrollPagContainer}
        ></HitRockBottomInfinite>
      </Center>
    </Container>
  );
};
