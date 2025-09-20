import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { AppContainer } from "./app-container"

interface FooterLink {
  title: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface AppFooterProps {
  className?: string
  sections?: FooterSection[]
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
  }
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
  }
  companyName?: string
  description?: string
}

const defaultSections: FooterSection[] = [
  {
    title: "Khóa học",
    links: [
      { title: "Lập trình Web", href: "/courses/web-development" },
      { title: "Mobile App", href: "/courses/mobile-app" },
      { title: "Data Science", href: "/courses/data-science" },
      { title: "UI/UX Design", href: "/courses/ui-ux-design" },
      { title: "Digital Marketing", href: "/courses/digital-marketing" }
    ]
  },
  {
    title: "Hỗ trợ",
    links: [
      { title: "Trung tâm trợ giúp", href: "/help" },
      { title: "Liên hệ", href: "/contact" },
      { title: "FAQ", href: "/faq" },
      { title: "Báo cáo lỗi", href: "/report-bug" },
      { title: "Hướng dẫn sử dụng", href: "/guide" }
    ]
  },
  {
    title: "Công ty",
    links: [
      { title: "Về chúng tôi", href: "/about" },
      { title: "Tuyển dụng", href: "/careers" },
      { title: "Tin tức", href: "/news" },
      { title: "Đối tác", href: "/partners" },
      { title: "Sự kiện", href: "/events" }
    ]
  },
  {
    title: "Pháp lý",
    links: [
      { title: "Điều khoản sử dụng", href: "/terms" },
      { title: "Chính sách bảo mật", href: "/privacy" },
      { title: "Chính sách Cookie", href: "/cookies" },
      { title: "Bản quyền", href: "/copyright" },
      { title: "Hoàn tiền", href: "/refund-policy" }
    ]
  }
]

const defaultSocialLinks = {
  facebook: "https://facebook.com/eduplatform",
  twitter: "https://twitter.com/eduplatform",
  instagram: "https://instagram.com/eduplatform",
  youtube: "https://youtube.com/@eduplatform"
}

const defaultContactInfo = {
  email: "support@eduplatform.vn",
  phone: "1900-1234",
  address: "123 Đường ABC, Quận 1, TP.HCM"
}

export function AppFooter({
  className,
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  contactInfo = defaultContactInfo,
  companyName = "EduPlatform",
  description = "Nền tảng học trực tuyến hàng đầu với các khóa học chất lượng cao từ các chuyên gia trong ngành. Nâng cao kỹ năng và phát triển sự nghiệp của bạn."
}: AppFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer 
      className={cn(
        "bg-gradient-to-br from-muted/30 via-background to-muted/20 border-t border-border/40 relative overflow-hidden",
        className
      )}
      role="contentinfo"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"></div>
      
      <AppContainer className="relative">
        <div className="py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">EP</span>
                </div>
                <span className="font-bold text-xl">{companyName}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6 max-w-md leading-relaxed">
                {description}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.email && (
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <a 
                      href={`mailto:${contactInfo.email}`}
                      className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                )}
                {contactInfo.phone && (
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Phone className="h-4 w-4 text-secondary" />
                    </div>
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                )}
                {contactInfo.address && (
                  <div className="flex items-start space-x-3 text-sm text-muted-foreground">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4 text-accent" />
                    </div>
                    <span className="leading-relaxed">{contactInfo.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Sections */}
            {sections.map((section, index) => (
              <div key={section.title} className="lg:col-span-1">
                <h3 className="font-semibold text-lg mb-4 text-foreground">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href || link.title}>
                      <Link
                        href={link.href || "#"}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded inline-block"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-border/40">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              {/* Copyright */}
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <span>© {currentYear} {companyName}. Được phát triển với</span>
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span>tại Việt Nam</span>
              </div>

              {/* Social Links */}
              {Object.keys(socialLinks).length > 0 && (
                <div className="flex items-center gap-6">
                  <span className="text-sm text-muted-foreground">Theo dõi chúng tôi:</span>
                  <div className="flex items-center gap-3">
                    {socialLinks.facebook && (
                      <a
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-600/10 hover:bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-600 hover:text-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-sky-600/10 hover:bg-sky-600/20 rounded-lg flex items-center justify-center text-sky-600 hover:text-sky-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {socialLinks.instagram && (
                      <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-pink-600/10 hover:bg-pink-600/20 rounded-lg flex items-center justify-center text-pink-600 hover:text-pink-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-offset-2"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {socialLinks.youtube && (
                      <a
                        href={socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-red-600/10 hover:bg-red-600/20 rounded-lg flex items-center justify-center text-red-600 hover:text-red-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                        aria-label="YouTube"
                      >
                        <Youtube className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </AppContainer>
    </footer>
  )
}
