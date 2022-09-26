interface Itoken {
  _id: Types.ObjectId;
  email: string;
  iat: number;
  exp: number;
}
type IRefreshtoken = Omit<Itoken, "email">;
