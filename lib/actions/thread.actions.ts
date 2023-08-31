"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface PropsType {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: PropsType) {
  try {
    connectToDB();
    const createdthread = await Thread.create({
      text,
      author,
      community: null,
    });
    await User.findByIdAndUpdate(author, {
      $push: {
        threads: createdthread._id,
      },
    });
    revalidatePath(path);
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export async function fetchposts(pageNumber = 1, pageSize = 10) {
  connectToDB();
  const skip = (pageNumber - 1) * pageSize;
  const postquery = Thread.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({
      createdAt: "desc",
    })
    .skip(skip)
    .limit(pageSize)
    .populate({
      path: "author",
      model: "User",
    })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: "User",
        select: "_id name parentId image",
      },
    });
  const totalpostcount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });
  const posts = await postquery.exec();
  const isNext = totalpostcount > skip * posts.length;
  return {
    posts,
    isNext,
  };
}
// export async function fetchthreads(id: string) {
//   connectToDB();
//   try {
//     const thread = await Thread.findById(id)
//       .populate({
//         path: "author",
//         model: User,
//         select: "_id id name image",
//       })
//       .populate({
//         path: "children",
//         populate: [
//           {
//             path: "author",
//             model: User,
//             select: "_id id name parentId image",
//           },
//           {
//             path: "children",
//             model: Thread,
//             populate: {
//               path: "author",
//               model: User,
//               select: "_id id name parentId image",
//             },
//           },
//         ],
//       });
//   } catch (err: any) {
//     throw new Error(err.message);
//   }
// }
export async function fetchThreadById(threadId: string) {
  connectToDB();

  try {
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      // .populate({
      //   path: "community",
      //   model: Community,
      //   select: "_id id name image",
      // }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err) {
    console.error("Error while fetching thread:", err);
    throw new Error("Unable to fetch thread");
  }
}
export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    // Create the new comment thread
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentThread = await commentThread.save();

    // Add the comment thread's ID to the original thread's children array
    originalThread.children.push(savedCommentThread._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}