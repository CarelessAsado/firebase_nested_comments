interface IComment {
  value: string;
  path: string;
  userID: string | { _id: string; img: string; username: string };
  likes: string[];
  _id: string;
  createdAt: Date;
  subComments?: number;
}

type INewCommentInput = Pick<IComment, "value" | "id" | "path">;

interface OpenCloseOv {
  close: () => void;
  show: boolean;
}
