"use server";

import { db } from "@/drizzle/db";
import { chapters } from "@/drizzle/schema";
import { chapterSchema } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
export const createChapter = async (
	courseId: string,
	values: z.infer<typeof chapterSchema>,
) => {
	const { userId } = await auth();

	if (!userId) {
		return { error: "Unauthorized" };
	}

	const validatedFields = chapterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid fields" };
	}
	const { title, content } = validatedFields.data;
	try {
		const lastChapter = await db
			.select()
			.from(chapters)
			.where(eq(chapters.courseId, courseId))
			.orderBy(desc(chapters.order))
			.limit(1);

		const nextOrder =
			lastChapter.length > 0 ? (lastChapter[0].order ?? 0) + 1 : 1;

		const [data] = await db
			.insert(chapters)
			.values({
				courseId,
				title,
				content,
				order: nextOrder,
			})
			.returning();
		return {
			success: "Chapter created successfully",
			data: data,
		};
	} catch (error) {
		console.log(error);
		return {
			error: "Something went wrong",
		};
	}
};
