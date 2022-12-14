import styled from "styled-components";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BiLogOut,
  BiLogIn,
  BiUser,
  BiHomeHeart,
  BiUserPlus,
} from "react-icons/bi";
import { FRONTEND_ENDPOINTS } from "config/constants";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { logout } from "context/userSlice";

export const navHeight = "60px";
const showBurgerButton = "550px";
const BlockBehindNavBar = styled.div`
  height: ${navHeight};
`;
const NavBar = styled.nav`
  height: ${navHeight};
  background-color: var(--mainWhite);
  color: var(--fbBody);
  padding: 0 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 10;
  top: 0;
  width: 100%;
  @media (max-width: 800px) {
    padding: 0 50px;
  }
  @media (max-width: 500px) {
    padding: 0 20px;
  }
  @media (max-width: 400px) {
    padding: 0 8px;
  }
`;
const Logo = styled.div`
  color: var(--mainBlue);
  font-size: 3rem;
  transition: 0.3s;
  &:hover {
    transform: scale(1.1);
  }
  @media (max-width: 500px) {
    font-size: 2.3rem;
  }
`;
interface PropsShowNav {
  show: boolean;
}

export const Overlay = styled.div<PropsShowNav>`
  height: 100%;

  @media (max-width: ${showBurgerButton}) {
    transition: 0.3s;
    position: fixed;
    top: ${navHeight};
    left: 0;
    bottom: 0;

    background-color: rgba(0, 0, 0, 0.2);
    width: 100%;
    transform: ${(props) => !props.show && "translateX(-3000%)"};
  }
`;
interface IPadding {
  padding?: boolean;
}

const Links = styled.ul`
  width: 100%;
  height: 100%;
  display: flex;
  //stretch full height of the nav, dont set height on children
  align-items: stretch;
  /*   justify-content: space-between; */
  /*   justify-content: center; */
  @media (max-width: ${showBurgerButton}) {
    //dejar 20px de overlay en p/q se vea el background
    width: calc(100% - 20px);

    flex-direction: column;

    justify-content: center;

    background-color: var(--mainBlue);
    color: var(--mainWhite);
  }
`;

//align stretch no anda si el child tiene height 100%, pero s?? si pon??s "auto"
const LinkItem = styled.li<IPadding>`
  flex: 1;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.padding && "10px"};
  font-size: var(--fontSmall);
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #b2e7f0;
  }
  @media (max-width: ${showBurgerButton}) {
    flex-grow: 0;
    &:hover {
      background-color: var(--mainBlueHover);
    }
  }
`;
const NavLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  height: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  padding: 10px;
`;
const Span = styled.span`
  @media (max-width: 400px) {
    display: none;
  }
`;
const BurgerButton = styled.div<PropsShowNav>`
  border: 3px solid var(--mainBlue);
  height: calc(100% - 5px);
  width: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  cursor: pointer;

  & div {
    transition: 0.3s;
    width: calc(100% - 5px);
    height: 3px;
    border-radius: 5px;
    background-color: var(--mainBlue);
  }
  /* ----------------------ANIMATION------------------------------ */
  & div:nth-child(1) {
    transform: ${(props) =>
      props.show && "rotate(45deg) translate(10px, 10px)"};
  }
  & div:nth-child(2) {
    transform: ${(props) => props.show && "translateX(30px)"};
    background: ${(props) => props.show && "transparent"};
  }
  & div:nth-child(3) {
    transform: ${(props) =>
      props.show && "rotate(-45deg) translate(8px, -10px)"};
  }
  /*------------------------------------------------------------- */
  @media (min-width: ${showBurgerButton}) {
    display: none;
  }
`;
const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const Nav = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [showNav, setShowNav] = useState<boolean>(false);
  return (
    <>
      <BlockBehindNavBar />
      <NavBar>
        <Link to={FRONTEND_ENDPOINTS.HOME}>
          <Logo>ROD</Logo>
        </Link>
        <BurgerButton show={showNav} onClick={() => setShowNav((v) => !v)}>
          <div></div>
          <div></div>
          <div></div>
        </BurgerButton>
        <Overlay show={showNav} onClick={() => setShowNav((v) => !v)}>
          <Links>
            {user ? (
              <>
                <LinkItem>
                  <NavLink to={FRONTEND_ENDPOINTS.HOME}>
                    <BiHomeHeart />
                    <Span>Home</Span>
                  </NavLink>
                </LinkItem>
                <LinkItem>
                  <NavLink to={FRONTEND_ENDPOINTS.PROFILEdyn(user._id)}>
                    {user?.img ? (
                      <ProfilePic src={user.img}></ProfilePic>
                    ) : (
                      <BiUser />
                    )}

                    {user.username.split(" ")[0].length > 10
                      ? "user"
                      : user.username.split(" ")[0]}
                  </NavLink>
                </LinkItem>
                <LinkItem onClick={() => dispatch(logout())} padding>
                  <BiLogOut />
                  <Span>Logout</Span>
                </LinkItem>
              </>
            ) : (
              <>
                <LinkItem>
                  <NavLink to={FRONTEND_ENDPOINTS.REGISTER}>
                    <BiUserPlus />
                    Register
                  </NavLink>
                </LinkItem>
                <LinkItem>
                  <NavLink to={FRONTEND_ENDPOINTS.LOGIN}>
                    <BiLogIn></BiLogIn>
                    Login
                  </NavLink>
                </LinkItem>
              </>
            )}
          </Links>
        </Overlay>
      </NavBar>
    </>
  );
};
