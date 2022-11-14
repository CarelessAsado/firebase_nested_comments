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
const HitRockBottomInfinite = styled.div``;
export let socket: Socket | undefined;

type ISocketResponse = { data: IComment; user: IUser };
//el problema de hacer esto es q el primer connect event se produce, pero yo no lo registro (ver q pasa si entro directamente en esta view, pero sospecho q va a ser lo mismo).

//puedo hacer un useRef en app, y q si no hay user, directamente logueé out, y hacer los users connected desde el STORE
let firstLoad: boolean = false;

export const Main = () => {
  const { user } = useAppSelector((state) => state.user);
  const { comments } = useAppSelector((state) => state.general);
  const [nextPage, setNextPage] = useState<number>(1);
  /*   const { comments } = useAppSelector((state) => state.general); */
  /*   const { socket } = useAppSelector((state) => state.user); */

  const dispatch = useAppDispatch();

  const checkIfThereAreMoreComments = (facetResponse: FacetResponse) => {
    if (
      facetResponse.commentsData.length + comments.length <
      facetResponse.count
    ) {
      setNextPage((v) => v + 1);
    } else {
      setNextPage(0);
    }
  };

  useEffect(() => {
    dispatch(getComments(nextPage))
      .unwrap() //when page loads, bottom is intersecting, so to avoid calling for comment-results-page 2 before its necessary, we wait for this variable to become true
      .then((data) => {
        firstLoad = true;

        checkIfThereAreMoreComments(data);
      });
  }, [dispatch]);

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
    <>
      <NewPostForm user={user} />
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
    </>
  );
};
