import NewTaskForm from "pages/main/auxiliaries/CreateTaskForm";
import TaskItem from "pages/main/auxiliaries/TaskItem";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { useEffect, useState } from "react";
import { dataPuppy } from "./data";
import { deleteComment, getComments, postNewComment } from "context/userSlice";
import { Bottom } from "components/styled-components/styled";

const Notasks = styled.div`
  color: #385f92;
  padding: 10px;
  margin: 10px;
  font-size: 1.5rem;
`;
const Container = styled.div`
  background-color: white;
  min-height: 100vh;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px;
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
  margin: 20px 0 0 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid red;
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
}

export const Main = () => {
  const { tareas, loading, comments } = useAppSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const dispatch = useAppDispatch();
  const handleSubmit = () => {
    dispatch(postNewComment({ value: comment, id: "", path: "" }))
      .unwrap()
      .then(() => setComment(""));
  };
  useEffect(() => {
    dispatch(getComments());
  }, [dispatch]);

  return (
    <Container>
      <NewTaskForm></NewTaskForm>

      <Center>
        {tareas.length > 0
          ? tareas.map((i) => {
              return <TaskItem key={i._id} tarea={i} />;
            })
          : !loading && <Notasks>No tasks saved yet.</Notasks>}
        <Input
          placeholder="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></Input>
        <Input type="submit" value={"POSTEAR"} onClick={handleSubmit}></Input>
        <ContainerComments>
          {comments
            .filter((it) => !it.path)
            .map((c) => (
              <CommentComp
                comment={c}
                /* setData={setData} */
                data={comments}
                key={c._id}
              />
            ))}
        </ContainerComments>
      </Center>
    </Container>
  );
};

function CommentComp({ comment, /* setData, */ data }: IProps) {
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
    /*     setData((v) =>
      v.filter(
        (
          i //si estan al mismo level dos folders, el path va a coincidir pero no la tengo q borrar, x eso agrego doble check
        ) =>
          (!i.path.includes(comment.path) && i.path === comment.path) ||
          //con este borro el item q clickeo, e incluyo todos (x ende tengo q filtrar +)
          i.id !== comment.id
      )
    ); */
  };

  useEffect(() => {
    const results = data.filter((it) => it.path && it.path === expression);
    console.log(data, "FULL DATA", 666);
    console.log(results);
    console.log(expression);
    setChildren(results);
  }, [data]);

  return (
    <div>
      <Value>{comment.value}</Value>{" "}
      <div>
        <Input
          placeholder="Agregar comentario/child"
          value={newChildComment}
          onChange={(e) => setNewChildComment(e.target.value)}
        ></Input>{" "}
        <Button onClick={handleSubmit}>Comentar</Button>
        <Button style={{ backgroundColor: "crimson" }} onClick={handleDelete}>
          Eliminar
        </Button>
        {/* <Button>Likear</Button> */}
      </div>
      {children.length > 0 && (
        <ContainerComments>
          {children.map((c) => (
            <CommentComp
              comment={c}
              /* setData={setData} */ data={data}
              key={c._id}
            />
          ))}
        </ContainerComments>
      )}
    </div>
  );
}
