"use server"

import { db } from "@/drizzle/db";
import { courses } from "@/drizzle/schema";
import { formSchema } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const createCourse = async (values: z.infer<typeof formSchema>) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { title, description, bannerImage, isPublished } = validatedFields.data;

  try {
    const [data] = await db.insert(courses).values({
        title,
        description,
        bannerImage,
        isPublished,
        createdBy: userId,
    }).returning();
    
    return { success: "Course created!", data: data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong" };
  }
};
