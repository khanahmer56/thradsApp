"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { set, useForm } from "react-hook-form";
import { ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "@/lib/validation/user";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateuser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import { threadschema } from "@/lib/validation/threads";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";
const PostThread = ({ userId }: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const { organization } = useOrganization();

  const onSubmit = async (data: any) => {
    if (!organization) {
      createThread({
        text: data.thread,
        author: userId,
        communityId: null,
        path: pathname,
      });
    } else {
      createThread({
        text: data.thread,
        author: userId,
        communityId: organization.id,
        path: pathname,
      });
    }
    router.push("/");
  };
  const form = useForm({
    resolver: zodResolver(threadschema),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col   gap-2 mt-5">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Textarea
                  rows={12}
                  placeholder="Enter your content"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Post thread</Button>
      </form>
    </Form>
  );
};

export default PostThread;

interface ProfileType {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}
