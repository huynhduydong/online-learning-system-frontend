"use client"

import { ArrowUpDown, TrendingUp, DollarSign, Star, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type SortOption = 
  | "popularity" 
  | "price-low-to-high" 
  | "price-high-to-low" 
  | "rating" 
  | "newest" 
  | "oldest"

export interface CourseSortingProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export function CourseSorting({ currentSort, onSortChange }: CourseSortingProps) {
  const sortOptions = [
    {
      value: "popularity" as SortOption,
      label: "Phổ biến",
      icon: TrendingUp,
      description: "Sắp xếp theo độ phổ biến của khóa học"
    },
    {
      value: "price-low-to-high" as SortOption,
      label: "Giá thấp đến cao",
      icon: DollarSign,
      description: "Sắp xếp theo giá từ thấp đến cao"
    },
    {
      value: "price-high-to-low" as SortOption,
      label: "Giá cao đến thấp", 
      icon: DollarSign,
      description: "Sắp xếp theo giá từ cao đến thấp"
    },
    {
      value: "rating" as SortOption,
      label: "Đánh giá",
      icon: Star,
      description: "Sắp xếp theo đánh giá cao nhất"
    },
    {
      value: "newest" as SortOption,
      label: "Mới nhất",
      icon: Calendar,
      description: "Sắp xếp theo khóa học mới nhất"
    },
    {
      value: "oldest" as SortOption,
      label: "Cũ nhất",
      icon: Calendar,
      description: "Sắp xếp theo khóa học cũ nhất"
    }
  ]

  const currentOption = sortOptions.find(option => option.value === currentSort)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between min-w-[200px]">
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4" />
            <span>Sắp xếp: {currentOption?.label}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        {sortOptions.map((option) => {
          const Icon = option.icon
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`flex items-start space-x-3 p-3 cursor-pointer ${
                currentSort === option.value ? 'bg-accent' : ''
              }`}
            >
              <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-muted-foreground">
                  {option.description}
                </div>
              </div>
              {currentSort === option.value && (
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}