import { createGlobalStyle, keyframes, css } from "styled-components";

export default createGlobalStyle`
* {
box-sizing: border-box;
outline: 0;
margin: 0;
padding: 0;
border: 0;
scroll-behavior:smooth;
}
:root {
  --mainBlue:#335ef0;
  --mainBlueHover:#1a49ee;
  /* --mainGreen:#1f9c; */
   --mainGreen:#1f9c35; 
  --mlGreen:#00a650;
  --mainGreenHover:#187829;
  --mainPink:#ff8000;
/*    --mainPink:#ffa2a2;  */
--fontSmall:1rem;
  --fontMed:1.2rem;
  --fontBig:1.4rem;
  --fontLarge:2rem;
}
@media (max-width:640px){
  :root{
   /*  --fontSmall:.9rem; */
    /* --fontMed:2rem; */
    --fontBig:1.2rem;
    --fontLarge:1.8rem;
  }
}
a{
  text-decoration:none;
  color:inherit;
}`;

export const animateOpacityFadeIn = keyframes`
  0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
`;
export const animateTranslateX = keyframes`
  0% {
      transform: translateX(-50%);
           opacity: 0;
    }

    100% {
      transform: translateX(0);
           opacity: 1;
    }
`;

export const ScrollStyles = css`
  overflow-y: scroll;

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: ${(props) => props.theme.border};
  }
  &::-webkit-scrollbar {
    /* la width es p/scroll on the Y axis */
    width: 5px;
    /* la height es para horizontal scroll */
    height: 5px;
    background-color: ${(props) => props.theme.border};
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: ${(props) => props.theme.blue};
  }
`;
