import { useAppDispatch } from "hooks/reduxDispatchAndSelector";
import { deleteComment, likeUnlikeComment } from "context/generalSlice";
import styled from "styled-components";
import TimeAgo from "timeago-react";
import { NoPicOrPicUserImage } from "components/UsersOnline/auxiliaries/UserOnlineItem";
import { commentContainerBaseStyles, Value } from "./styles";
import { FRONTEND_ENDPOINTS } from "config/constants";
import { Link } from "react-router-dom";
import LikesUsersDataModal from "./LikesUsersDataModal";

const SingleSubCommentContainer = styled.div`
  ${commentContainerBaseStyles}
  width: max-content;
`;

const ColoredPadding = styled.div`
  background-color: var(--fb3erBody);
  padding: 8px;
  border-radius: 10px;
  position: relative;
`;

const Functionalities = styled.div`
  display: flex;
  gap: 10px;
  //agrego padding p/separar el absolute container con la like count del text en Functionalities
  padding-top: 5px;
`;
const FlexIt = styled.div`
  display: flex;
  gap: 10px;
`;
const ColumnFlex = styled.div`
  display: flex;
  flex-direction: column;

  gap: 10px;
`;
const LikeFunctionality = styled.b`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const ReplyFunctionality = styled(LikeFunctionality)``;

interface IProps {
  comment: IComment;
  children?: JSX.Element | JSX.Element[];
  /*   setData: (value: React.SetStateAction<IComment[]>) => void; */
  data?: IComment[];
  user: IUser;
  focus: () => void;
  order?: number;
}

export function SingleSubComment({ comment, user, focus }: IProps) {
  const dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(deleteComment(comment));
  };

  return (
    <>
      <SingleSubCommentContainer>
        {typeof comment.userID !== "string" && (
          <FlexIt>
            <Link to={FRONTEND_ENDPOINTS.PROFILEdyn(comment.userID._id)}>
              <NoPicOrPicUserImage img={comment.userID?.img} />
            </Link>

            <ColumnFlex>
              <ColoredPadding>
                {/* ver si este growflex lo saco dsp */}
                <Link to={FRONTEND_ENDPOINTS.PROFILEdyn(comment.userID._id)}>
                  <b>{comment.userID.username}</b>
                </Link>
                <Value>{comment.value}</Value>
                {comment.likes.length > 0 && (
                  <LikesUsersDataModal comment={comment} isAbsolute />
                )}
              </ColoredPadding>
              <Functionalities>
                <LikeFunctionality
                  onClick={() => dispatch(likeUnlikeComment(comment))}
                >
                  Like
                </LikeFunctionality>

                <ReplyFunctionality onClick={focus}>Reply</ReplyFunctionality>

                {comment.userID._id === user?._id && (
                  <LikeFunctionality onClick={handleDelete}>
                    Delete
                  </LikeFunctionality>
                )}

                <TimeAgo datetime={comment.createdAt} />
              </Functionalities>
            </ColumnFlex>
          </FlexIt>
        )}
      </SingleSubCommentContainer>
    </>
  );
}
