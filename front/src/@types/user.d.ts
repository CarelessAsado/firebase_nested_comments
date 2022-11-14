interface ITarea {
  name: string;
  _id: string;
  done: boolean;
  /*   createdAt: Date;
  updatedAt:Date; */
}
type IUser = {
  username: string;
  _id: string;
  email: string;
  img: string | null;
} | null;
type UserNotNull = NonNullable<IUser>;

type AccessTkn = { accessToken: string };

type IRegisterInput = Pick<UserNotNull, "username" | "email"> & {
  password: string;
  confirmPassword: string;
};

type State = {
  tareas: ITarea[];
  user: IUser;
  error: boolean | string;
  loading: boolean;
};
type GeneralState = {
  comments: IComment[];
  totalComments: number;
  loading: boolean;
  notification: string;
};

type ILoginInput = Pick<UserNotNull, "email"> & {
  password: string;
};

type AxiosMethodsCustomApiCall = "get" | "delete" | "put" | "post";
