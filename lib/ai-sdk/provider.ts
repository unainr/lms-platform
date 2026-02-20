'use server'
import { db } from '@/drizzle/db';
import { courses } from '@/drizzle/schema';
import { groq } from '@ai-sdk/groq';
import { auth } from '@clerk/nextjs/server';
import { generateText, Output } from 'ai';
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';

export const generateChapter = async (courseId:string) => {
    const {userId} = await auth();
    if(!userId){
        return {error:'Unauthorized'}
    }
     const course = await db
    .select()
    .from(courses)
    .where(eq(courses.id, courseId))
    .limit(1);
      if (!course.length) return { error: "Course not found" };

  const { title, description } = course[0];
  const result = await generateText({
    model: groq('openai/gpt-oss-20b'),
    output: Output.object({
      schema: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),
    prompt: `
      You are helping create a course chapter.

      Course Title: ${title}
      Course Description: ${description}

      Generate:
      - A clear chapter title
      - Detailed chapter content (educational style)
    `,
  });

  return {success:true,data:result.output}
};
