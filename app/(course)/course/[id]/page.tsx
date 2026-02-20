import { ChaptersForm } from '@/modules/chapters/ui/components/chapters-form'
import React from 'react'
interface Props{
    params:Promise<{id:string}>
}
const CoursePage =  async({params}:Props) => {
    const {id} = await params
    console.log(id)
  return (
    <div>
      <ChaptersForm courseId={id}/>
    </div>
  )
}

export default CoursePage