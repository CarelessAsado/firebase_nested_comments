import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";

export const Container = styled.div`
  background-color: #f1f5ff;
  min-height: 100vh;
  border: #faf7f7 1px solid;
  padding: 0 10px;
`;
export const Header = styled.h2`
  margin: 0 10px;
  color: #6fb9be;
  font-size: 2.5rem;
  margin-bottom: 30px;
`;
export const Input = styled.input`
  margin: 0 10px;
  font-size: 2rem;
  padding: 5px;
  letter-spacing: 2px;
  &::placeholder {
    letter-spacing: 2px;
  }
  &:focus {
    border: 1px solid #2968a3;
  }
  &[type="submit"] {
    border: 1px solid black;
    color: white;
    background: #106288;
    cursor: pointer;
    transition: 0.3s;
  }
  &[type="submit"]:hover {
    background: #2991a3;
  }
`;
export const Form = styled.form`
  padding: 60px 0;
  max-width: 1000px;
  margin: 160px auto;
  background-color: #3a4761;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 5px;
`;

export const Error = styled.div`
  color: crimson;
  font-size: var(--fontMed);
  padding: 10px;
`;
export const Bottom = styled.div`
  background-color: #f0efc1;
  color: #768810;
  padding: 20px;
  font-size: 1.5rem;
  margin: 50px 0 0;
  letter-spacing: 1px;
`;

type CloseBtnProps = {
  move?: boolean;
  f: (e: any) => void;
};

const ReactIconClose = styled.button<Pick<CloseBtnProps, "move">>`
  position: absolute;
  top: 20px;
  right: ${(props) => (props.move ? "20px" : "none")};
  left: ${(props) => (props.move ? "none" : "20px")};

  border-radius: 50%;
  cursor: pointer;
  font-size: var(--fontMed);
  padding: 10px;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #d7d7d7;
  }
`;

export const CloseButton = ({ f, move }: CloseBtnProps) => {
  return (
    <>
      <ReactIconClose onClick={f} move={move}>
        <AiOutlineClose />
      </ReactIconClose>
    </>
  );
};
