"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { formSchema } from "@/lib/schema"
import { ImageUpload } from "../../server/banner-upload"
import { createCourse } from "../../server/actions"
import { Spinner } from "@/components/ui/spinner"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"


export const CourseForm = () => {
    const [uploading, setUploading] = React.useState(false);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            bannerImage: "",
            isPublished: false,
        },
    });


    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            
            const res = await createCourse(data);
             if (res.error) {
                toast.error(res.error);
            } else {
                toast.success("Course created!");
                // Optionally redirect or reset
                form.reset();
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong");
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
        
            const url = await ImageUpload(file);
            if (url) {
                form.setValue("bannerImage", url);
                toast.success("Image uploaded successfully");
            } else {
                toast.error("Failed to upload image");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Create Course</CardTitle>
                <CardDescription>
                    Create a new course by filling the form below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="course-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="course-title">Title</FieldLabel>
                                    <Input
                                        {...field}
                                        id="course-title"
                                        placeholder="Course Title"
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="course-description">Description</FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="course-description"
                                            placeholder="Course Description"
                                            rows={6}
                                            className="min-h-24 resize-none"
                                        />
                                        <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums">
                                                {field.value.length} characters
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <div className="space-y-2">
                             <FieldLabel>Banner Image</FieldLabel>
                             <Input 
                                type="file" 
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                             />
                             {uploading && <Spinner/>}
                             <Controller
                                name="bannerImage"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                         <Input {...field} type="hidden" />
                                         {field.value && (
                                             <div className="mt-2 text-xs text-green-600  truncate">
                                                <Progress value={100} />
                                             </div>
                                         )}
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                             />
                        </div>

                         <Controller
                            name="isPublished"
                            control={form.control}
                            render={({ field }) => (
                                <div className="flex items-center space-x-2">
                                     <Checkbox 
                                        id="course-published"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                     />
                                     <label htmlFor="course-published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                         Publish Course
                                     </label>
                                </div>
                            )}
                        />

                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <div className="flex w-full justify-between gap-2">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button type="submit" form="course-form" disabled={uploading}>
                        Create Course
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
