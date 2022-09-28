import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { deleteTasks, updateTasks } from "context/userSlice";

interface StyledProps {
  done: boolean;
  isEditing: boolean;
}
const Tarea = styled.div<StyledProps>`
  background-color: #2775a8;
  margin: 5px;
  border-radius: 10px;
  color: white;
  font-size: 1.75rem;
  padding: 0 0 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  text-decoration: ${(props) =>
    !props.isEditing && props.done && "line-through"};
  @media (max-width: 430px) {
    flex-direction: column;
    padding: 0;
  }
`;
const Functionality = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  @media (max-width: 430px) {
    justify-content: space-between;
    width: 100%;
  }
`;
const Delete = styled.div`
  font-size: 1.75rem;
  font-weight: bold;
  cursor: pointer;
  background-color: #201c1c;
  display: flex;
  padding: 20px;
  &:hover {
    background-color: #272c44;
  }
`;
/* extender caracteristicas a los otros iconos*/
const Update = styled(Delete)``;
const CheckDone = styled(Delete)``;
/*---------------------*/
const EditInput = styled.input`
  color: #6b1010;
  &:read-only {
    color: inherit;
  }
  width: 100%;
  font-size: inherit;
  background-color: inherit;
  overflow-y: scroll;
  @media (max-width: 430px) {
    padding: 20px 10px;
  }
`;
interface Props {
  tarea: ITarea;
}
const Tasks: React.FC<Props> = ({ tarea }) => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { name, _id, done } = tarea;

  const editInput = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [editInputBis, setEditInputBis] = useState<string>(name);
  const [justEdited, setJustEdited] = useState(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);

  const userID = user?._id || "";

  function changeEditStatus() {
    if (isEditing) {
      return;
      //WE RETURN SINCE THE BLUR EVENT on the input WILL AUTOMATICALLY CALL THE UPDATE API (we dont wanna call it twice)
    }
    if (!isEditing && clicked) {
      setClicked(false);
      //means we originally clicked the pen, so we set clicked back to its original state, and let the blur event on the input handle the update
      return;
    }
    if (!justEdited) {
      setClicked(true);
      return setIsEditing(true);
    }
  }

  function editName() {
    setIsEditing(false);
    setJustEdited(true);
    setTimeout(() => {
      //esto es p/el caso q el blur ev coincida con el click ev en el icono de update. En ese caso, durante medio segundo dejamos justEdited true, p/q la funcion en el click handler no vuelva a cambiar el isEditing a true (el Blur ev sucede primero, y cambia isEditing a false. Entonces pasaba q el click ev veia isEditing false, y lo cambiaba a true)
      setJustEdited(false);
    }, 500);
    if (editInput?.current?.value === name) return;
    dispatch(updateTasks({ task: { ...tarea, name: editInputBis }, userID }));
  }

  useEffect(() => {
    if (isEditing) {
      editInput?.current?.focus();
    }
  }, [isEditing]);

  return (
    <Tarea done={done} isEditing={isEditing}>
      <EditInput
        onBlur={editName}
        onClick={() => setIsEditing(true)}
        ref={editInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setEditInputBis(e.target.value);
        }}
        value={editInputBis}
        readOnly={!isEditing}
      />
      <Functionality>
        <Update onClick={changeEditStatus}>
          <AiFillEdit />
        </Update>
        <CheckDone
          onClick={() =>
            dispatch(
              updateTasks({ task: { ...tarea, done: !tarea.done }, userID })
            )
          }
        >
          {done ? <ImCheckboxChecked /> : <ImCheckboxUnchecked />}
        </CheckDone>
        <Delete onClick={() => dispatch(deleteTasks({ id: _id, userID }))}>
          <AiFillDelete></AiFillDelete>
        </Delete>
      </Functionality>
    </Tarea>
  );
};

export default Tasks;
