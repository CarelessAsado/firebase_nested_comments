interface IComment {
  value: string;
  path: string;
  userID: string;
  likes: string[];
  _id: string;
}

type INewCommentInput = Pick<IComment, "value" | "id" | "path">;

interface OpenCloseOv {
  close: () => void;
  show: boolean;
}
