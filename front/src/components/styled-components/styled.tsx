import styled from "styled-components";
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
interface StyledProps {
  error: string | boolean;
}
export const Error = styled.div<StyledProps>`
  color: crimson;
  font-size: 1.5rem;
  padding: 10px;
  background-color: ${(props) => (props.error ? "#b2e7f0" : "inherit")};
`;
export const Bottom = styled.div`
  background-color: #f0efc1;
  color: #768810;
  padding: 20px;
  font-size: 1.5rem;
  margin: 50px 0 0;
  letter-spacing: 1px;
`;
