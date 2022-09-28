import styled from "styled-components";
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
const BlockBehindNavBar = styled.div`
  height: 60px;
`;
const NavBar = styled.nav`
  height: 60px;
  background-color: white;
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
  color: #2775a8;
  font-size: 3rem;
  transition: 0.3s;
  &:hover {
    transform: scale(1.1);
  }
  @media (max-width: 500px) {
    font-size: 2.3rem;
  }
`;
const Links = styled.ul`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const LinkItem = styled.li`
  height: inherit;
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #b2e7f0;
  }
  @media (max-width: 500px) {
    font-size: 1.25rem;
    padding: 5px;
  }
  @media (max-width: 400px) {
    font-size: 1.2rem;
    padding: 2px;
  }
`;
const NavLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  height: inherit;
  display: flex;
  align-items: center;
  gap: 5px;
`;
const Span = styled.span`
  @media (max-width: 400px) {
    display: none;
  }
`;
export const Nav = () => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  return (
    <>
      <BlockBehindNavBar />
      <NavBar>
        <Link to={FRONTEND_ENDPOINTS.HOME}>
          <Logo>ROD</Logo>
        </Link>
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
                  <BiUser />
                  {user.username.split(" ")[0].length > 10
                    ? "user"
                    : user.username.split(" ")[0]}
                </NavLink>
              </LinkItem>
              <LinkItem onClick={() => dispatch(logout())}>
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
      </NavBar>
    </>
  );
};
