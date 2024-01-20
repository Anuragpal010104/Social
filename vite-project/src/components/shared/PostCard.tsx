import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite"
import { Link } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import PostStats from "./PostStats";

type PostCardProps = {
    post: Models.Document;
}

const PostCard = ({ post}: PostCardProps ) => {

    const { user } = useUserContext();
    if(!post.creator ) return;

  return (
    <div className="post-card">
        <div className="flex-between1">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${post.creator.$id}`}>
                 <img
                 src={
                    post.creator?.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                 alt="creator"
                 className="w-10 h-10 rounded-full"
                 />
                </Link>

                <div className="flex flex-col p-2">
                    <p className="base-medium lg:body-bold text-light-1">
                        {post.creator.name}
                    </p>
                    <div className="flex-center text-light-3">
                        <p className="subtle-semiblod lg:small-regualar">
                        {multiFormatDateString(post.$createdAt)}
                        </p>
                        <p className="px-1 subtle-semiblod lg:small-regualar">
                            {post.location}
                        </p>
                    </div>
                </div>
            </div>

            <Link to={`/update-post/${post.$id}`}
            className={`${user.id !== post.creator.$id && "hidden" }`}
            >
                <img
                src="/assets/icons/edit.svg"
                alt="edit"
                width={20}
                height={20}

                />
            </Link>
        </div>
        <Link to={`/post/${post.$id}`}>
            <div className="small-medium lg:base-medium py-5">
                <p>
                    {post.caption}
                </p>
                <ul className="flex gap-1 mt-2">
                    {post.tags.map((tag: string) => (
                        <li key={tag}
                        className="text-light-3">
                          #{tag}      
                        </li>
                    ))}
                </ul>   
            </div>
            <img
            src={post.ImageUrl || '/assets/icons/profile-placeholder.svg'}
            alt="post"
            className="post-card_image"
            />
        </Link>

        <PostStats post={post} userId={user.id} />
    </div>
  )
}

export default PostCard