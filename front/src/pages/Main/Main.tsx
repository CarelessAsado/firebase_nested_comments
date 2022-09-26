import NewTaskForm from "pages/Main/auxiliaries/NewTaskForm";
import Tasks from "pages/Main/auxiliaries/Tasks";
import { useTareasGlobalContext } from "hooks/useTareasGlobalContext";
import styled from "styled-components";

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
  const { tareas, isFetching } = useTareasGlobalContext();
  return (
    <Container>
      <NewTaskForm></NewTaskForm>
      <Center>
        {tareas.length > 0
          ? tareas.map((i) => {
              return <Tasks key={i._id} tarea={i} />;
            })
          : !isFetching && <Notasks>No tasks saved yet.</Notasks>}
      </Center>
    </Container>
  );
};
