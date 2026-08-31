"use client"

import Link from "next/link"
import { CheckCircle, Clock, FileText, PlayCircle, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Icons } from "@/components/icons"

// Mock course data
const course = {
  id: 1,
  title: "Advanced JavaScript",
  instructor: "Jane Smith",
  description: "Master advanced JavaScript concepts including closures, prototypes, async programming, and more.",
  progress: 45,
  totalLessons: 24,
  completedLessons: 11,
  image: "/placeholder.svg?height=200&width=600",
  lastAccessed: "2 days ago",
  modules: [
    {
      id: 1,
      title: "JavaScript Fundamentals Review",
      description: "Review of basic JavaScript concepts",
      progress: 100,
      lessons: [
        {
          id: 1,
          title: "Variables and Data Types",
          duration: "15:30",
          type: "video",
          completed: true,
        },
        {
          id: 2,
          title: "Functions and Scope",
          duration: "20:45",
          type: "video",
          completed: true,
        },
        {
          id: 3,
          title: "Objects and Arrays",
          duration: "25:10",
          type: "video",
          completed: true,
        },
      ],
    },
    {
      id: 2,
      title: "Advanced Concepts",
      description: "Dive into more advanced JavaScript topics",
      progress: 75,
      lessons: [
        {
          id: 4,
          title: "Closures",
          duration: "30:15",
          type: "video",
          completed: true,
        },
        {
          id: 5,
          title: "Prototypes and Inheritance",
          type: "text",
          completed: true,
        },
        {
          id: 6,
          title: "This Keyword",
          duration: "25:00",
          type: "video",
          completed: true,
        },
        {
          id: 7,
          title: "Call, Apply, and Bind",
          type: "quiz",
          completed: false,
        },
      ],
    },
    {
      id: 3,
      title: "Asynchronous JavaScript",
      description: "Learn about asynchronous programming in JavaScript",
      progress: 20,
      lessons: [
        {
          id: 8,
          title: "Callbacks",
          duration: "20:00",
          type: "video",
          completed: true,
        },
        {
          id: 9,
          title: "Promises",
          duration: "30:00",
          type: "video",
          completed: false,
        },
        {
          id: 10,
          title: "Async/Await",
          duration: "35:00",
          type: "video",
          completed: false,
        },
        {
          id: 11,
          title: "Event Loop",
          duration: "25:00",
          type: "video",
          completed: false,
        },
        {
          id: 12,
          title: "Practical Examples",
          duration: "40:00",
          type: "video",
          completed: false,
        },
      ],
    },
  ],
}

export default function StudentModulesPage({ params }: { params: { id: string } }) {
  const courseId = Number.parseInt(params.id)

  // Function to find the next incomplete lesson
  const findNextLesson = () => {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!lesson.completed) {
          return {
            moduleId: module.id,
            lessonId: lesson.id,
            title: lesson.title,
          }
        }
      }
    }
    return null
  }

  const nextLesson = findNextLesson()

  function getLessonIcon(type: string, completed: boolean) {
    if (completed) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }

    switch (type) {
      case "video":
        return <Video className="h-4 w-4 text-muted-foreground" />
      case "text":
        return <FileText className="h-4 w-4 text-muted-foreground" />
      case "quiz":
        return <Icons.fileText className="h-4 w-4 text-muted-foreground" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link href="/dashboard/enrollments" className="text-sm text-muted-foreground hover:underline">
            ← Back to My Enrollments
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground">Instructor: {course.instructor}</p>
        </div>
        {nextLesson && (
          <Button asChild size="lg">
            <Link href={`/dashboard/course/${courseId}/modules/${nextLesson.moduleId}/lessons/${nextLesson.lessonId}`}>
              <PlayCircle className="mr-2 h-4 w-4" />
              Continue Learning
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
          <CardDescription>Track your learning progress through this course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Progress</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {course.completedLessons} / {course.totalLessons} lessons completed
                </span>
                <span>Last accessed: {course.lastAccessed}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Course Content</h2>
        {course.modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{module.title}</CardTitle>
                  {module.description && <CardDescription>{module.description}</CardDescription>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Progress value={module.progress} className="h-2 w-24" />
                    <span className="text-sm font-medium">{module.progress}%</span>
                  </div>
                  <Badge variant={module.progress === 100 ? "default" : "outline"}>
                    {module.progress === 100 ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible defaultValue="item-0">
                <AccordionItem value="item-0">
                  <AccordionTrigger className="text-sm font-medium">Lessons ({module.lessons.length})</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {module.lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/dashboard/course/${courseId}/modules/${module.id}/lessons/${lesson.id}`}
                        >
                          <div
                            className={`flex items-center justify-between p-3 rounded-md hover:bg-muted/50 ${
                              lesson.completed ? "bg-muted/50" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {getLessonIcon(lesson.type, lesson.completed)}
                              <span className={lesson.completed ? "line-through text-muted-foreground" : ""}>
                                {lesson.title}
                              </span>
                            </div>
                            {lesson.duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
