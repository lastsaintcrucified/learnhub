"use client"

import { useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ChevronLeft, ChevronRight, Clock, FileText, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

// Mock course data
const course = {
  id: 1,
  title: "Advanced JavaScript",
  modules: [
    {
      id: 1,
      title: "JavaScript Fundamentals Review",
      lessons: [
        {
          id: 1,
          title: "Variables and Data Types",
          description: "Learn about JavaScript variables and data types",
          type: "video",
          duration: "15:30",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          content:
            "JavaScript has the following data types:\n\n- String\n- Number\n- Boolean\n- Object\n- Null\n- Undefined\n- Symbol\n- BigInt",
          completed: true,
        },
        {
          id: 2,
          title: "Functions and Scope",
          description: "Understanding functions and variable scope",
          type: "video",
          duration: "20:45",
          completed: true,
        },
        {
          id: 3,
          title: "Objects and Arrays",
          description: "Working with objects and arrays",
          type: "video",
          duration: "25:10",
          completed: true,
        },
      ],
    },
    {
      id: 2,
      title: "Advanced Concepts",
      lessons: [
        {
          id: 4,
          title: "Closures",
          description: "Understanding closures in JavaScript",
          type: "video",
          duration: "30:15",
          completed: true,
        },
        {
          id: 5,
          title: "Prototypes and Inheritance",
          description: "Learn about JavaScript's prototype-based inheritance",
          type: "text",
          content:
            "JavaScript is a prototype-based language, which means that objects inherit directly from other objects. Every object in JavaScript has a prototype, from which it inherits properties and methods.\n\nWhen you access a property or method on an object, JavaScript first looks at the object itself. If it can't find the property or method there, it looks at the object's prototype. This chain of lookups continues until it either finds the property or reaches the end of the prototype chain.",
          completed: true,
        },
        {
          id: 6,
          title: "This Keyword",
          description: "Understanding the 'this' keyword in different contexts",
          type: "video",
          duration: "25:00",
          completed: true,
        },
      ],
    },
  ],
}

// Helper function to find a lesson by ID
function findLesson(courseData: typeof course, moduleId: number, lessonId: number) {
  const module = courseData.modules.find((m) => m.id === moduleId)
  if (!module) return null

  const lesson = module.lessons.find((l) => l.id === lessonId)
  return lesson || null
}

// Helper function to get next and previous lessons
function getAdjacentLessons(courseData: typeof course, currentModuleId: number, currentLessonId: number) {
  const allLessons: { moduleId: number; lesson: any }[] = []
  courseData.modules.forEach((module) => {
    module.lessons.forEach((lesson) => {
      allLessons.push({ moduleId: module.id, lesson })
    })
  })

  allLessons.sort((a, b) => {
    if (a.moduleId !== b.moduleId) return a.moduleId - b.moduleId
    return a.lesson.id - b.lesson.id
  })

  const currentIndex = allLessons.findIndex(
    (item) => item.moduleId === currentModuleId && item.lesson.id === currentLessonId,
  )

  const previous = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return { previous, next }
}

// Schema for lesson content form
const lessonContentFormSchema = z.object({
  title: z.string().min(1, {
    message: "Lesson title is required.",
  }),
  description: z.string().optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
})

export default function LessonPage({ params }: { params: { id: string; moduleId: string; lessonId: string } }) {
  const courseId = Number.parseInt(params.id)
  const moduleId = Number.parseInt(params.moduleId)
  const lessonId = Number.parseInt(params.lessonId)

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Find the current lesson
  const currentLesson = findLesson(course, moduleId, lessonId)
  const currentModule = course.modules.find((m) => m.id === moduleId)

  // Get next and previous lessons
  const { previous, next } = getAdjacentLessons(course, moduleId, lessonId)

  // Determine if user is an instructor (in a real app this would come from auth)
  const isInstructor = true

  // Define role-specific actions
  const userActions = isInstructor
    ? [
        { label: "Edit Lesson", action: () => setIsEditing(true), icon: <Icons.edit className="mr-2 h-4 w-4" /> },
        { label: "Preview as Student", action: () => {}, icon: <Icons.user className="mr-2 h-4 w-4" /> },
      ]
    : [{ label: "Mark as Complete", action: () => {}, icon: <Icons.check className="mr-2 h-4 w-4" /> }]

  // Form for editing lesson content
  const form = useForm<z.infer<typeof lessonContentFormSchema>>({
    resolver: zodResolver(lessonContentFormSchema),
    defaultValues: {
      title: currentLesson?.title || "",
      description: currentLesson?.description || "",
      content: currentLesson?.content || "",
      videoUrl: currentLesson?.videoUrl || "",
    },
  })

  function onSubmit(values: z.infer<typeof lessonContentFormSchema>) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Updating lesson:", values)
      setIsLoading(false)
      setIsEditing(false)
    }, 1000)
  }

  if (!currentLesson || !currentModule) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lesson Not Found</h1>
            <p className="text-muted-foreground">The requested lesson could not be found.</p>
          </div>
          <Button asChild>
            <Link href={`/instructor/course/${courseId}/modules`}>Back to Modules</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Helper function to get lesson type icon
  function getLessonTypeIcon(type: string) {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "text":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <Icons.fileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href={`/instructor/course/${courseId}/modules`} className="hover:underline">
              Modules
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/instructor/course/${courseId}/modules`} className="hover:underline">
              {currentModule.title}
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{currentLesson.title}</h1>
          {currentLesson.description && <p className="text-muted-foreground">{currentLesson.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/instructor/course/${courseId}/modules`}>Back to Modules</Link>
          </Button>
          {isInstructor && !isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Icons.edit className="mr-2 h-4 w-4" />
              Edit Lesson
            </Button>
          )}
        </div>
      </div>

      {/* Display lesson metadata */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="flex gap-1.5 items-center">
            {getLessonTypeIcon(currentLesson.type)}
            <span className="capitalize">{currentLesson.type}</span>
          </Badge>
        </div>
        {currentLesson.duration && (
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Clock className="h-4 w-4" />
            <span>{currentLesson.duration}</span>
          </div>
        )}
      </div>

      {/* Lesson content */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Lesson</CardTitle>
            <CardDescription>Update the content and details of this lesson.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lesson Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>Brief description of what this lesson covers</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {currentLesson.type === "video" && (
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://www.youtube.com/embed/..." />
                        </FormControl>
                        <FormDescription>Enter a YouTube embed URL</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[300px] font-mono" {...field} />
                      </FormControl>
                      <FormDescription>
                        The main content of your lesson. You can use Markdown for formatting.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      ) : (
        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                {currentLesson.type === "video" && currentLesson.videoUrl ? (
                  <div className="aspect-video w-full overflow-hidden rounded-md mb-6">
                    <iframe
                      width="100%"
                      height="100%"
                      src={currentLesson.videoUrl}
                      title={currentLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="aspect-video"
                    ></iframe>
                  </div>
                ) : null}

                <div className="prose max-w-none dark:prose-invert">
                  {currentLesson.content ? (
                    <div className="whitespace-pre-line">{currentLesson.content}</div>
                  ) : (
                    <p className="text-muted-foreground">This lesson has no content yet.</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-6">
                <div>
                  {previous && (
                    <Button variant="outline" asChild>
                      <Link
                        href={`/instructor/course/${courseId}/modules/${previous.moduleId}/lessons/${previous.lesson.id}`}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous Lesson
                      </Link>
                    </Button>
                  )}
                </div>
                <div>
                  {next && (
                    <Button asChild>
                      <Link href={`/instructor/course/${courseId}/modules/${next.moduleId}/lessons/${next.lesson.id}`}>
                        Next Lesson
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Resources</CardTitle>
                <CardDescription>Download supplementary materials for this lesson.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isInstructor && (
                    <div className="mb-6">
                      <Button variant="outline">
                        <Icons.upload className="mr-2 h-4 w-4" />
                        Upload Resource
                      </Button>
                    </div>
                  )}
                  <div className="rounded-md border">
                    <div className="p-4">
                      <p className="text-center text-muted-foreground">No resources available for this lesson.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="discussion">
            <Card>
              <CardHeader>
                <CardTitle>Lesson Discussion</CardTitle>
                <CardDescription>
                  Ask questions and discuss this lesson with other students and instructors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Discussion feature coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
