"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, BookOpen } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { coursesService } from "@/lib/api/courses"
import type { CourseCategory } from "@/lib/api/types"

interface CourseCategoriesDropdownProps {
  className?: string
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg"
}

export function CourseCategoriesDropdown({
  className,
  variant = "ghost",
  size = "default"
}: CourseCategoriesDropdownProps) {
  const [categories, setCategories] = React.useState<CourseCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log('Fetching categories...')
        const data = await coursesService.getCategories()
        console.log('Categories fetched:', data)
        setCategories(data)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError('Không thể tải danh sách danh mục')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={cn(
            "flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            className
          )}
          disabled={isLoading}
        >
          <BookOpen className="h-4 w-4" />
          <span>Khóa học</span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56" 
        align="start"
        sideOffset={4}
      >
        <DropdownMenuLabel className="flex items-center space-x-2">
          <BookOpen className="h-4 w-4" />
          <span>Danh mục khóa học</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading && (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">Đang tải...</span>
          </DropdownMenuItem>
        )}
        
        {error && (
          <DropdownMenuItem disabled>
            <span className="text-destructive text-sm">{error}</span>
          </DropdownMenuItem>
        )}
        
        {!isLoading && !error && categories.length === 0 && (
          <DropdownMenuItem disabled>
            <span className="text-muted-foreground">Không có danh mục nào</span>
          </DropdownMenuItem>
        )}
        
        {!isLoading && !error && categories.length > 0 && (
          <>
            {/* Link to all courses */}
            <DropdownMenuItem asChild>
              <Link 
                href="/courses"
                className="flex items-center space-x-2 w-full cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span>Tất cả khóa học</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            {/* Category links */}
            {categories.map((category) => (
              <DropdownMenuItem key={category.id} asChild>
                <Link 
                  href={`/courses/categories/${category.slug}`}
                  className="flex flex-col items-start space-y-1 w-full cursor-pointer"
                >
                  <span className="font-medium">{category.name}</span>
                  {category.description && (
                    <span className="text-xs text-muted-foreground line-clamp-2">
                      {category.description}
                    </span>
                  )}
                  {category.course_count !== undefined && (
                    <span className="text-xs text-muted-foreground">
                      {category.course_count} khóa học
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}