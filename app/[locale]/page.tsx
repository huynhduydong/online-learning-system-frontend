"use client"

import { useEffect } from "react"
import { 
  BookOpen, Users, Award, ArrowRight, Play, Star, Sparkles, Zap, Rocket, 
  HelpCircle, MessageCircle, Phone, Mail, Code, Clock, Palette, TrendingUp, 
  Check, MessageSquare, Route, Target, CheckCircle, Briefcase, Menu, X, ChevronUp,
  Home, GraduationCap, UserCheck, MessageSquareText, MapPin, HelpCircle as FAQ
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppHeader } from "@/components/app-header"
import { AppContainer } from "@/components/app-container"
import { AppFooter } from "@/components/app-footer"

export default function HomePage() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = () => {
      const stickyNav = document.getElementById('sticky-nav')
      const backToTop = document.getElementById('back-to-top')
      const scrollY = window.scrollY
      
      // Show/hide sticky navigation after scrolling past hero section
      if (stickyNav) {
        if (scrollY > 300) {
          stickyNav.style.opacity = '1'
          stickyNav.style.transform = 'translateX(-50%) translateY(0)'
        } else {
          stickyNav.style.opacity = '0'
          stickyNav.style.transform = 'translateX(-50%) translateY(-20px)'
        }
      }
      
      // Show/hide back to top button
      if (backToTop) {
        if (scrollY > 500) {
          backToTop.style.opacity = '1'
          backToTop.style.transform = 'translateY(0)'
        } else {
          backToTop.style.opacity = '0'
          backToTop.style.transform = 'translateY(16px)'
        }
      }
    }

    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        const targetElement = document.querySelector(target.getAttribute('href')!)
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('click', handleSmoothScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleSmoothScroll)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <AppHeader 
        navItems={[
          { title: "Khóa học", href: "/courses" },
          { title: "Giảng viên", href: "/instructors" },
          { title: "Về chúng tôi", href: "/about" }
        ]}
        showSearch={true}
        showNotifications={true}
      />

      {/* Sticky Navigation Bar */}
      <nav className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-background/95 backdrop-blur-md border border-border/50 rounded-full px-6 py-3 shadow-lg opacity-0 translate-y-[-20px] transition-all duration-300 hover:shadow-xl" id="sticky-nav" aria-label="Điều hướng trang">
        <div className="flex items-center space-x-6">
          <a href="#hero" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Trang chủ</span>
          </a>
          <a href="#features" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Tính năng</span>
          </a>
          <a href="#courses" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            <GraduationCap className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Khóa học</span>
          </a>
          <a href="#instructors" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            <UserCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Giảng viên</span>
          </a>
          <a href="#testimonials" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            <MessageSquareText className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Đánh giá</span>
          </a>
          <a href="#learning-path" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            <MapPin className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Lộ trình</span>
          </a>
          <a href="#faq" className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            <FAQ className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">FAQ</span>
          </a>
        </div>
      </nav>

      {/* Back to Top Button */}
      <button 
        id="back-to-top"
        className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-gradient-primary rounded-full shadow-lg opacity-0 translate-y-4 transition-all duration-300 hover:shadow-xl hover:scale-110 flex items-center justify-center group"
        onClick={scrollToTop}
      >
        <ChevronUp className="h-6 w-6 text-white group-hover:animate-bounce" />
      </button>

      {/* Main Content */}
      <main id="main-content">
        {/* Hero Section */}
        <section id="hero" className="py-20 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-primary opacity-10 rounded-full blur-3xl animate-bounce-soft"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-secondary to-accent opacity-10 rounded-full blur-3xl animate-bounce-soft" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-slide-up">
            <Badge className="mb-6 bg-gradient-primary-soft text-primary border-0 px-4 py-2 text-sm font-medium">
              <Zap className="w-4 h-4 mr-2" />
              Nền tảng học tập thế hệ mới
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Học tập không giới hạn với
              <br />
              <span className="text-gradient animate-scale-in"> EduPlatform</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Khám phá hàng nghìn khóa học chất lượng cao từ các chuyên gia hàng đầu. 
              Nâng cao kỹ năng và phát triển sự nghiệp của bạn ngay hôm nay.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 bg-gradient-primary hover:shadow-glow transition-all duration-300 shadow-medium group"
              >
                <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Bắt đầu học ngay
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-gradient hover:shadow-glow transition-all duration-300 group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Xem demo
              </Button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary"></div>
                  <div className="w-8 h-8 rounded-full bg-secondary"></div>
                  <div className="w-8 h-8 rounded-full bg-accent"></div>
                </div>
                <span>10,000+ học viên tin tưởng</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1">4.9/5 đánh giá</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-gradient-primary-soft text-primary border-0">
              Tính năng vượt trội
            </Badge>
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Trải nghiệm học tập 
              <span className="text-gradient"> đỉnh cao</span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Khám phá những tính năng hiện đại giúp bạn học tập hiệu quả hơn bao giờ hết
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-large transition-all duration-300 border-0 shadow-soft glass-effect hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <Play className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Video HD 4K</CardTitle>
                <CardDescription className="text-base">
                  Học với video chất lượng siêu nét, hỗ trợ phát trực tuyến mượt mà không giới hạn
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-large transition-all duration-300 border-0 shadow-soft glass-effect hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Cộng đồng sôi động</CardTitle>
                <CardDescription className="text-base">
                  Tương tác với giảng viên và học viên khác trong Q&A, thảo luận nhóm
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-large transition-all duration-300 border-0 shadow-soft glass-effect hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">Chứng chỉ quốc tế</CardTitle>
                <CardDescription className="text-base">
                  Nhận chứng chỉ hoàn thành khóa học được công nhận toàn cầu
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="group hover:shadow-large transition-all duration-300 border-0 shadow-soft glass-effect hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">AI theo dõi tiến độ</CardTitle>
                <CardDescription className="text-base">
                  Quản lý và theo dõi tiến độ học tập thông minh với AI
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section id="courses" className="section-padding bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        <div className="container-fluid relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Khóa học hot nhất</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-6">
              Khóa Học Được Yêu Thích Nhất
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Khám phá những khóa học được đánh giá cao nhất từ cộng đồng học viên của chúng tôi
            </p>
          </div>

          <div className="grid-auto-fit mb-12">
            {/* Course Card 1 */}
            <Card className="group bg-glass border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                    <Code className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                    Bestseller
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                    ⭐ 4.9
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
                    Lập trình
                  </Badge>
                  <span className="text-sm text-muted-foreground">• 12 tuần</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  Fullstack JavaScript với React & Node.js
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  Học cách xây dựng ứng dụng web hoàn chỉnh từ frontend đến backend với công nghệ hiện đại nhất.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">A</span>
                    </div>
                    <span className="text-sm font-medium">Alex Nguyễn</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gradient">2.999.000₫</div>
                    <div className="text-sm text-muted-foreground line-through">4.999.000₫</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    1,234 học viên
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    45 giờ
                  </span>
                </div>
                <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  Đăng ký ngay
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Course Card 2 */}
            <Card className="group bg-glass border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center">
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    Mới nhất
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                    ⭐ 4.8
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary border-secondary/20">
                    Thiết kế
                  </Badge>
                  <span className="text-sm text-muted-foreground">• 8 tuần</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  UI/UX Design với Figma & Adobe XD
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  Từ ý tưởng đến sản phẩm hoàn chỉnh, học cách thiết kế giao diện người dùng chuyên nghiệp.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">M</span>
                    </div>
                    <span className="text-sm font-medium">Maria Trần</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gradient">1.999.000₫</div>
                    <div className="text-sm text-muted-foreground line-through">3.499.000₫</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    856 học viên
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    32 giờ
                  </span>
                </div>
                <Button className="w-full bg-gradient-to-r from-secondary to-accent hover:shadow-glow transition-all duration-300">
                  Đăng ký ngay
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Course Card 3 */}
            <Card className="group bg-glass border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                    Hot trend
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium">
                    ⭐ 4.9
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-gradient-to-r from-accent/10 to-primary/10 text-accent border-accent/20">
                    Marketing
                  </Badge>
                  <span className="text-sm text-muted-foreground">• 10 tuần</span>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                  Digital Marketing & Social Media
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  Chiến lược marketing số hiệu quả, từ SEO, SEM đến Social Media Marketing chuyên nghiệp.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">D</span>
                    </div>
                    <span className="text-sm font-medium">David Lê</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gradient">2.499.000₫</div>
                    <div className="text-sm text-muted-foreground line-through">3.999.000₫</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    2,156 học viên
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    38 giờ
                  </span>
                </div>
                <Button className="w-full bg-gradient-to-r from-accent to-primary hover:shadow-glow transition-all duration-300">
                  Đăng ký ngay
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
              Xem tất cả khóa học
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Instructor Spotlight Section */}
      <section id="instructors" className="section-padding bg-gradient-to-br from-muted/20 via-background to-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="container-fluid relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary/10 to-accent/10 backdrop-blur-sm border border-secondary/20 rounded-full px-6 py-2 mb-6">
              <Award className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">Đội ngũ chuyên gia</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-6">
              Giảng Viên Hàng Đầu
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Học từ những chuyên gia hàng đầu trong ngành với nhiều năm kinh nghiệm thực tế
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Instructor 1 */}
            <Card className="group bg-glass border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-glow interactive text-center overflow-hidden">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                    AN
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Alex Nguyễn
                </h3>
                <p className="text-secondary font-medium mb-3">Senior Full-Stack Developer</p>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  7+ năm kinh nghiệm tại Google, Facebook. Chuyên gia React, Node.js và kiến trúc microservices.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    5,234 học viên
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    4.9
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
                    JavaScript
                  </Badge>
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
                    React
                  </Badge>
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
                    Node.js
                  </Badge>
                </div>
                <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                  Xem hồ sơ
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Instructor 2 */}
            <Card className="group bg-glass border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-glow interactive text-center overflow-hidden">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                    MT
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  Maria Trần
                </h3>
                <p className="text-secondary font-medium mb-3">Lead UI/UX Designer</p>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  10+ năm kinh nghiệm thiết kế tại Apple, Adobe. Chuyên gia Design System và User Research.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    3,856 học viên
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    4.8
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary border-secondary/20">
                    Figma
                  </Badge>
                  <Badge variant="secondary" className="bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary border-secondary/20">
                    Adobe XD
                  </Badge>
                  <Badge variant="secondary" className="bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary border-secondary/20">
                    Sketch
                  </Badge>
                </div>
                <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                  Xem hồ sơ
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Instructor 3 */}
            <Card className="group bg-glass border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-glow interactive text-center overflow-hidden">
              <CardContent className="p-8">
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">
                    DL
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  David Lê
                </h3>
                <p className="text-secondary font-medium mb-3">Digital Marketing Expert</p>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  8+ năm kinh nghiệm Marketing tại Amazon, Shopee. Chuyên gia Growth Hacking và Performance Marketing.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    6,156 học viên
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    4.9
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-gradient-to-r from-accent/10 to-primary/10 text-accent border-accent/20">
                    SEO/SEM
                  </Badge>
                  <Badge variant="secondary" className="bg-gradient-to-r from-accent/10 to-primary/10 text-accent border-accent/20">
                    Analytics
                  </Badge>
                  <Badge variant="secondary" className="bg-gradient-to-r from-accent/10 to-primary/10 text-accent border-accent/20">
                    Social Media
                  </Badge>
                </div>
                <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                  Xem hồ sơ
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" className="border-secondary/30 hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-300">
              Xem tất cả giảng viên
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Student Testimonials Section */}
      <section id="testimonials" className="section-padding bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-accent/5"></div>
        <div className="container-fluid relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-primary/10 backdrop-blur-sm border border-accent/20 rounded-full px-6 py-2 mb-6">
              <MessageSquare className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Phản hồi học viên</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-6">
              Học Viên Nói Gì Về Chúng Tôi
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Hàng nghìn học viên đã thành công trong sự nghiệp nhờ các khóa học của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Testimonial 1 */}
            <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed italic">
                  "Khóa học Fullstack JavaScript đã thay đổi hoàn toàn sự nghiệp của tôi. Từ một người không biết gì về lập trình, giờ tôi đã trở thành Senior Developer tại một công ty công nghệ hàng đầu."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                    TH
                  </div>
                  <div>
                    <div className="font-semibold">Trần Hoàng</div>
                    <div className="text-sm text-muted-foreground">Senior Developer tại VNG</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
                    Fullstack JavaScript
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed italic">
                  "Khóa học UI/UX Design không chỉ dạy kỹ thuật mà còn giúp tôi hiểu sâu về tâm lý người dùng. Giờ tôi đã có studio thiết kế riêng với 20+ nhân viên."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-white font-bold">
                    LM
                  </div>
                  <div>
                    <div className="font-semibold">Lê Mai</div>
                    <div className="text-sm text-muted-foreground">Founder tại Creative Studio</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary border-secondary/20">
                    UI/UX Design
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed italic">
                  "Khóa học Digital Marketing đã giúp tôi tăng doanh thu của công ty lên 300% chỉ trong 6 tháng. Kiến thức thực tế và chiến lược rất hiệu quả."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white font-bold">
                    NQ
                  </div>
                  <div>
                    <div className="font-semibold">Nguyễn Quang</div>
                    <div className="text-sm text-muted-foreground">Marketing Director tại Tiki</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gradient-to-r from-accent/10 to-primary/10 text-accent border-accent/20">
                    Digital Marketing
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 4 */}
            <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed italic">
                  "Cách giảng dạy rất dễ hiểu, từ cơ bản đến nâng cao. Hỗ trợ 24/7 và cộng đồng học viên rất tích cực. Tôi đã chuyển nghề thành công sau 8 tháng học."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                    PT
                  </div>
                  <div>
                    <div className="font-semibold">Phạm Thảo</div>
                    <div className="text-sm text-muted-foreground">Product Manager tại Grab</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20">
                    Product Management
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 5 */}
            <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed italic">
                  "Chất lượng video HD, bài tập thực hành phong phú và mentor hỗ trợ tận tình. Đây là khoá đầu tư tốt nhất cho sự nghiệp của tôi."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center text-white font-bold">
                    VK
                  </div>
                  <div>
                    <div className="font-semibold">Vũ Khang</div>
                    <div className="text-sm text-muted-foreground">Tech Lead tại FPT Software</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gradient-to-r from-secondary/10 to-primary/10 text-secondary border-secondary/20">
                    DevOps & Cloud
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 6 */}
            <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed italic">
                  "Từ một sinh viên mới ra trường, tôi đã có thể ứng tuyển thành công vào các công ty lớn nhờ kiến thức và dự án thực tế từ khóa học."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center text-white font-bold">
                    HN
                  </div>
                  <div>
                    <div className="font-semibold">Hoàng Nam</div>
                    <div className="text-sm text-muted-foreground">Junior Developer tại Shopee</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-gradient-to-r from-accent/10 to-secondary/10 text-accent border-accent/20">
                    Mobile Development
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">15,000+</div>
                <div className="text-muted-foreground">Học viên thành công</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">4.9/5</div>
                <div className="text-muted-foreground">Đánh giá trung bình</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gradient mb-2">95%</div>
                <div className="text-muted-foreground">Tỷ lệ có việc làm</div>
              </div>
            </div>
            <Button variant="outline" size="lg" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300">
              Xem thêm đánh giá
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section id="learning-path" className="section-padding bg-gradient-to-br from-background via-secondary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        <div className="container-fluid relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-2 mb-6">
              <Route className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Lộ trình học tập</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-6">
              Lộ Trình Học Tập Có Hệ Thống
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Từ người mới bắt đầu đến chuyên gia, chúng tôi có lộ trình phù hợp cho mọi cấp độ
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Beginner Path */}
            <Card className="group bg-glass border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Người Mới Bắt Đầu</h3>
                    <p className="text-sm text-muted-foreground">0-6 tháng kinh nghiệm</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">Cơ Bản HTML/CSS</div>
                      <div className="text-sm text-muted-foreground">4 tuần • 20 bài học</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">JavaScript Cơ Bản</div>
                      <div className="text-sm text-muted-foreground">6 tuần • 30 bài học</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">Responsive Design</div>
                      <div className="text-sm text-muted-foreground">3 tuần • 15 bài học</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">Dự Án Thực Hành</div>
                      <div className="text-sm text-muted-foreground">2 tuần • 5 dự án</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-primary">3-4 tháng</div>
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
                    Cơ bản
                  </Badge>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300">
                  Bắt Đầu Ngay
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Intermediate Path */}
            <Card className="group bg-glass border-border/50 hover:border-secondary/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-accent"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Trung Cấp</h3>
                    <p className="text-sm text-muted-foreground">6-18 tháng kinh nghiệm</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">React/Vue Framework</div>
                      <div className="text-sm text-muted-foreground">8 tuần • 40 bài học</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">Node.js & API</div>
                      <div className="text-sm text-muted-foreground">6 tuần • 30 bài học</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">Database & MongoDB</div>
                      <div className="text-sm text-muted-foreground">4 tuần • 20 bài học</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">Fullstack Project</div>
                      <div className="text-sm text-muted-foreground">4 tuần • 3 dự án</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-secondary">5-6 tháng</div>
                  <Badge variant="secondary" className="bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary border-secondary/20">
                    Trung cấp
                  </Badge>
                </div>

                <Button variant="outline" className="w-full border-secondary/30 hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-300">
                  Tìm Hiểu Thêm
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Advanced Path */}
            <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 hover:shadow-glow interactive overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-primary"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Nâng Cao</h3>
                    <p className="text-sm text-muted-foreground">18+ tháng kinh nghiệm</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">Microservices Architecture</div>
                      <div className="text-sm text-muted-foreground">6 tuần • 25 bài học</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">DevOps & Cloud</div>
                      <div className="text-sm text-muted-foreground">8 tuần • 35 bài học</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">System Design</div>
                      <div className="text-sm text-muted-foreground">4 tuần • 20 bài học</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center mt-1">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium">Enterprise Project</div>
                      <div className="text-sm text-muted-foreground">6 tuần • 2 dự án</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-2xl font-bold text-accent">6-8 tháng</div>
                  <Badge variant="secondary" className="bg-gradient-to-r from-accent/10 to-primary/10 text-accent border-accent/20">
                    Nâng cao
                  </Badge>
                </div>

                <Button variant="outline" className="w-full border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300">
                  Khám Phá
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <div className="bg-glass border border-border/50 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Lộ Trình Cá Nhân Hóa</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Không chắc chắn nên bắt đầu từ đâu? Làm bài test đánh giá năng lực để nhận lộ trình học tập phù hợp nhất với bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300">
                  <Target className="h-5 w-5 mr-2" />
                  Làm Bài Test Đánh Giá
                </Button>
                <Button variant="outline" size="lg" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Tư Vấn 1-1 Miễn Phí
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Học Theo Cấp Độ</h4>
                <p className="text-sm text-muted-foreground">Từ cơ bản đến nâng cao, phù hợp mọi trình độ</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Mentor Hỗ Trợ</h4>
                <p className="text-sm text-muted-foreground">Được hướng dẫn bởi các chuyên gia hàng đầu</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Chứng Chỉ Uy Tín</h4>
                <p className="text-sm text-muted-foreground">Được công nhận bởi các doanh nghiệp lớn</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Hỗ Trợ Việc Làm</h4>
                <p className="text-sm text-muted-foreground">Kết nối với 500+ đối tác tuyển dụng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="section-padding bg-gradient-to-br from-background via-accent/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
        <div className="container-fluid relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-secondary/10 backdrop-blur-sm border border-accent/20 rounded-full px-6 py-2 mb-6">
              <HelpCircle className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Câu hỏi thường gặp</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display text-gradient mb-6">
              Câu Hỏi Thường Gặp
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Tìm câu trả lời cho những thắc mắc phổ biến về khóa học và dịch vụ của chúng tôi
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-6">
              {/* FAQ Item 1 */}
              <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 interactive overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3">Tôi có cần kiến thức lập trình trước khi tham gia khóa học không?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Không cần thiết! Chúng tôi có các khóa học dành cho người mới bắt đầu hoàn toàn. Các khóa học được thiết kế từ cơ bản đến nâng cao, với lộ trình học tập rõ ràng và hỗ trợ mentor 24/7. Bạn chỉ cần có máy tính và tinh thần học hỏi.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Item 2 */}
              <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 interactive overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3">Thời gian học mỗi ngày là bao nhiêu? Tôi có thể học part-time không?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Hoàn toàn có thể! Khóa học được thiết kế linh hoạt, bạn có thể học 1-2 tiếng mỗi ngày. Tất cả video bài giảng có thể xem lại không giới hạn, bài tập thực hành có thể làm theo tốc độ của bạn. Chúng tôi cũng có lịch học buổi tối và cuối tuần.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Item 3 */}
              <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 interactive overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3">Sau khi hoàn thành khóa học, tôi có được hỗ trợ tìm việc không?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Có! Chúng tôi có đội ngũ Career Support chuyên nghiệp, kết nối với 500+ đối tác tuyển dụng. Bạn sẽ được hỗ trợ viết CV, chuẩn bị phỏng vấn, và giới thiệu việc làm phù hợp. Tỷ lệ có việc làm của học viên đạt 95% trong vòng 6 tháng.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Item 4 */}
              <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 interactive overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">4</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3">Chứng chỉ sau khóa học có được công nhận bởi doanh nghiệp không?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Chứng chỉ của chúng tôi được công nhận bởi các doanh nghiệp lớn như VNG, FPT, Tiki, Grab, Shopee... Ngoài ra, chúng tôi cũng là đối tác đào tạo chính thức của Google, Microsoft, AWS. Chứng chỉ có thể xác thực trực tuyến và được ghi nhận trên LinkedIn.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Item 5 */}
              <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 interactive overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">5</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3">Tôi có thể hoàn tiền nếu không hài lòng với khóa học không?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Có! Chúng tôi cam kết hoàn tiền 100% trong vòng 30 ngày đầu nếu bạn không hài lòng với chất lượng khóa học. Không cần lý do, không cần giải thích. Sự hài lòng của học viên là ưu tiên hàng đầu của chúng tôi.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Item 6 */}
              <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 interactive overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">6</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3">Có hỗ trợ trả góp học phí không?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Có! Chúng tôi hỗ trợ nhiều hình thức thanh toán: trả góp 0% lãi suất qua thẻ tín dụng, trả góp qua các ứng dụng như Kredivo, Fundiin. Ngoài ra còn có chương trình học trước - trả sau với mức lãi suất ưu đãi cho sinh viên.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Item 7 */}
              <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 interactive overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">7</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3">Khóa học có cập nhật theo công nghệ mới nhất không?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Chắc chắn! Nội dung khóa học được cập nhật thường xuyên theo xu hướng công nghệ mới nhất. Học viên sẽ được thông báo và truy cập miễn phí vào các bài học mới. Chúng tôi cũng tổ chức workshop và webinar hàng tháng về các công nghệ trending.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Item 8 */}
              <Card className="group bg-glass border-border/50 hover:border-accent/50 transition-all duration-500 interactive overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">8</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3">Tôi có thể học nhiều khóa học cùng lúc không?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Có thể, nhưng chúng tôi khuyến nghị tập trung vào 1-2 khóa học để đạt hiệu quả tối ưu. Nếu đăng ký gói All-Access, bạn có thể truy cập tất cả khóa học với mức giá ưu đãi và lộ trình học tập được cá nhân hóa theo mục tiêu của bạn.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="bg-glass border border-border/50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4">Vẫn Còn Thắc Mắc?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7. Hãy liên hệ để được giải đáp mọi thắc mắc.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Chat Trực Tiếp
                  </Button>
                  <Button variant="outline" size="lg" className="border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-300">
                    <Phone className="h-5 w-5 mr-2" />
                    Gọi Hotline: 1900-1234
                  </Button>
                  <Button variant="outline" size="lg" className="border-secondary/30 hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-300">
                    <Mail className="h-5 w-5 mr-2" />
                    Email: support@edutech.vn
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* Footer */}
      <AppFooter />
    </div>
  )
}
