'use client'

/**
 * Student Achievements Page
 * Display student achievements, badges, certificates, and milestones
 */

import { useState } from 'react'
import {
    Award,
    Trophy,
    Star,
    Target,
    Calendar,
    Download,
    Share2,
    Lock,
    CheckCircle,
    Medal,
    Crown,
    Zap,
    Flame,
    BookOpen,
    Clock,
    Users
} from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Mock achievements data
const achievementStats = {
    totalEarned: 15,
    totalAvailable: 45,
    totalPoints: 2450,
    certificates: 3,
    streak: 12,
    rank: 'Gold Learner'
}

const earnedAchievements = [
    {
        id: 1,
        title: 'First Steps',
        description: 'Hoàn thành khóa học đầu tiên',
        icon: '🎯',
        category: 'milestone',
        points: 100,
        earnedAt: '2024-01-10',
        rarity: 'common'
    },
    {
        id: 2,
        title: 'Week Warrior',
        description: 'Học liên tục 7 ngày',
        icon: '🔥',
        category: 'streak',
        points: 150,
        earnedAt: '2024-01-15',
        rarity: 'uncommon'
    },
    {
        id: 3,
        title: 'JavaScript Master',
        description: 'Hoàn thành tất cả khóa học JavaScript',
        icon: '⚡',
        category: 'skill',
        points: 300,
        earnedAt: '2024-01-18',
        rarity: 'rare'
    },
    {
        id: 4,
        title: 'Speed Learner',
        description: 'Hoàn thành khóa học trong 24 giờ',
        icon: '🚀',
        category: 'speed',
        points: 200,
        earnedAt: '2024-01-19',
        rarity: 'uncommon'
    },
    {
        id: 5,
        title: 'Night Owl',
        description: 'Học tập sau 10 giờ tối',
        icon: '🦉',
        category: 'time',
        points: 50,
        earnedAt: '2024-01-20',
        rarity: 'common'
    },
    {
        id: 6,
        title: 'Quiz Champion',
        description: 'Đạt 100% trong 10 bài quiz',
        icon: '🏆',
        category: 'quiz',
        points: 250,
        earnedAt: '2024-01-17',
        rarity: 'rare'
    }
]

const lockedAchievements = [
    {
        id: 7,
        title: 'Code Ninja',
        description: 'Hoàn thành 50 bài tập lập trình',
        icon: '🥷',
        category: 'practice',
        points: 500,
        progress: 32,
        total: 50,
        rarity: 'epic'
    },
    {
        id: 8,
        title: 'Marathon Runner',
        description: 'Học liên tục 30 ngày',
        icon: '🏃',
        category: 'streak',
        points: 400,
        progress: 12,
        total: 30,
        rarity: 'rare'
    },
    {
        id: 9,
        title: 'Mentor',
        description: 'Giúp đỡ 10 học viên khác',
        icon: '👨‍🏫',
        category: 'social',
        points: 300,
        progress: 3,
        total: 10,
        rarity: 'rare'
    }
]

const certificates = [
    {
        id: 1,
        title: 'JavaScript ES6+ Complete Guide',
        issuedDate: '2024-01-18',
        instructor: 'Nguyễn Hữu Đức',
        credentialId: 'CERT-JS-001',
        score: 95,
        validUntil: null
    },
    {
        id: 2,
        title: 'HTML & CSS Fundamentals',
        issuedDate: '2024-01-10',
        instructor: 'Lê Minh Cường',
        credentialId: 'CERT-HTML-001',
        score: 88,
        validUntil: null
    },
    {
        id: 3,
        title: 'Git Version Control',
        issuedDate: '2024-01-05',
        instructor: 'Trần Văn Nam',
        credentialId: 'CERT-GIT-001',
        score: 92,
        validUntil: null
    }
]

const milestones = [
    {
        id: 1,
        title: 'Người học tích cực',
        description: 'Hoàn thành 5 khóa học',
        progress: 3,
        total: 5,
        reward: '200 điểm + Badge đặc biệt'
    },
    {
        id: 2,
        title: 'Chuyên gia Front-end',
        description: 'Hoàn thành tất cả khóa học Front-end',
        progress: 4,
        total: 6,
        reward: 'Chứng chỉ chuyên ngành + 500 điểm'
    },
    {
        id: 3,
        title: 'Thành viên VIP',
        description: 'Tích lũy 5000 điểm kỹ năng',
        progress: 2450,
        total: 5000,
        reward: 'Quyền truy cập khóa học Premium'
    }
]

const leaderboard = [
    { rank: 1, name: 'Trần Thị Bích', points: 3650, avatar: null },
    { rank: 2, name: 'Nguyễn Văn An', points: 2450, avatar: null, isCurrentUser: true },
    { rank: 3, name: 'Lê Minh Cường', points: 2234, avatar: null },
    { rank: 4, name: 'Phạm Thị Diệu', points: 2100, avatar: null },
    { rank: 5, name: 'Hoàng Văn Em', points: 1890, avatar: null }
]

export default function StudentAchievementsPage() {
    const [selectedCategory, setSelectedCategory] = useState('all')

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common':
                return 'border-gray-300 bg-gray-50'
            case 'uncommon':
                return 'border-green-300 bg-green-50'
            case 'rare':
                return 'border-blue-300 bg-blue-50'
            case 'epic':
                return 'border-purple-300 bg-purple-50'
            case 'legendary':
                return 'border-yellow-300 bg-yellow-50'
            default:
                return 'border-gray-300 bg-gray-50'
        }
    }

    const getRarityBadgeColor = (rarity: string) => {
        switch (rarity) {
            case 'common':
                return 'bg-gray-100 text-gray-800'
            case 'uncommon':
                return 'bg-green-100 text-green-800'
            case 'rare':
                return 'bg-blue-100 text-blue-800'
            case 'epic':
                return 'bg-purple-100 text-purple-800'
            case 'legendary':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const filteredAchievements = selectedCategory === 'all'
        ? earnedAchievements
        : earnedAchievements.filter(achievement => achievement.category === selectedCategory)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Thành tích & Chứng chỉ</h1>
                    <p className="text-muted-foreground">
                        Khám phá các thành tích, chứng chỉ và cột mốc của bạn
                    </p>
                </div>
                <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Chia sẻ thành tích
                </Button>
            </div>

            {/* Achievement Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Thành tích đã đạt</CardTitle>
                        <Trophy className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {achievementStats.totalEarned}/{achievementStats.totalAvailable}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((achievementStats.totalEarned / achievementStats.totalAvailable) * 100)}% hoàn thành
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Điểm thành tích</CardTitle>
                        <Star className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{achievementStats.totalPoints.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Hạng {achievementStats.rank}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chứng chỉ</CardTitle>
                        <Award className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{achievementStats.certificates}</div>
                        <p className="text-xs text-muted-foreground">
                            Chứng chỉ được cấp
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Streak hiện tại</CardTitle>
                        <Flame className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{achievementStats.streak} ngày</div>
                        <p className="text-xs text-muted-foreground">
                            Kỷ lục cá nhân
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="achievements" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="achievements">Thành tích</TabsTrigger>
                    <TabsTrigger value="certificates">Chứng chỉ</TabsTrigger>
                    <TabsTrigger value="milestones">Cột mốc</TabsTrigger>
                    <TabsTrigger value="leaderboard">Bảng xếp hạng</TabsTrigger>
                </TabsList>

                {/* Achievements Tab */}
                <TabsContent value="achievements" className="space-y-4">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedCategory === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory('all')}
                        >
                            Tất cả
                        </Button>
                        <Button
                            variant={selectedCategory === 'milestone' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory('milestone')}
                        >
                            Cột mốc
                        </Button>
                        <Button
                            variant={selectedCategory === 'streak' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory('streak')}
                        >
                            Streak
                        </Button>
                        <Button
                            variant={selectedCategory === 'skill' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory('skill')}
                        >
                            Kỹ năng
                        </Button>
                        <Button
                            variant={selectedCategory === 'quiz' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory('quiz')}
                        >
                            Quiz
                        </Button>
                    </div>

                    {/* Earned Achievements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thành tích đã đạt được</CardTitle>
                            <CardDescription>
                                Các thành tích bạn đã mở khóa trong quá trình học tập
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredAchievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className={`p-4 rounded-lg border-2 ${getRarityColor(achievement.rarity)}`}
                                    >
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">{achievement.icon}</div>
                                            <h4 className="font-medium mb-1">{achievement.title}</h4>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {achievement.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <Badge className={getRarityBadgeColor(achievement.rarity)}>
                                                    {achievement.rarity}
                                                </Badge>
                                                <span className="text-sm font-medium">
                                                    +{achievement.points} điểm
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-2">
                                                Đạt được: {achievement.earnedAt}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Locked Achievements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thành tích chưa mở khóa</CardTitle>
                            <CardDescription>
                                Các thành tích bạn có thể đạt được trong tương lai
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {lockedAchievements.map((achievement) => (
                                    <div
                                        key={achievement.id}
                                        className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-75"
                                    >
                                        <div className="text-center">
                                            <div className="relative">
                                                <div className="text-4xl mb-2 filter grayscale">
                                                    {achievement.icon}
                                                </div>
                                                <Lock className="absolute -top-1 -right-1 h-4 w-4 text-gray-500" />
                                            </div>
                                            <h4 className="font-medium mb-1">{achievement.title}</h4>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {achievement.description}
                                            </p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Tiến độ</span>
                                                    <span>{achievement.progress}/{achievement.total}</span>
                                                </div>
                                                <Progress value={(achievement.progress / achievement.total) * 100} />
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <Badge className={getRarityBadgeColor(achievement.rarity)}>
                                                    {achievement.rarity}
                                                </Badge>
                                                <span className="text-sm font-medium">
                                                    +{achievement.points} điểm
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Certificates Tab */}
                <TabsContent value="certificates" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Chứng chỉ của tôi</CardTitle>
                            <CardDescription>
                                Các chứng chỉ bạn đã nhận được sau khi hoàn thành khóa học
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {certificates.map((certificate) => (
                                    <div key={certificate.id} className="border rounded-lg p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                <div className="p-3 bg-green-100 rounded-lg">
                                                    <Award className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-lg">{certificate.title}</h4>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Giảng viên: {certificate.instructor}
                                                    </p>
                                                    <div className="flex items-center space-x-4 text-sm">
                                                        <span>Ngày cấp: {certificate.issuedDate}</span>
                                                        <span>Điểm số: {certificate.score}%</span>
                                                        <span>ID: {certificate.credentialId}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm">
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Tải về
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Share2 className="h-4 w-4 mr-2" />
                                                    Chia sẻ
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Milestones Tab */}
                <TabsContent value="milestones" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Cột mốc học tập</CardTitle>
                            <CardDescription>
                                Các mục tiêu dài hạn và phần thưởng đặc biệt
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {milestones.map((milestone) => (
                                    <div key={milestone.id} className="border rounded-lg p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="font-medium text-lg">{milestone.title}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {milestone.description}
                                                </p>
                                            </div>
                                            <Badge className="bg-yellow-100 text-yellow-800">
                                                Đặc biệt
                                            </Badge>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-sm">
                                                <span>Tiến độ</span>
                                                <span>{milestone.progress}/{milestone.total}</span>
                                            </div>
                                            <Progress value={(milestone.progress / milestone.total) * 100} />
                                        </div>

                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <h5 className="text-sm font-medium text-blue-900 mb-1">
                                                Phần thưởng:
                                            </h5>
                                            <p className="text-sm text-blue-800">{milestone.reward}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Leaderboard Tab */}
                <TabsContent value="leaderboard" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bảng xếp hạng</CardTitle>
                            <CardDescription>
                                Top học viên có điểm thành tích cao nhất
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {leaderboard.map((user) => (
                                    <div
                                        key={user.rank}
                                        className={`flex items-center justify-between p-4 rounded-lg border ${user.isCurrentUser ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold">
                                                {user.rank === 1 ? <Crown className="h-4 w-4" /> :
                                                    user.rank === 2 ? <Medal className="h-4 w-4" /> :
                                                        user.rank === 3 ? <Award className="h-4 w-4" /> : user.rank}
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {user.name} {user.isCurrentUser && '(Bạn)'}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Hạng #{user.rank}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{user.points.toLocaleString()}</div>
                                            <div className="text-sm text-muted-foreground">điểm</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
