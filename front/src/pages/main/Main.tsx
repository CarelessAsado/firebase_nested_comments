import NewTaskForm from "pages/main/auxiliaries/CreateTaskForm";
import TaskItem from "pages/main/auxiliaries/TaskItem";
import styled from "styled-components";
import { useAppSelector } from "hooks/reduxDispatchAndSelector";
import { useEffect, useState } from "react";

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
const dataPuppy = [
  {
    val: "PARENT",
    path: "",
    id: "1664503411565",
  },
  {
    val: "HIJO 1",
    path: ",1664503411565",
    id: "1664503415653",
  },
  {
    val: "cc",
    path: ",1664503411565",
    id: "1664503459327",
  },
  {
    val: "2DO PARENT",
    path: "",
    id: "1664503618831",
  },
  {
    val: "HIJO 2DO PARENT",
    path: ",1664503618831",
    id: "16645036188666",
  },
  {
    val: "HIJO DEL HIJO",
    path: ",1664503618831,16645036188666",
    id: "166450361883156",
  },

  {
    val: "ddd",
    path: ",1664503411565",
    id: "1664503708038",
  },
];
interface IComment {
  val: string;
  path: string;
  id: string;
}
interface IProps {
  comment: IComment;
  children?: JSX.Element | JSX.Element[];
  setData: (value: React.SetStateAction<IComment[]>) => void;
  data: IComment[];
}

export const Main = () => {
  const { tareas, loading } = useAppSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [data, setData] = useState<IComment[]>(dataPuppy);
  const handleSubmit = () => {
    setData([...data, { val: comment, path: "", id: "" + Date.now() }]);
    setComment("");
  };
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
          {data
            .filter((it) => !it.path)
            .map((c) => (
              <CommentComp
                comment={c}
                setData={setData}
                data={data}
                key={c.id}
              />
            ))}
        </ContainerComments>
      </Center>
    </Container>
  );
};

function CommentComp({ comment, setData, data }: IProps) {
  const [newChildComment, setNewChildComment] = useState("");

  const expression = comment.path + "," + comment.id;
  const [children, setChildren] = useState<IComment[]>([]);
  const handleSubmit = () => {
    const id = JSON.stringify(Date.now());
    const path = comment.path
      ? `${comment.path},${comment.id}`
      : `,${comment.id}`;
    setData((v) => [...v, { val: newChildComment, path, id }]);
    setNewChildComment("");
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
      <Value>{comment.val}</Value>{" "}
      <div>
        <Input
          placeholder="Agregar comentario/child"
          value={newChildComment}
          onChange={(e) => setNewChildComment(e.target.value)}
        ></Input>{" "}
        <Button onClick={handleSubmit}>Comentar</Button>
        {/* <Button>Likear</Button> */}
      </div>
      {children.length > 0 && (
        <ContainerComments>
          {children.map((c) => (
            <CommentComp comment={c} setData={setData} data={data} key={c.id} />
          ))}
        </ContainerComments>
      )}
    </div>
  );
}
