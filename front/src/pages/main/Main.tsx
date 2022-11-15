import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { useEffect, useRef } from "react";
import ParentComment from "./auxiliaries/ParentComments";
import NewPostForm from "./auxiliaries/NewPostForm";
import { getComments } from "context/generalSlice";
import { useIntersectionObserver } from "hooks/useIntersectionObserver";
import Spinner from "components/loaders/loader";

const ContainerAllComments = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const HitRockBottomInfinite = styled.div``;

/* export let firstLoad: boolean = false; */

export const Main = () => {
  const { user, loading } = useAppSelector((state) => state.user);
  const { comments } = useAppSelector((state) => state.general);
  const firstLoad = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getComments())
      .unwrap() //when page loads, bottom is intersecting, so to avoid calling for comment-results-page 2 before its necessary, we wait for this variable to become true
      .then(() => (firstLoad.current = true));
  }, [dispatch]);

  const { entriesCB, setHTMLElementsObserved } = useIntersectionObserver();

  const InfiniteScrollPagContainer = useRef<HTMLDivElement>(null);

  //page 1, hacemos call, y incrementamos a page 2, cuando llegamos a rock bottom hacemos pedido con page 2, e incrementamos
  useEffect(() => {
    if (
      //onfirst load comment section is empty so bottom is intersecting
      firstLoad.current &&
      entriesCB.length > 0 &&
      entriesCB[0].isIntersecting
    ) {
      dispatch(getComments());
      //when page loads, bottom is intersecting, so to avoid calling for comment-results-page 2 before its necessary, we wait for this variable to become true
    }
  }, [entriesCB, dispatch]);

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
            <ParentComment comment={c} key={c._id} user={user} />
          ))}
      </ContainerAllComments>
      {loading && (
        <Spinner fz="3rem" h="100%" color={" var(--fbWhiteComments)"} />
      )}

      <HitRockBottomInfinite
        ref={InfiniteScrollPagContainer}
      ></HitRockBottomInfinite>
    </>
  );
};
