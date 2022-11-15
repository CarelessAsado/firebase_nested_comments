import React, { useState } from "react";

import styled from "styled-components";
import { MdAddAPhoto } from "react-icons/md";
import { OverlayStructure } from "components/OverlayStructure/Overlay";
import { CloseButton } from "components/styled-components/styled";
import { useAppDispatch, useAppSelector } from "hooks/reduxDispatchAndSelector";
import { uploadImg } from "context/userSlice";
import { dispatchNotification } from "config/utilsFns/dispatchNotification";
import Spinner from "components/loaders/loader";

type SubContainerProps = {
  flexIt?: boolean;
};
export const SubContainer = styled.div<SubContainerProps>`
  padding: 20px;
  display: ${(props) => (props.flexIt ? "flex" : "block")};
  justify-content: space-between;
  font-size: 1.3rem;
  gap: 10px;
  color: var(--fbBody);
`;
type BtnProps = {
  danger?: boolean;
};
export const Btn = styled.div<BtnProps>`
  padding: 10px;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) =>
    props.danger ? "var(--mainRed)" : "var(--mainGreen)"};
  border: 1px solid ${(props) => props.danger && "var(--mainRed)"};
  &:hover {
    background-color: ${(props) => props.danger && "var(--mainRed)"};
  }
  width: 100px;
  text-align: center;
`;
const Header = styled.h2`
  position: relative;
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
  padding: 30px 20px 20px 50px;
  text-transform: uppercase;
`;
const Line = styled.div`
  background-color: var(--greyless);
  height: 1px;
`;
const LabelImg = styled.label`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  & > * {
    font-size: 6rem;
  }
`;
const Input = styled.input`
  display: none;
`;
const ContainerImg = styled.div`
  position: relative;
  height: 250px;
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
export const ChangePicOverlay = ({ show, close }: OpenCloseOv) => {
  const { loading, user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [img, setImg] = useState<File | string>(user?.img as string);

  async function handleSubmit(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    const dataImg = new FormData();
    dataImg.append("profile", img as Blob);
    dispatch(uploadImg({ user: user as UserNotNull, img: dataImg }))
      .unwrap()
      .then(() => {
        dispatchNotification(
          dispatch,
          "You updated your profile pic successfully."
        );
        close();
      })
      .catch(() => {});
  }

  return (
    <OverlayStructure show={show} close={close}>
      <Header>
        <CloseButton
          f={(e) => {
            e.stopPropagation();
            setImg("");
            close();
          }}
        />
        Edit profile picture
      </Header>
      <Line />
      <SubContainer>
        {!!img ? (
          <ContainerImg>
            <Img
              src={
                typeof img === "string" ? img : URL.createObjectURL(img as Blob)
              }
            ></Img>
            <CloseButton
              f={(e) => {
                e.stopPropagation();
                setImg("");
              }}
            />
          </ContainerImg>
        ) : (
          <LabelImg htmlFor="uploadNewPic" onClick={(e) => e.stopPropagation()}>
            <MdAddAPhoto />
            Select image.
            <Input
              as="input"
              type="file"
              id="uploadNewPic"
              value={img}
              onChange={(e) => {
                setImg(e.target.files?.[0] as File);
              }}
            ></Input>
          </LabelImg>
        )}
      </SubContainer>

      <Line />
      <SubContainer flexIt>
        <Btn
          danger
          onClick={(e) => {
            e.stopPropagation();
            setImg("");
            close();
          }}
        >
          Cancel
        </Btn>

        <Btn onClick={handleSubmit}>
          {loading ? (
            <Spinner
              fz={"var(--fontSmall)"}
              h="100%"
              color="var(--mainWhite)"
            />
          ) : (
            "Confirm"
          )}
        </Btn>
      </SubContainer>
    </OverlayStructure>
  );
};
