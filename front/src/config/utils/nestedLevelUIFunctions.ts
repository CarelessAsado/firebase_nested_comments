const NESTING_LIMIT_UI = 4;

export default function getImmediateChildren(
  comment: IComment,
  children: IComment[],
  topLevel?: string
) {
  const expression = comment.path + "," + comment._id;
  /* alert(expression); */
  /*   alert(comment.value); */
  console.log(
    "PARENT: ssssssssssssssssssssssssssssssssssssssss",
    comment.value
  );
  const remainder: IComment[] = [];
  const immediateChildren: IComment[] = [];
  if (comment._id === "6355d1207f88f3934f46bf62") {
    console.log(expression, 777);
    console.log(children, 777);
  }
  //Como decido a partir de donde loopear p/mostrar comentarios
  //primero hago un stop a los 5 niveles deep
  //tengo q saber si hay + comentarios p/fetchear (esolo podria dejar p/dsp)
  //si fetcheo, actualizo una parte de children en el parent component
  //y seteo nuevo top level??? o al reves? Creo q 1ero tengo q fetchear, xq si hay error es al dope setear nuevo level p/luego revertir

  /*
{path: ",6359b93b2265cc2049051de2"
userID: {_id: '63519a05c5b89abd7514e1b0', 
          username: 'Mani Baribault', 
          img: 'https://res.cloudinary.com/dxzaig6ek/image/upload/v1666293196/TS_FIREBASE/elktvgsebxdzcabggwio.jpg'}
value: "perfecto"
_id: "635d6d940a1f4df00369a509"}
*/
  //c/vez q arranco una tanda nueva, tengo q tomar nota del top level
  //mmmm, el top level pueden ser varios comments a la vez
  //tendria q hacer un components especial p/el top level, con un useState q arranque en "1". C/ vez q hace recursion, voy haciendo +1, cuando llego a 5 paro, y leo si hay next, xq quizas ya no hay mas comentarios

  /* // toplevel {
  prevTopLevelID: "12dd2q2d" //i am not sure i need prevTopLevel as its present on the path
  count:1, o currentLevelTopID: 5
  next: //mmmm no sé si necesito next, creo q lo puedo elaborar en el momento
} */

  //5
  //6
  //7
  //8
  //{id:9, path:["5,6,7,8"]}

  children.forEach(
    (i) => {
      //si el path del parent + el id del parent esta incluido en el path del child, pasa a la siguiente etapa
      if (i.path.includes(expression)) {
        //si la expresion es identica al path significa q es el proximo level (immediate children)
        if (i.path === expression) {
          return immediateChildren.push(i);
        }
        //lo guardamos p/la proxima loopeada
        remainder.push(i);
      }
    }
    //5 expression=",5"
    //6  {id:6, path:",5"}
    //7
    //8
    //{id:9, path:"5,6,7,8"}
  );

  return { immediateChildren, remainder };
}

export function goBackToPreviousNestedLevel(currentComment: IComment) {
  const indexPrior = currentComment.path.split(",").length - NESTING_LIMIT_UI;
  return currentComment.path.split(",")[indexPrior];
}

export function limitNestingUI(comment: IComment, topLevel: string) {
  const startedAt = comment.path.split(",").findIndex((i) => i === topLevel);
  const nowAt = comment.path.split(",").length;
  return nowAt - startedAt === NESTING_LIMIT_UI;
}
