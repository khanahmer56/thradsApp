// import AccountProfile from "@/components/AccountProfile";
// import { currentUser } from "@clerk/nextjs";

// async function Page() {
//   const user = await currentUser();
//   const userInfo = {};
//   const userData = {
//     id: user?.id,
//     objectId: userInfo?._id,
//     username: userInfo?.username || user?.username,
//     name: userInfo?.name || user?.username,
//     bio: userInfo?.bio || "",
//     image: userInfo?.image || user?.imageUrl,
//   };
//   return (
//     <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
//       <h1 className="head-text">Onboarding</h1>
//       <p className="mt-3 text-base-regular text-light-2">
//         Welcome to threads..
//       </p>
//       <section className="mt-9 bg-dark-2 p-10">
//         <AccountProfile user={userData} btnTitle={"continue"} />
//       </section>
//     </main>
//   );
// }
// export default Page;
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import AccountProfile from "@/components/AccountProfile";
import { fetchuser } from "@/lib/actions/user.actions";

async function Page() {
  const user = await currentUser();
  if (!user) return null; // to avoid typescript warnings

  const userInfo = await fetchuser(user.id);
  if (userInfo?.onboarded) redirect("/");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };
  console.log("usersss", userData);
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now, to use Threds.
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}

export default Page;
