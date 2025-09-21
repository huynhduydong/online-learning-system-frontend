"use client"

import { useState, useEffect } from "react"
import { Filter, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { formatCurrency } from "@/lib/utils"

export interface CourseFiltersProps {
  filters: {
    categories: string[]
    priceRange: [number, number]
    levels: string[]
    minRating: number
  }
  onFiltersChange: (filters: {
    categories: string[]
    priceRange: [number, number]
    levels: string[]
    minRating: number
  }) => void
  onClearFilters?: () => void
}

// Level labels will be handled by translations

const availableCategories = [
  "PROGRAMMING",
  "DESIGN", 
  "MARKETING",
  "BUSINESS",
  "LANGUAGE",
  "DATA_SCIENCE",
  "PERSONAL_DEVELOPMENT"
]

const availableLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"]

// Helper functions for translations
const getCategoryLabel = (category: string): string => {
  const categoryLabels: Record<string, string> = {
    "PROGRAMMING": "Lập trình",
    "DESIGN": "Thiết kế",
    "MARKETING": "Marketing",
    "BUSINESS": "Kinh doanh",
    "LANGUAGE": "Ngôn ngữ",
    "DATA_SCIENCE": "Khoa học dữ liệu",
    "PERSONAL_DEVELOPMENT": "Phát triển cá nhân"
  }
  return categoryLabels[category] || category
}

const getLevelLabel = (level: string): string => {
  const levelLabels: Record<string, string> = {
    "BEGINNER": "Cơ bản",
    "INTERMEDIATE": "Trung cấp", 
    "ADVANCED": "Nâng cao"
  }
  return levelLabels[level] || level
}

export function CourseFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: CourseFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Destructure with defaults to prevent undefined errors
  const { categories = [], priceRange = [0, 5000000], levels = [], minRating = 0 } = filters || {}
  
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>(priceRange)

  // Sync tempPriceRange with priceRange when it changes
  useEffect(() => {
    setTempPriceRange(priceRange)
  }, [priceRange])

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...categories, category]
      : categories.filter(c => c !== category)
    
    onFiltersChange({
      categories: newCategories,
      priceRange,
      levels,
      minRating
    })
  }

  const handleLevelChange = (level: string, checked: boolean) => {
    const newLevels = checked
      ? [...levels, level]
      : levels.filter(l => l !== level)
    
    onFiltersChange({
      categories,
      priceRange,
      levels: newLevels,
      minRating
    })
  }

  const handlePriceRangeChange = (newRange: number[]) => {
    setTempPriceRange([newRange[0], newRange[1]])
  }

  const handlePriceRangeCommit = () => {
    onFiltersChange({
      categories,
      priceRange: tempPriceRange,
      levels,
      minRating
    })
  }

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      categories,
      priceRange,
      levels,
      minRating: rating
    })
  }

  const hasActiveFilters = categories.length > 0 || levels.length > 0 || 
    minRating > 0 || priceRange[0] > 0 || priceRange[1] < 5000000

  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters()
    } else {
      // Default clear behavior
      onFiltersChange({
        categories: [],
        priceRange: [0, 5000000],
        levels: [],
        minRating: 0
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Bộ lọc</span>
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {categories.length + levels.length + (minRating > 0 ? 1 : 0)}
              </Badge>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Bộ lọc</CardTitle>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <FilterContent
              categories={categories}
              priceRange={priceRange}
              tempPriceRange={tempPriceRange}
              levels={levels}
              minRating={minRating}
              onCategoryChange={handleCategoryChange}
              onLevelChange={handleLevelChange}
              onPriceRangeChange={handlePriceRangeChange}
              onPriceRangeCommit={handlePriceRangeCommit}
              onRatingChange={handleRatingChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filters */}
      {isOpen && (
        <div className="md:hidden">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Bộ lọc</CardTitle>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <FilterContent
                categories={categories}
                priceRange={priceRange}
                tempPriceRange={tempPriceRange}
                levels={levels}
                minRating={minRating}
                onCategoryChange={handleCategoryChange}
                onLevelChange={handleLevelChange}
                onPriceRangeChange={handlePriceRangeChange}
                onPriceRangeCommit={handlePriceRangeCommit}
                onRatingChange={handleRatingChange}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

interface FilterContentProps {
  categories: string[]
  priceRange: [number, number]
  tempPriceRange: [number, number]
  levels: string[]
  minRating: number
  onCategoryChange: (category: string, checked: boolean) => void
  onLevelChange: (level: string, checked: boolean) => void
  onPriceRangeChange: (range: number[]) => void
  onPriceRangeCommit: () => void
  onRatingChange: (rating: number) => void
}

function FilterContent({
  categories,
  priceRange,
  tempPriceRange,
  levels,
  minRating,
  onCategoryChange,
  onLevelChange,
  onPriceRangeChange,
  onPriceRangeCommit,
  onRatingChange
}: FilterContentProps) {
  return (
    <>
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Danh mục</h3>
        <div className="space-y-2">
          {availableCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={categories.includes(category)}
                onCheckedChange={(checked) => 
                  onCategoryChange(category, checked as boolean)
                }
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {getCategoryLabel(category)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Khoảng giá</h3>
        <div className="space-y-3">
          <Slider
            value={tempPriceRange}
            onValueChange={onPriceRangeChange}
            onValueCommit={onPriceRangeCommit}
            max={5000000}
            min={0}
            step={100000}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{formatCurrency(tempPriceRange[0])}</span>
            <span>{formatCurrency(tempPriceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Levels */}
      <div>
        <h3 className="font-semibold mb-3">Cấp độ</h3>
        <div className="space-y-2">
          {availableLevels.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox
                id={`level-${level}`}
                checked={levels.includes(level)}
                onCheckedChange={(checked) => 
                  onLevelChange(level, checked as boolean)
                }
              />
              <label
                    htmlFor={`level-${level}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {getLevelLabel(level)}
                  </label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Đánh giá</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1, 0].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={minRating === rating}
                onCheckedChange={(checked) => 
                  checked && onRatingChange(rating)
                }
              />
              <label
                htmlFor={`rating-${rating}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center space-x-1"
              >
                <span>{rating === 0 ? 'Tất cả đánh giá' : `${rating} sao trở lên`}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}