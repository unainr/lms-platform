import { z } from "zod";

export const ExerciseSchema = z.object({
  exercises: z.array(
    z.object({
      type: z.enum(["mcq", "coding", "text"]),
      title: z.string(),
      question: z.string(),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string().optional(),
      starterCode: z.string().optional(),
      solution: z.string().optional(),
    })
  ),
});

export const formSchema = z.object(
  {
    title:z.string().min(1,{message:'title is required'})
  }
)