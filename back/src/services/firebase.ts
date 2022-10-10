import { auth } from "firebase-admin";
import { initializeApp, applicationDefault } from "firebase-admin/app";

console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS, "hola");
initializeApp({
  credential: applicationDefault(),
});

export const firebaseAuth = auth();
