interface IComment {
  value: string;
  path: string;
  userID: string | { _id: string; img: string; username: string };
  likes: string[];
  _id: string;
  createdAt: Date;
  remainingChildren?: number;
  //fijarse q esto no me complique la vida
  children: IComment[];
}

type INewCommentInput = Pick<IComment, "value" | "id" | "path">;

interface OpenCloseOv {
  close: () => void;
  show: boolean;
}
