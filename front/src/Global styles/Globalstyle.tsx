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
  --mainBody:white;
  --mainBlue:#2775a8;
  --mainBlueHover:#226491;
   --mainGreen:#1f9c35; 
     --mainWhite: #fff;
  --mlGreen:#00a650;
  --mainGreenHover:#187829;
  --mainPink:#ff8000;
/*    --mainPink:#ffa2a2;  */

   --mainGray:grey;
   --mainRed:crimson;


  --white2: rgb(248, 242, 242);
  --fbBlue: #1877f2;
  --fbGreen: #42b72a;
  --overlayReg: rgba(254, 254, 254, 0.8);

  --grey: rgb(133, 133, 133);
  --greyless: rgb(180, 174, 174);
  --light: rgb(226, 220, 220);
  --transition: 0.6s;
  --fbBlueOficial: #4267b2;

  --fbBody: #18191a;
  --fbMessageBody: #242526;
  --fb3erBody: rgb(66, 66, 75);

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
    background-color: grey;
  }
  &::-webkit-scrollbar {
    /* la width es p/scroll on the Y axis */
    width: 5px;
    /* la height es para horizontal scroll */
    height: 5px;
    background-color: grey;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: white;
  }
`;
