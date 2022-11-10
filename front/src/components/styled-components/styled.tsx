import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";

export const Container = styled.div`
  min-height: 100vh;
  padding-top: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  place-items: center;
  grid-column-gap: 40px;

  @media screen and (max-width: 720px) {
    & {
      display: grid;
      grid-template-columns: 1fr;
    }
  }
`;

export const ContainerNotLogin = styled(Container)`
  grid-template-columns: 1fr;
`;
export const SectionRight = styled.div`
  & .textoAdicional {
    padding: 30px 20px 30px;
    max-width: 370px;
  }
`;
export const SectionLeft = styled.div`
  padding: 20px 20px 30px;
  align-self: flex-start;
  & p {
    font-family: "Roboto Mono", monospace;
    font-weight: bold;
  }
  @media screen and (max-width: 720px) {
    & {
      text-align: center;
      max-width: 370px;
      align-self: center;
    }
  }

  @media (max-width: 416px) {
    padding-left: 0;
    padding-right: 0;
  }
`;
export const Header = styled.h2`
  margin: 0 10px;
  color: #6fb9be;
  font-size: 2.5rem;
  margin-bottom: 30px;
`;
export const RodriBook = styled.h1`
  color: var(--fbBlue);
  font-weight: bold;
  font-size: 3.5rem;
  padding: 20px 0;
`;
export const Input = styled.input`
  margin: 0 10px;
  border-radius: 6px;
  border: 1px solid var(--light);
  letter-spacing: 1px;
  padding: 14px;

  margin: 7px 0;
  font-size: var(--fontMed);

  /*Sin esto se contrae*/
  width: 100%;

  &::placeholder {
    letter-spacing: 2px;
  }
  &:focus::-webkit-input-placeholder {
    color: var(--greyless);
  }
  &:focus {
    outline: none;
    border: 1px solid var(--lightblue);
  }
  &[type="submit"] {
    color: inherit;
    border: none;

    width: calc(100% -32px);
    background-color: var(--fbBlue);
    cursor: pointer;
  }
`;
export const SecondaryButton = styled(Input)`
  color: inherit;
  border: none;
  letter-spacing: 1px;
  width: 170px;
  background-color: var(--fbGreen);
  font-weight: bold;
  font-size: 15px;
  text-align: center;
  cursor: pointer;
`;
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 20px 20px 30px;
  max-width: 370px;
  background-color: var(--fbMessageBody);
  border: 1px solid var(--light);
  border-radius: 3px;
  box-shadow: -1px 7px 18px 0px rgba(0, 0, 0, 0.25);
  -webkit-box-shadow: -1px 7px 18px 0px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: -1px 7px 18px 0px rgba(0, 0, 0, 0.25);
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
