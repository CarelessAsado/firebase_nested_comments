import Spinner from "components/loaders/loader";
import { Error } from "components/styled-components/styled";
import { NoPicOrPicUserImage } from "components/UsersOnline/auxiliaries/UserOnlineItem";
import { postNewComment } from "context/generalSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { useState } from "react";
import styled from "styled-components";
import { commentContainerBaseStyles, Input } from "./styles";

export const APP_WIDTH = "1000px";
/* ---------------------------------REEMPLAZAR OLD FORM */
const Form = styled.form`
  margin: 0 auto;
  max-width: ${APP_WIDTH};
  width: 100%;
  ${commentContainerBaseStyles}
`;
const Decoration = styled.div`
  display: flex;
  width: 80%;
  margin: 50px auto;
  font-size: var(--fontMed);

  //center the user profile img
  & :first-child {
    align-self: center;
    margin-right: 5px;
  }
`;

const SubmitBtn = styled.button`
  font-size: inherit;
  background-color: var(--mainBlue);
  color: white;
  padding: 20px;
  transition: 0.3s;
  &:hover {
    background-color: var(--mainBlueHover);
  }
  &:active {
    transform: scale(0.8);
  }
  cursor: pointer;
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
`;

const NewPostForm = ({ user }: { user: IUser }) => {
  const [comment, setComment] = useState("");

  const { loading, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(postNewComment({ value: comment, parentID: null }))
      .unwrap()
      .then(() => setComment(""));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Decoration>
        <NoPicOrPicUserImage img={user?.img} />
        <Input
          placeholder="What's on your mind?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></Input>
        <SubmitBtn>Submit</SubmitBtn>
      </Decoration>
      <LoadingRelative>
        {loading && (
          <Loading>
            <Spinner fz="3rem" h="100%" color={" var(--fbWhiteComments)"} />
          </Loading>
        )}
        {error && <Error>{error}</Error>}
      </LoadingRelative>
    </Form>
  );
};

export default NewPostForm;
