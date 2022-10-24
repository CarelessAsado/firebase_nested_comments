import { useEffect, useState } from "react";

import styled from "styled-components";
import { FRONTEND_ENDPOINTS } from "config/constants";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { logout } from "context/userSlice";
import { Link, useParams } from "react-router-dom";
import { Contacto } from "./auxiliaries/ContactoContainer";
import * as userAPI from "API/user";
import errorHandler from "context/errorHandler";
import { Error } from "components/styled-components/styled";

export const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;
export const ProfileSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: var(--fontSmall);

  /* min-height: 100%; */
`;
export const ColumnFlex = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  /* separa info personal de historial de compras cuando estan en modo column */
  @media (max-width: 1000px) {
    padding-bottom: 20px;
  }
`;
export const TopPart = styled(ColumnFlex)`
  gap: 20px;
  flex: 1;
  gap: 20px;
`;

export const NoPurchase = styled.td`
  padding-top: 30px;
  text-align: center;
`;
export const Table = styled.table`
  width: 100%;
  border-spacing: 0;
`;

const BtnLogout = styled.button`
  background-color: inherit;
  color: ${(props) => props.theme.text};
  &:hover {
    color: white;
    background-color: ${(props) => props.theme.red};
  }
  font-size: inherit;
  letter-spacing: 2px;
  margin: 10px auto;
  border: 1px solid ${(props) => props.theme.red};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: max-content;
`;
const TopLink = styled(Link)`
  display: inline-block;
  max-height: var(--fontSmall);
  margin-top: -10px;
  margin-bottom: 8px;
`;
export const ProfileImg = styled.img`
  width: 100%;
  height: 30vh;
  object-fit: contain;
`;
export const UserProfile = () => {
  const { user, error } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [userProfile, setUserProfile] = useState<IUser>(null);

  //agregar al nav link profile btn
  const { id: paramsUserid } = useParams();

  useEffect(() => {
    //get USER PROFILE

    if (!paramsUserid) {
      //setError
      return;
    }

    userAPI
      .getSingleUserProfile(paramsUserid)
      .then(({ data }) => setUserProfile(data))
      .catch((er) => errorHandler(er, dispatch));
  }, [dispatch, paramsUserid]);

  console.log(userProfile);
  return (
    <Container>
      <ProfileImg src={userProfile?.img || ""}></ProfileImg>
      <TopLink to={`${FRONTEND_ENDPOINTS.HOME}`} style={{ padding: "20px 0" }}>
        Back to home
      </TopLink>
      <ProfileSection>
        <Error aria-live="assertive">{error}</Error>
        <ColumnFlex>
          <TopPart style={{ flex: 1 }} className="flex1 topPart">
            {!!userProfile && <Contacto user={userProfile} />}
          </TopPart>
          <BtnLogout onClick={() => dispatch(logout())}>Logout</BtnLogout>
        </ColumnFlex>
      </ProfileSection>
    </Container>
  );
};
