import Spinner from "components/loaders/loader";
import { Error } from "components/styled-components/styled";
import { postNewComment } from "context/userSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { useState } from "react";
import styled from "styled-components";
import { Input } from "./styles";

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
  background-color: var(--mainBlue);
  color: white;
  padding: 20px;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    background-color: var(--mainBlueHover);
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

const NewPostForm = () => {
  const [comment, setComment] = useState("");

  const { loading, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(postNewComment({ value: comment, id: "", path: "" }))
      .unwrap()
      .then(() => setComment(""));
  };

  return (
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
  );
};

export default NewPostForm;
