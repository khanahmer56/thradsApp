import Image from "next/image";
import Link from "next/link";
import React from "react";

const ThreadCard = ({
  key,
  id,
  currentUserId,
  parentId,
  content,
  author,
  createdAt,
  comments,
  community,
  isComment,
}: any) => {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "bg-dark-1" : "bg-dark-2"
      } p-7`}
    >
      <div className="flex flex-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`}>
              <Image
                src={author.image}
                alt="Picture of the author"
                width={50}
                height={50}
                className="rounded-full cursor-pointer"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>

            <h2 className="mt-2 text-small-regular text-light-2">{content}</h2>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="heart"
                  width={25}
                  height={25}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={25}
                    height={25}
                    className="cursor-pointer object-contain"
                  />
                </Link>

                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={25}
                  height={25}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={25}
                  height={25}
                  className="cursor-pointer object-contain"
                />
              </div>
              {isComment && comments.length > 0 && (
                <Link href={`/thread${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
