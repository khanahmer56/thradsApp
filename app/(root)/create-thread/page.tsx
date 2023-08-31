import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchuser } from "@/lib/actions/user.actions";
import PostThread from "@/components/PostThread";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchuser(user.id);
  console.log("ahmer", userInfo);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Thread</h1>

      <PostThread userId={userInfo._id} />
    </>
  );
}

export default Page;
