import React, { useState } from "react";
import styled from "styled-components";
import {
  AiFillEdit,
  AiOutlineCloseCircle,
  AiOutlineCheck,
} from "react-icons/ai";
import { dataPasswords } from "./data";
import { useAppDispatch } from "hooks/reduxDispatchAndSelector";
import { updateEmail, updatePwd, updateUsername } from "context/userSlice";
import { dispatchNotification } from "config/utils/dispatchNotification";
import { ChangePicOverlay } from "./ChangePicOverlay";
import Spinner from "components/loaders/loader";

const FlexIt = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`;
const ContactoContainer = styled.div`
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: ${(props) => props.theme.secondaryBody};
`;
const Header = styled.h2`
  font-size: inherit;
  border-bottom: 1px solid ${(props) => props.theme.border};
  padding: 10px;
`;
const ContactInfo = styled.div`
  display: flex;
  overflow-x: hidden;
`;
interface StyledProps {
  editPwd: boolean;
}
export const Section = styled.form<StyledProps>`
  padding: 10px;
  transition: 0.3s;
  flex-shrink: 0;
  width: 100%;
  transform: ${(props) =>
    props.editPwd ? "translateX(-100%)" : "translateX(0px)"};
  display: flex;
  flex-direction: column;
  gap: 7px;
  justify-content: space-between;
`;
export const EditPic = styled(Header)`
  cursor: pointer;
  border-top: 1px solid ${(props) => props.theme.border};
`;
export const Nombre = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  & h2 {
    font-size: calc(var(--fontSmall) + 0.1rem);
  }
`;
export const Email = styled(Nombre)`
  word-break: break-all;
`;
export const ReactIcon = styled.div`
  text-align: right;
  font-size: var(--fontMed);
  color: var(--fbBlue);
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    transform: scale(1.005);
  }
  &.check {
    color: var(--mainGreen);
  }
  &.cancel {
    color: var(--mainRed);
  }
`;
const ChangePwd = styled.h2`
  cursor: pointer;
  font-size: inherit;
`;
const Input = styled.input`
  &:focus::placeholder {
    color: rgb(175, 168, 175);
  }
  padding: 10px;
  font-size: calc(var(--fontSmall - 0.1rem));
  width: 100%;
  border-radius: 10px;
`;
const Button = styled.button`
  cursor: pointer;
  color: var(--mainWhite);
  background-color: var(--fbGreen);
  padding: 5px;
  width: calc(80px + var(--fontSmall));
  font-size: inherit;
  &.danger {
    background-color: var(--mainRed);
  }
`;

const pwdInitialState = {
  oldPwd: "",
  newPwd: "",
  confirmaPwd: "",
};
export type PasswordsInputType = typeof pwdInitialState;

export function Contacto({
  user,
  isOwner,
}: {
  user: UserNotNull;
  isOwner: boolean;
}) {
  const [editName, setEditName] = useState(false);
  const [nombre, setNombre] = useState(user?.username);
  const [editEmail, setEditEmail] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [Indloading, setLoading] = useState(false);
  const [editPwd, setEditPwd] = useState(false);
  const dispatch = useAppDispatch();

  async function submitChangeName(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<SVGElement, MouseEvent>
  ) {
    e.preventDefault();
    if (nombre === user?.username) {
      return setEditName(false);
    }
    try {
      setLoading(true);

      await dispatch(updateUsername({ ...user, username: nombre })).unwrap();
      //SHOW SUCCESS MESSAGE
      dispatchNotification(dispatch, "Username updated successfully.");
    } catch (error) {
    } finally {
      setEditName(false);
      setLoading(false);
    }
  }

  async function submitChangeEmail(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<SVGElement, MouseEvent>
  ) {
    e.preventDefault();
    if (email === user?.email) {
      return setEditEmail(false);
    }
    try {
      setLoading(true);

      await dispatch(updateEmail({ ...user, email })).unwrap();

      //SHOW SUCCESS MESSAGE
      dispatchNotification(dispatch, "Email updated successfully.");
    } catch (error) {
    } finally {
      setEditEmail(false);
      setLoading(false);
    }
  }
  /* ----------------CHANGE PASSWORD SECTION-------------------- */

  const [passwords, setPasswords] = useState(pwdInitialState);
  async function handlePwdEditSubmit(
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    try {
      setLoading(true);
      /*  VALIDATION CHECK */
      const notValidated = Object.values(passwords).some((i) => !i);

      if (notValidated) {
        return dispatchNotification(dispatch, "Fields cannot be empty.");
      }
      await dispatch(updatePwd(passwords)).unwrap();

      //SHOW SUCCESS MESSAGE
      dispatchNotification(dispatch, "Password updated successfully.");
      /* clean inputs + go back to original UI */
      setPasswords(pwdInitialState);
      setEditPwd((v) => !v);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  function handlePwdsChange({ target }: React.ChangeEvent<HTMLInputElement>) {
    setPasswords({ ...passwords, [target.name]: target.value });
  }

  const [show, setShow] = useState(false);
  return (
    <ContactoContainer>
      <Header>
        <FlexIt>
          Personal info{" "}
          {Indloading && (
            <Spinner
              fz={"var(--fontSmall)"}
              h="100%"
              color="var(--mainWhite)"
            />
          )}
        </FlexIt>
      </Header>

      <ContactInfo>
        {/* -------------TEMPLATE P/NOMBRE Y A FUTURO MAIL--------------------- */}
        {/* me di cta q si apretaba ENTER luego de tipear el form enviaba la info, asi q le puse onSubmit event aca tmb */}
        <Section editPwd={editPwd} onSubmit={submitChangeName}>
          <Nombre>
            <FlexIt>
              <h2>Name</h2>
              {!isOwner ? (
                false
              ) : editName ? (
                <FlexIt>
                  <ReactIcon className="cancel">
                    <AiOutlineCloseCircle
                      onClick={() => setEditName((v) => !v)}
                    />
                  </ReactIcon>
                  <ReactIcon className="check">
                    <AiOutlineCheck onClick={submitChangeName} />
                  </ReactIcon>
                </FlexIt>
              ) : (
                <ReactIcon onClick={() => setEditName((v) => !v)}>
                  <AiFillEdit />
                </ReactIcon>
              )}
            </FlexIt>

            {editName ? (
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoFocus
              />
            ) : (
              user?.username
            )}
          </Nombre>

          {/* -----------------EMAIL------------------- */}
          <Email>
            <FlexIt>
              <h2>Email</h2>
              {!isOwner ? (
                false
              ) : editEmail ? (
                <FlexIt>
                  <ReactIcon className="cancel">
                    <AiOutlineCloseCircle
                      onClick={() => setEditEmail((v) => !v)}
                    />
                  </ReactIcon>
                  <ReactIcon className="check">
                    <AiOutlineCheck onClick={submitChangeEmail} />
                  </ReactIcon>
                </FlexIt>
              ) : (
                <ReactIcon onClick={() => setEditEmail((v) => !v)}>
                  <AiFillEdit />
                </ReactIcon>
              )}
            </FlexIt>

            {editEmail ? (
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            ) : (
              user?.email
            )}
          </Email>
          {isOwner && (
            <ChangePwd onClick={() => setEditPwd((v) => !v)}>
              Change password
            </ChangePwd>
          )}
        </Section>
        {/* -------------TEMPLATE P/EDITAR CONTRASEñA--------------------- */}
        {isOwner && (
          <Section editPwd={editPwd} onSubmit={handlePwdEditSubmit}>
            <Nombre>
              <div>Write down your old and new password.</div>
              {dataPasswords.map((i) => {
                const { id, placeholder } = i;
                return (
                  <Input
                    key={id}
                    type="password"
                    value={passwords[id]}
                    name={id}
                    onChange={handlePwdsChange}
                    placeholder={placeholder}
                    autoComplete="off"
                  />
                );
              })}

              <FlexIt>
                <Button
                  type="button"
                  className="danger"
                  onClick={() => setEditPwd((v) => !v)}
                  disabled={Indloading}
                >
                  Go back
                </Button>
                <Button onClick={handlePwdEditSubmit} disabled={Indloading}>
                  Confirm
                </Button>
              </FlexIt>
            </Nombre>
          </Section>
        )}
      </ContactInfo>
      {/* --------------EDIT PROFILE PICTURE--------------------- */}
      {isOwner && (
        <EditPic onClick={() => setShow((v) => !v)}>
          Edit your profile picture
        </EditPic>
      )}

      {show && (
        <ChangePicOverlay show={show} close={() => setShow((v) => !v)} />
      )}
    </ContactoContainer>
  );
}
