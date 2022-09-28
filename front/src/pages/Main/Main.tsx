import NewTaskForm from "pages/main/auxiliaries/CreateTaskForm";
import TaskItem from "pages/main/auxiliaries/TaskItem";
import styled from "styled-components";
import { useAppSelector } from "hooks/reduxDispatchAndSelector";

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
export const Main = () => {
  const { tareas, loading } = useAppSelector((state) => state.user);

  return (
    <Container>
      <NewTaskForm></NewTaskForm>
      <Center>
        {tareas.length > 0
          ? tareas.map((i) => {
              return <TaskItem key={i._id} tarea={i} />;
            })
          : !loading && <Notasks>No tasks saved yet.</Notasks>}
      </Center>
    </Container>
  );
};
