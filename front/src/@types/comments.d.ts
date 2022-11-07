interface IComment {
  value: string;
  path: string;
  userID: string | { _id: string; img: string; username: string };
  likes: string[];
  _id: string;
  createdAt: Date;
  parentID: string | null;

  //fijarse q esto no me complique la vida
  remainingChildren?: number;
  children?: IComment[];
}

type INewCommentInput = Pick<IComment, "value" | "parentID">;

interface OpenCloseOv {
  close: () => void;
  show: boolean;
}
