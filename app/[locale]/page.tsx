import { BookOpen, Users, Award, ArrowRight, Play, Star, Sparkles, Zap, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="glass-effect border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-gradient" />
              <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-bounce-soft" />
            </div>
            <span className="text-2xl font-bold text-gradient">EduPlatform</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">Khóa học</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">Giảng viên</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">Về chúng tôi</a>
            <Button variant="outline" className="border-gradient hover:shadow-glow transition-all duration-300">
              Đăng nhập
            </Button>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 shadow-soft">
              Đăng ký
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
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
      <section className="py-20 px-4 relative">
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

      {/* Footer */}
      <footer className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/80 via-background to-muted/60"></div>
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
        
        <div className="relative border-t border-border/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="md:col-span-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="relative">
                    <BookOpen className="h-8 w-8 text-gradient" />
                    <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
                  </div>
                  <span className="text-xl font-bold text-gradient">EduPlatform</span>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Nền tảng học tập trực tuyến thế hệ mới, mang đến trải nghiệm học tập đỉnh cao với công nghệ AI tiên tiến.
                </p>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center hover:shadow-glow transition-all duration-300 cursor-pointer">
                    <span className="text-white font-bold text-sm">f</span>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center hover:shadow-glow transition-all duration-300 cursor-pointer">
                    <span className="text-white font-bold text-sm">Y</span>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center hover:shadow-glow transition-all duration-300 cursor-pointer">
                    <span className="text-white font-bold text-sm">in</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-6 text-lg">Khóa học hot</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">🚀 Lập trình AI</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">🎨 UI/UX Design</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">📱 Mobile Development</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">💼 Digital Marketing</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-6 text-lg">Hỗ trợ 24/7</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">💬 Trung tâm trợ giúp</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">📞 Liên hệ hotline</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">❓ FAQ</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block">📋 Chính sách</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-6 text-lg">Nhận thông báo mới</h4>
                <p className="text-muted-foreground mb-4 text-sm">
                  Đăng ký để nhận thông tin về khóa học mới và ưu đãi đặc biệt
                </p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Email của bạn" 
                    className="flex-1 px-3 py-2 bg-background/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                  <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground text-sm">
                &copy; 2024 EduPlatform. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Điều khoản</a>
                <a href="#" className="hover:text-primary transition-colors">Bảo mật</a>
                <a href="#" className="hover:text-primary transition-colors">Cookie</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
