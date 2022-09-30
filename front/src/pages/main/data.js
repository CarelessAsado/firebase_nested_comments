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
