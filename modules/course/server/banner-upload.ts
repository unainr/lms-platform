"use server"

import { imagekit } from "@/lib/image-kit";

export const ImageUpload = async (file: File) => { 
 if (!file) return null;
 // Convert File → Buffer
  const arrayBuffer = await file.arrayBuffer();
  const base64File = Buffer.from(arrayBuffer).toString('base64')
  const imageKitRef = await imagekit.upload({
    file:base64File,
    fileName:`image-${Date.now()}.png`,
      folder: '/courses-images',

  })
  return imageKitRef?.url ?? null;

 }