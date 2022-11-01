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

const firstTopLevel = {
  path: ",6355d1207f88f3934f46bf62",
  value: "Hola Mani",
  _id: "63603543a85360f02127dab1",
};
//este se ve en la primer tanda, y en la 2da
const changeTopLevel = {
  path: ",6355d1207f88f3934f46bf62,63603543a85360f02127dab1,63603b54a85360f02127db44,63603db2a85360f02127db66,63603dcfa85360f02127db76",
  value: "are you down",
  _id: "63603df7a85360f02127db8a",
};
//el primer level ya esta cubierto
//tenemos q arrancar en no 2 y terminar en no 2
const indexPrior = changeTopLevel.path.split(",").length - 4;
console.log(changeTopLevel.path.split(",")[indexPrior]);
