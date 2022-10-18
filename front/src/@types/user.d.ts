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
  public_id: string | null;
} | null;
type UserNotNull = NonNullable<IUser>;

type AccessTkn = { accessToken: string };

type IRegisterInput = Pick<UserNotNull, "username" | "email"> & {
  password: string;
  confirmPassword: string;
};

type State = {
  tareas: ITarea[];
  comments: IComment[];
  user: IUser;
  error: boolean | string;
  loading: boolean;
  successRegister: string;
};

type ILoginInput = Pick<UserNotNull, "email"> & {
  password: string;
};
