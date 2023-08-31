import { fetchuserpost } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "./ThreadCard";

const ThreadTab = async ({ currentUserId, accountId, accountType }: any) => {
  let result = await fetchuserpost(accountId);
  console.log("ahmersss", currentUserId, accountId);
  if (!result) redirect("/");
  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.map((post: any) => {
        return (
          <ThreadCard
            key={post._id}
            id={post._id}
            currentUserId={currentUserId}
            parentId={post.parentId}
            content={post.text}
            author={
              accountType === "User"
                ? {
                    name: result.name,
                    image: result.image,
                    id: result.id,
                  }
                : {
                    name: post.author.name,
                    image: post.author.image,
                    id: post.author.id,
                  }
            }
            community={post.community}
            createdAt={post.createdAt}
            comments={post.children}
          />
        );
      })}
    </section>
  );
};

export default ThreadTab;
