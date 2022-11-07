import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  isPending,
} from "@reduxjs/toolkit";
import { socket } from "pages/main/Main";
import * as commentsAPI from "API/commentsAPI";
import errorHandler from "./errorHandler";
import { AppDispatch, RootState } from "./store";

const initialState: GeneralState = {
  notification: "",
  comments: [],
  totalComments: 0,
  loading: false,
  error: false,
};

//COMO BORRO LOS COMMENTS EN EL LOGOUT ???????????

/* ------------------------COMMENTS SUCCESS ACTIONS--------------------- */
export const getComments = createAsyncThunk(
  "general/getComments",
  async function (_, { dispatch }) {
    try {
      const { data } = await commentsAPI.getComments();
      return data;
    } catch (error) {
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);
export const getSubComments = createAsyncThunk(
  "general/getSubComments",
  async function (parentID: string, { dispatch }) {
    try {
      const { data } = await commentsAPI.getSubComments(parentID);

      return data;
    } catch (error) {
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);
export const getMoreFirstLevelComments = createAsyncThunk(
  "general/getMoreFirstLevelComments",
  async function (comment: IComment, { dispatch }) {
    try {
      const { data } = await commentsAPI.getMoreFirstLevelComments(comment);

      return data;
    } catch (error) {
      errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const postNewComment = createAsyncThunk<
  IComment,
  INewCommentInput,
  { dispatch: AppDispatch; state: RootState }
>("general/postNewComments", async function (obj, { dispatch, getState }) {
  try {
    const { data } = await commentsAPI.postNewComment(obj);
    const {
      user: { user },
    } = getState();
    const populateUser = { ...data, userID: { ...user } } as IComment;
    socket?.emit("commentPosted", { ...data, userID: { ...user } });
    return populateUser;
  } catch (error) {
    await errorHandler(error, dispatch);
    //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
    throw error;
  }
});

export const deleteComment = createAsyncThunk(
  "general/deleteComment",
  async function (obj: IComment, { dispatch }) {
    try {
      await commentsAPI.deleteComment(obj);
      socket?.emit("commentDeleted", obj);
      return obj;
    } catch (error) {
      await errorHandler(error, dispatch);
      //este error lo tiro xq si hago el unwrap en el front voy directo al .then()
      throw error;
    }
  }
);

export const generalSlice = createSlice({
  name: "general",
  initialState: initialState,
  reducers: {
    /* ----------ERROR------------------------ */
    showOrCloseNotification: (state, action: PayloadAction<string>) => {
      state.notification = action.payload;
    },

    newCommentPostedAdded: (state, action) => {
      state.loading = false;
      state.error = false;
      state.comments = addCommentState(state.comments, action.payload);
    },
    newCommentDeleted: (state, action) => {
      state.loading = false;
      state.error = false;
      state.comments = deleteCommentState(state.comments, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getComments.fulfilled, (state, action) => {
      //add pagination
      state.totalComments = action.payload.count;
      state.comments = action.payload.commentsData;
      state.loading = false;
    });

    builder.addCase(getSubComments.fulfilled, (state, action) => {
      state.comments = addCommentState(state.comments, action.payload);
      state.loading = false;
    });
    builder.addCase(postNewComment.fulfilled, (state, action) => {
      state.comments = addCommentState(state.comments, action.payload);
      state.loading = false;
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.comments = deleteCommentState(state.comments, action.payload);
      state.loading = false;
    });

    /* -----------------------------------ADDMATCHER PENDING----------------------------------- */
    // .addMatcher tiene q ir DSP de los addCase, si lo ponés antes no ANDA
    //Lo uso como default case p/loading
    //https://redux-toolkit.js.org/api/createReducer#builderaddmatcher
    //calculo q si queres overridear el matcher tenés q agregar otro dsp no?
    // matcher can be defined outside as a type predicate function
    builder.addMatcher(isPending, (state, action) => {
      state.loading = true;
      state.error = false;
    });
  },
});

export const {
  showOrCloseNotification,
  newCommentPostedAdded,
  newCommentDeleted,
} = generalSlice.actions;

export default generalSlice.reducer;

function addCommentState(
  comments: IComment[],
  newC: IComment | IComment[]
): IComment[] {
  //AL AGREGAR NUEVO COMMENT HAY Q TENER CUIDADO DE AGREGARLO AL PPIO, p evitar el sorting
  if (Array.isArray(newC)) {
    alert("hola tu hna");
    const parentID = newC[0].path.split(",")[1];
    return comments.map((i) =>
      i._id === parentID ? { ...i, children: [...newC, ...i.children] } : i
    );
  }

  const parentID = newC.path.split(",")[1];

  //SE TRATA DE UN NEW PARENT COMPONENT
  if (!parentID) {
    return [{ ...newC, children: [] }, ...comments];
  }
  const modified = comments.map((comm) =>
    comm._id === parentID
      ? { ...comm, children: [...comm.children, newC] }
      : comm
  );

  return modified;
}

function deleteCommentState(
  comments: IComment[],
  commentToBeDeleted: IComment
) {
  const { path, _id } = commentToBeDeleted;

  const parentID = commentToBeDeleted.path.split(",")[1];

  //EN ESTE CASO SE TRATA DE UN PARENT COMMENT
  if (!parentID) {
    return comments.filter(
      (
        i //si estan al mismo level dos folders, el path va a coincidir pero no la tengo q borrar, x eso agrego doble check
      ) =>
        (!i.path.includes(path) && i.path === path) ||
        //con este borro el item q clickeo, e incluyo todos (x ende tengo q filtrar +)
        i._id !== _id
    );
  }

  // EN ESTE CASO SE TRATA DE UN CHILD COMMENT, hay q filtrar los children
  return comments.map((parentComment) =>
    parentComment._id !== parentID
      ? parentComment
      : {
          ...parentComment,
          children: parentComment.children.filter(
            (
              i //si estan al mismo level dos folders, el path va a coincidir pero no la tengo q borrar, x eso agrego doble check
            ) =>
              (!i.path.includes(path) && i.path === path) ||
              //con este borro el item q clickeo, e incluyo todos (x ende tengo q filtrar +)
              i._id !== _id
          ),
        }
  );
}
