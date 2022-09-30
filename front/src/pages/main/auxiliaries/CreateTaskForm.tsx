import React, { ChangeEvent, useEffect, useState } from "react";
import styled from "styled-components";
import Spinner from "components/loaders/loader";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { getTasks, postNewTasks } from "context/userSlice";

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
const Input = styled.input`
  padding: 20px;
  font-size: inherit;
  width: 100%;
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
const Error = styled.div`
  color: crimson;
  padding: 10px;
  margin: 10px;
  font-size: 1.5rem;
`;

const NewTaskForm = () => {
  const { loading, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [inputTask, setInputTask] = useState<string>("");
  const addTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    /*-----HACER UN CUSTOM ALERT if task is empty-----*/
    dispatch(postNewTasks(inputTask))
      .unwrap()
      .then(() => setInputTask(""));
  };

  /*----------------GET ALL TASKS--------*/
  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);
  /*-------------------------------------*/
  return (
    <Form onSubmit={addTask}>
      <Decoration>
        <Input
          type="text"
          placeholder="Task..."
          value={inputTask}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setInputTask(e.target.value)
          }
        ></Input>
        <SubmitBtn>Add task</SubmitBtn>
      </Decoration>
      <LoadingRelative>
        {loading && (
          <Loading>
            <Spinner fz="3rem" h="100%" />
          </Loading>
        )}
      </LoadingRelative>

      {error && <Error aria-live="assertive">{error}</Error>}
    </Form>
  );
};
export default NewTaskForm;
