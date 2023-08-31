import ThreadCard from "@/components/ThreadCard";
import React from "react";
import { currentUser } from "@clerk/nextjs";
import { fetchuser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import Comments from "@/components/Comments";
const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;
  const userinfo = await fetchuser(user?.id);
  if (!userinfo.onboarded) redirect("/onboarding");
  const threads = await fetchThreadById(params.id);
  return (
    <section className="relative">
      <ThreadCard
        key={threads._id}
        id={threads._id}
        currentUserId={user?.id}
        parentId={threads.parentId}
        content={threads.text}
        author={threads.author}
        community={threads.community}
        createdAt={threads.createdAt}
        comments={threads.children}
      />
      <div className="mt-8">
        <Comments
          threadId={threads?.id}
          currentUserImg={userinfo?.image}
          currentUserId={JSON.stringify(userinfo._id)}
        />
      </div>
      <div className="mt-10">
        {threads.children.map((comment: any) => {
          return (
            <ThreadCard
              key={comment._id}
              id={comment._id}
              currentUserId={user?.id}
              parentId={comment.parentId}
              content={comment.text}
              author={comment.author}
              community={comment.community}
              createdAt={comment.createdAt}
              comments={comment.children}
              isComment={true}
            />
          );
        })}
      </div>
    </section>
  );
};

export default page;
