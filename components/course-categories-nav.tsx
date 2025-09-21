"use client"

import * as React from "react"
import Link from "next/link"
import { BookOpen, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { coursesService } from "@/lib/api/courses"
import type { CourseCategory } from "@/lib/api/types"

interface CourseCategoriesNavProps {
    className?: string
    isMobile?: boolean
}

export function CourseCategoriesNav({ className, isMobile = false }: CourseCategoriesNavProps) {
    const [categories, setCategories] = React.useState<CourseCategory[]>([])
    const [isLoading, setIsLoading] = React.useState(false)

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                setIsLoading(true)
                const data = await coursesService.getCategories()
                setCategories(data)
            } catch (err) {
                console.error('Failed to fetch categories:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    if (isMobile) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn("w-full justify-start", className)}
                        disabled={isLoading}
                    >
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>Khóa học</span>
                        <ChevronDown className="h-4 w-4 ml-auto" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Danh mục khóa học</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                        <Link href="/courses" className="w-full">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Tất cả khóa học
                        </Link>
                    </DropdownMenuItem>

                    {!isLoading && categories.length > 0 && (
                        <>
                            <DropdownMenuSeparator />
                            {categories.map((category) => (
                                <DropdownMenuItem key={category.id} asChild>
                                    <Link href={`/courses/categories/${category.slug}`} className="w-full">
                                        {category.name}
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <NavigationMenu className={className}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>Khóa học</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {/* All courses link */}
                            <Link
                                href="/courses"
                                className={cn(
                                    "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                )}
                            >
                                <div className="flex items-center space-x-2">
                                    <BookOpen className="h-4 w-4" />
                                    <div className="text-sm font-medium leading-none">Tất cả khóa học</div>
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    Khám phá toàn bộ thư viện khóa học của chúng tôi
                                </p>
                            </Link>

                            {/* Categories */}
                            {isLoading ? (
                                <div className="col-span-2 text-center text-sm text-muted-foreground py-4">
                                    Đang tải...
                                </div>
                            ) : categories.length === 0 ? (
                                <div className="col-span-2 text-center text-sm text-muted-foreground py-4">
                                    Không có danh mục nào
                                </div>
                            ) : (
                                categories.slice(0, 5).map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/courses/categories/${category.slug}`}
                                        className={cn(
                                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                        )}
                                    >
                                        <div className="text-sm font-medium leading-none">{category.name}</div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                            {category.description}
                                        </p>
                                    </Link>
                                ))
                            )}
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"