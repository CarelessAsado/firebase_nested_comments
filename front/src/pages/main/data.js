import { Action } from "@remix-run/router";

export const dataPuppy = [
  {
    val: "PARENT",
    path: "",
    id: "1664503411565",
  },
  {
    val: "HIJO 1",
    path: ",1664503411565",
    id: "1664503415653",
  },
  {
    val: "cc",
    path: ",1664503411565",
    id: "1664503459327",
  },
  {
    val: "2DO PARENT",
    path: "",
    id: "1664503618831",
  },
  {
    val: "HIJO 2DO PARENT",
    path: ",1664503618831",
    id: "16645036188666",
  },
  {
    val: "HIJO DEL HIJO",
    path: ",1664503618831,16645036188666",
    id: "166450361883156",
  },

  {
    val: "ddd",
    path: ",1664503411565",
    id: "1664503708038",
  },
];

console.log(dataPuppy[3].id);
/* --------HIJO----------------------------- */
console.log(dataPuppy[4].path.split(","));
console.log(dataPuppy[4]);
console.log(dataPuppy[5]);

console.log(dataPuppy[1].path.includes());

/* ----------------------------------CON ESTA MANERA ELIMINO EL ITEM EN DONDE APRETO ELIMINAR + todos los subchildren*/
console.log(dataPuppy.filter((i) => !i.path.includes(dataPuppy[4].path)));
const topLevel = ",5";
const path = "1,2,3,4,5,6,7,8";
console.log(topLevel.split(","));
const startedAt = path.split(",").findIndex((i) => i === topLevel);
const nowAt = path.split(",").length;
if (nowAt - startedAt === 4) {
  //add a btn to maybe fetch more, if there are more comments
  //update useState with the new topLevel when btnPressed
  //how can I deal with go back to previous comment
  //stop recursion
}
console.log(nowAt - startedAt);

state.items = state.items.map((i) =>
  i.id === action.payload.id ? { ...i, ...action.payload.data } : i
);

const firstTopLevel = {
  path: ",6355d1207f88f3934f46bf62",
  updatedAt: "2022-10-31T20:51:15.757Z",
  userID: {
    _id: "63507b997616f4109296833c",
    username: "Developer",
    img: "https://res.cloudinary.com/dxzaig6ek/image/upload/v1666219654/TS_FIREBASE/m6jfziddwpg7oyq1cfki.png",
  },
  value: "Hola Mani",
  __v: 0,
  _id: "63603543a85360f02127dab1",
};
const changeTopLevel = {
  path: ",6355d1207f88f3934f46bf62,63603543a85360f02127dab1,63603b54a85360f02127db44,63603db2a85360f02127db66,63603dcfa85360f02127db76",
  updatedAt: "2022-10-31T21:28:23.967Z",
  userID: {
    _id: "63507b997616f4109296833c",
    username: "Developer",
    img: "https://res.cloudinary.com/dxzaig6ek/image/upload/v1666219654/TS_FIREBASE/m6jfziddwpg7oyq1cfki.png",
  },
  value: "are you down",
  __v: 0,
  _id: "63603df7a85360f02127db8a",
};
