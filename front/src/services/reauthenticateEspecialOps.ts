import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { fireBaseAuth } from "./firebaseConfig";

export default function reauthenticateSpecialOps(pwd?: string) {
  const firebaseUser = fireBaseAuth?.currentUser as NonNullable<
    typeof fireBaseAuth.currentUser
  >;

  const password = pwd || prompt("Please enter your password") || "";

  const credential = EmailAuthProvider.credential(
    firebaseUser.email as string,
    password
  );

  return reauthenticateWithCredential(firebaseUser, credential);
}
