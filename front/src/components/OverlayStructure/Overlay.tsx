import ReactDOM from "react-dom";
import { ScrollStyles } from "Global styles/Globalstyle";
import styled from "styled-components";

interface IProps {
  show: boolean;
}
const Overlay = styled.div<IProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 500;
  background-color: rgba(0, 0, 0, 0.3);
  display: ${(props) => (props.show ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  /*----------------- SCROLL--------------------- */
  ${ScrollStyles}
`;
const Box = styled.div`
  width: 500px;
  border-radius: 5px;
  background-color: var(--mainBody);

  /*   background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text}; */
  margin: 0 10px;
  max-height: 90vh;
  //en edit compra overlay uso esto p/pasar a la sig seccion
  overflow-x: hidden;
  ${ScrollStyles}
`;

interface OverlayProps extends OpenCloseOv {
  children: JSX.Element | JSX.Element[];
}
export const OverlayStructure = ({ show, children, close }: OverlayProps) => {
  return ReactDOM.createPortal(
    <Overlay
      show={show}
      id="greyOverlay"
      onClick={(e) => {
        if (close && (e.target as HTMLTextAreaElement)?.id === "greyOverlay") {
          close();
        }
      }}
    >
      <Box>{children}</Box>
    </Overlay>,
    document.getElementById("modal") as HTMLElement
  );
};
