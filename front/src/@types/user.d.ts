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
} | null;
type UserNotNull = NonNullable<IUser>;

type AccessTkn = { accessToken: string };

type LoginSuccessful = {
  user: UserNotNull;
} & AccessTkn;

type IRegisterInput = Pick<UserNotNull, "username" | "email"> & {
  password: string;
  confirmPassword: string;
};

type State = {
  tareas: ITarea[];
  user: IUser;
  error: boolean | string;
  loading: boolean;
  successRegister: string;
};

type ILoginInput = Pick<IUser, "email"> & {
  password: string;
};
