'use client'
import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	InputGroupTextarea,
} from "@/components/ui/input-group";
import { z } from "zod";
import { chapterSchema } from "@/lib/schema";
import { createChapter } from "../../server/chapters.create";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { generateChapter } from "@/lib/ai-sdk/provider";
export const ChaptersForm = ({ courseId }: { courseId: string }) => {
    const [loading, setLoading] = useState(false)
	const form = useForm({
		resolver: zodResolver(chapterSchema),
		defaultValues: {
			title: "",
			content: "",
		},
	});
	const [isGenerating, setIsGenerating] = useState(false);
	const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await generateChapter(courseId);
    if (result.error) {
      toast.error(result.error);
    } else {
      form.setValue("title", result.data?.title||'');
      form.setValue("content", result.data?.description||'');
    }
    setIsGenerating(false);
  };
	async function onSubmit(data: z.infer<typeof chapterSchema>) {
        setLoading(true)
		try {
			const res = await createChapter(courseId, data);
			if (res.error) {
				toast.error(res.error);
			} else {
				toast.success("chapter created!");
				// Optionally redirect or reset
				form.reset();
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong");
		}finally{
            setLoading(false)
        }
	}

	return (
		<div>
			<Card>
				<CardHeader>
					<CardTitle>Chapters</CardTitle>
					<CardDescription>Manage chapters of the course</CardDescription>
				</CardHeader>
				<CardContent>
					<form  id="course-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FieldGroup>
							<Controller
								name="title"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="chapter-title">Title</FieldLabel>
										<Input
											{...field}
											id="chapter-title"
											placeholder="Chapter Title"
											autoComplete="off"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name="content"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="chapter-content">Content</FieldLabel>
										<InputGroup>
											<InputGroupTextarea
												{...field}
												id="chapter-content"
												placeholder="Chapter Content"
												rows={6}
												className="min-h-24 resize-none"
											/>
											<InputGroupAddon align="block-end">
												<InputGroupText className="tabular-nums">
													{field.value.length} characters
												</InputGroupText>
											</InputGroupAddon>
										</InputGroup>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</form>
				</CardContent>
                 <CardFooter>
                <div className="flex w-full justify-between gap-2">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                       reset
                    </Button>
                    <Button type="button" variant="outline" onClick={handleGenerate} disabled={isGenerating}>
                        {isGenerating ? (<><Spinner /> Generating with AI</>) : "Generate Chapter with AI"}
                    </Button>
                    <Button type="submit" form="course-form" disabled={loading}>
                        {loading ? (<><Spinner /> Creating Chapter</>) : "Create Chapter"}
                    </Button>
                </div>
            </CardFooter>
			</Card>
		</div>
	);
};
