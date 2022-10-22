import { IOType } from "..";
import User, { IUser } from "../models/User";
import { firebaseAuth } from "./firebase";

//pasar todo esto a una carpeta aparte
//ver como puedo refactorizar auth p/ no duplicar codigo con el middleware
//como mando el error en caso de falla? como impido la conexion??
interface IUserChat extends IUser {
  currentChats: string[];
}
export function startSocket(io: IOType) {
  let connectedUsers: IUserChat[] = [];

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    //podés validar cada message, pero creo q es + practico hacer una primer auth cuando el socket id entra y listo
    //lo otro q puedo averiguar, es si puedo identificar el event, "first" dentro del socket, y solo en ese caso aplico auth middle
    console.log("MIDDLEWARE IO");
    // ...
    console.log(socket.connected, socket.id, 666);

    next();
  });
  io.on("connection", (socket) => {
    //con esta global variable ya tengo identificado la socket.id hasta q se desconecte el socket
    const idSocket = socket.id;
    console.log(
      "holllllllllllllllllllllllllllllllllllllllllllllllllllllllaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    );
    console.log(socket.connected);

    socket.on("first", async (data) => {
      try {
        const { uid } = await firebaseAuth.verifyIdToken(data);
        //buscar si el user ya abrió un chat y esta en connectedUsers
        const alreadyConnectedMaybe = connectedUsers.find(
          (user) => user.uid === uid
        );
        if (alreadyConnectedMaybe) {
          alreadyConnectedMaybe.currentChats.push(idSocket);
        } else {
          const found = await User.findOne({ uid });
          if (!found) {
            throw new Error("User must log in");
          }
          found;
          connectedUsers.push({
            ...found._doc,
            currentChats: [idSocket],
          } as IUserChat);
        }
        io.emit("newUserConnected", connectedUsers);
        console.log(connectedUsers);
        console.log(connectedUsers.length);
        //TENGO Q EVITAR Q EL USER ESTE DOS VECES EN LA MISMA DATABASE??? si el user ya esta conectado quizas le puedo agregar un array de links/id de socket?
      } catch (error) {
        console.log(error, 666, "AUTH IN IO");
      }
    });

    socket.on("commentPosted", async (data) => {
      try {
        //aca tendria q hacer un POST EN EL COMMENT MMMM NO, creo q lo mejor es mandar el comment guardado en el payload, o no?
        //tengo q buscar el user en una fn, si no aparece, tendria q mandar un error (o no?
        //TENGO Q VER COMO LIDIO CON LOS ERRORES

        socket.broadcast.emit("commentPosted", data);
        //TENGO Q EVITAR Q EL USER ESTE DOS VECES EN LA MISMA DATABASE??? si el user ya esta conectado quizas le puedo agregar un array de links/id de socket?
      } catch (error) {
        /* console.log(error, 666, "AUTH IN IO"); */
      }
    });

    //a string that lists the reason of the disconnection
    socket.on("disconnect", (reason) => {
      console.log(999999999999999999999, "disconnected");
      console.log(
        connectedUsers.length,
        connectedUsers,
        idSocket,
        "aca tengo q depurar esto de la lista,",
        333
      );
      connectedUsers = connectedUsers
        .map((i) => {
          if (i.currentChats.includes(idSocket)) {
            const updatedCurrentChats = i.currentChats.filter(
              (sockId) => sockId !== idSocket
            );
            return {
              ...i,
              currentChats: updatedCurrentChats,
            } as IUserChat;
          }
          return i;
        })
        .filter((i) => i.currentChats.length > 0);
      console.log(connectedUsers.length, connectedUsers);
      //EMITIR UN EVENT A TODOS LOS USERS P/ACTUALIZAR USERSONLINE
      socket.broadcast.emit("userLeft", connectedUsers);
      console.log(connectedUsers);
    });
  });
}
