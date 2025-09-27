'use client'

/**
 * Instructor Reviews Page
 * Manage and respond to student reviews and feedback
 */

import { useState } from 'react'
import {
    Star,
    MessageSquare,
    ThumbsUp,
    Filter,
    Search,
    TrendingUp,
    Users,
    Award,
    Reply
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// Mock reviews data
const reviewStats = {
    averageRating: 4.8,
    totalReviews: 1247,
    ratingDistribution: {
        5: 876,
        4: 234,
        3: 89,
        2: 32,
        1: 16
    }
}

const reviews = [
    {
        id: 1,
        student: {
            name: 'Nguyễn Văn An',
            avatar: null
        },
        course: 'React Advanced Patterns',
        rating: 5,
        comment: 'Khóa học rất chi tiết và dễ hiểu. Giảng viên giải thích rõ ràng, ví dụ thực tế. Tôi đã học được rất nhiều pattern hữu ích cho React.',
        date: '2024-01-20',
        helpful: 12,
        replied: false
    },
    {
        id: 2,
        student: {
            name: 'Trần Thị Bích',
            avatar: null
        },
        course: 'JavaScript ES6+',
        rating: 4,
        comment: 'Nội dung khóa học tốt, tuy nhiên một số phần hơi nhanh. Hy vọng có thêm bài tập thực hành.',
        date: '2024-01-19',
        helpful: 8,
        replied: true,
        instructorReply: 'Cảm ơn bạn đã góp ý! Tôi sẽ cập nhật thêm bài tập trong phần tiếp theo.'
    },
    {
        id: 3,
        student: {
            name: 'Lê Minh Cường',
            avatar: null
        },
        course: 'React Advanced Patterns',
        rating: 5,
        comment: 'Tuyệt vời! Đây là khóa học React hay nhất tôi từng học. Code examples rất thực tế.',
        date: '2024-01-18',
        helpful: 15,
        replied: false
    },
    {
        id: 4,
        student: {
            name: 'Phạm Thị Diệu',
            avatar: null
        },
        course: 'Next.js Full Stack',
        rating: 3,
        comment: 'Khóa học ổn nhưng thiếu phần deployment. Mong giảng viên bổ sung thêm.',
        date: '2024-01-17',
        helpful: 5,
        replied: false
    }
]

export default function InstructorReviewsPage() {
    const [filteredReviews, setFilteredReviews] = useState(reviews)
    const [searchTerm, setSearchTerm] = useState('')
    const [ratingFilter, setRatingFilter] = useState('all')
    const [courseFilter, setCourseFilter] = useState('all')
    const [replyText, setReplyText] = useState<{ [key: number]: string }>({})

    const getStarArray = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => i < rating)
    }

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return 'text-green-600'
        if (rating >= 3) return 'text-yellow-600'
        return 'text-red-600'
    }

    const handleReply = (reviewId: number) => {
        console.log(`Reply to review ${reviewId}:`, replyText[reviewId])
        // Handle reply submission
        setReplyText({ ...replyText, [reviewId]: '' })
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Đánh giá & Phản hồi</h1>
                    <p className="text-muted-foreground">
                        Quản lý đánh giá và phản hồi từ học viên
                    </p>
                </div>
            </div>

            {/* Rating Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đánh giá trung bình</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{reviewStats.averageRating}</div>
                        <div className="flex items-center mt-1">
                            {getStarArray(Math.floor(reviewStats.averageRating)).map((filled, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reviewStats.totalReviews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            +23 đánh giá mới tuần này
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đánh giá 5 sao</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {Math.round((reviewStats.ratingDistribution[5] / reviewStats.totalReviews) * 100)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {reviewStats.ratingDistribution[5]} trong tổng số
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cần phản hồi</CardTitle>
                        <Reply className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">
                            {reviews.filter(r => !r.replied).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Đánh giá chưa trả lời
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Rating Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Phân bố đánh giá</CardTitle>
                    <CardDescription>
                        Thống kê chi tiết theo từng mức đánh giá
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]
                            const percentage = (count / reviewStats.totalReviews) * 100

                            return (
                                <div key={rating} className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1 w-12">
                                        <span className="text-sm font-medium">{rating}</span>
                                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="w-full bg-secondary rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground w-20 text-right">
                                        {count} ({percentage.toFixed(1)}%)
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Reviews List */}
            <Card>
                <CardHeader>
                    <CardTitle>Đánh giá gần đây</CardTitle>
                    <CardDescription>
                        Xem và phản hồi đánh giá từ học viên
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filters */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex-1">
                            <Label htmlFor="search">Tìm kiếm</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Tìm theo tên học viên hoặc nội dung..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <div>
                            <Label>Đánh giá</Label>
                            <Select value={ratingFilter} onValueChange={setRatingFilter}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="5">5 sao</SelectItem>
                                    <SelectItem value="4">4 sao</SelectItem>
                                    <SelectItem value="3">3 sao</SelectItem>
                                    <SelectItem value="2">2 sao</SelectItem>
                                    <SelectItem value="1">1 sao</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Khóa học</Label>
                            <Select value={courseFilter} onValueChange={setCourseFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả khóa học</SelectItem>
                                    <SelectItem value="React Advanced Patterns">React Advanced</SelectItem>
                                    <SelectItem value="JavaScript ES6+">JavaScript ES6+</SelectItem>
                                    <SelectItem value="Next.js Full Stack">Next.js Full Stack</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="space-y-6">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="border rounded-lg p-6">
                                {/* Review Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={review.student.avatar || ''} />
                                            <AvatarFallback>
                                                {review.student.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{review.student.name}</div>
                                            <div className="text-sm text-muted-foreground">{review.course}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center space-x-1 mb-1">
                                            {getStarArray(review.rating).map((filled, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{review.date}</div>
                                    </div>
                                </div>

                                {/* Review Content */}
                                <div className="mb-4">
                                    <p className="text-sm">{review.comment}</p>
                                </div>

                                {/* Review Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>{review.helpful} người thấy hữu ích</span>
                                        </div>
                                        {review.replied && (
                                            <Badge variant="outline" className="text-green-600">
                                                Đã phản hồi
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Instructor Reply */}
                                {review.replied && review.instructorReply && (
                                    <div className="mt-4 p-4 bg-muted rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Badge variant="secondary">Phản hồi từ giảng viên</Badge>
                                        </div>
                                        <p className="text-sm">{review.instructorReply}</p>
                                    </div>
                                )}

                                {/* Reply Form */}
                                {!review.replied && (
                                    <div className="mt-4 space-y-3">
                                        <Label htmlFor={`reply-${review.id}`}>Phản hồi đánh giá</Label>
                                        <Textarea
                                            id={`reply-${review.id}`}
                                            placeholder="Viết phản hồi của bạn..."
                                            value={replyText[review.id] || ''}
                                            onChange={(e) => setReplyText({
                                                ...replyText,
                                                [review.id]: e.target.value
                                            })}
                                            rows={3}
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <Button variant="outline" size="sm">
                                                Hủy
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleReply(review.id)}
                                                disabled={!replyText[review.id]?.trim()}
                                            >
                                                Gửi phản hồi
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
