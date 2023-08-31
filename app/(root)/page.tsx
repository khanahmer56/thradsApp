//app/page.tsx
import ThreadCard from "@/components/ThreadCard";
import { fetchposts } from "@/lib/actions/thread.actions";
import { UserButton, currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchposts();
  const user = await currentUser();
  console.log(result);
  return (
    <div>
      <h1 className="text-white">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length ? (
          result.posts.map((post: any) => {
            return (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            );
          })
        ) : (
          <p>No posts found</p>
        )}
      </section>
    </div>
  );
}
