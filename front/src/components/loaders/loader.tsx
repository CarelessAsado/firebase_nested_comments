import styled from "styled-components";
import { AiOutlineLoading } from "react-icons/ai";

interface PreloaderProps {
  fz: string;
  h: string;
  color?: string;
}
const Preloader = styled.div<PreloaderProps>`
  font-size: ${({ fz }) => (fz ? fz : "5rem")};
  height: ${({ h }) => (h ? h : "30vh")};
  display: flex;
  justify-content: center;
  align-items: center;
  & > * {
    animation: spin 1s infinite linear;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
`;
const Spinner = ({ fz, h, color = "black" }: PreloaderProps) => {
  return (
    <Preloader fz={fz} h={h}>
      <AiOutlineLoading color={color} />
    </Preloader>
  );
};
export default Spinner;
