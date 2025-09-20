# 🎓 Online Learning System

Hệ thống giáo dục trực tuyến toàn diện được xây dựng với Next.js 14, TypeScript, và các công nghệ hiện đại nhất.

## ✨ Tính năng chính

### 👥 Đối tượng người dùng
- **Khách vãng lai**: Xem và tìm kiếm khóa học
- **Học viên**: Đăng ký, thanh toán, theo dõi tiến độ học tập
- **Giảng viên**: Tạo và quản lý nội dung khóa học
- **Quản trị viên**: Quản lý hệ thống và người dùng

### 🎯 Miền nghiệp vụ
- **Tìm kiếm/xem khóa học**: Duyệt và tìm kiếm khóa học theo danh mục
- **Đăng ký & thanh toán**: Quy trình đăng ký và thanh toán an toàn
- **Theo dõi tiến độ**: Theo dõi tiến độ học tập chi tiết
- **Tạo & quản lý nội dung**: Công cụ tạo và quản lý khóa học
- **Q&A trong khóa học**: Hệ thống hỏi đáp tương tác

## 🛠️ Công nghệ sử dụng

### Core Framework
- **Next.js 14** - React framework với App Router
- **TypeScript** - Strict mode enabled
- **React 18** - Latest React features

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Lucide React** - Beautiful icons
- **next-themes** - Dark/light mode support

### State Management & Data Fetching
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Internationalization & Media
- **next-intl** - Internationalization support
- **HLS.js** - Video streaming support

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

### Testing
- **Playwright** - E2E testing
- **Testing Library** - Component testing
- **Jest** - Unit testing
- **MSW** - API mocking

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js 18+ 
- pnpm (khuyến nghị) hoặc npm/yarn

### 1. Clone repository
\`\`\`bash
git clone <repository-url>
cd online-learning-system
\`\`\`

### 2. Cài đặt dependencies
\`\`\`bash
pnpm install
\`\`\`

### 3. Thiết lập environment variables
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Cập nhật các biến môi trường trong `.env.local`:
\`\`\`env
# App Configuration
NEXT_PUBLIC_APP_NAME="Online Learning System"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Development
NODE_ENV=development
\`\`\`

### 4. Chạy development server
\`\`\`bash
pnpm dev
\`\`\`

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📝 Scripts có sẵn

\`\`\`bash
# Development
pnpm dev          # Chạy development server
pnpm build        # Build production
pnpm start        # Chạy production server

# Code Quality
pnpm lint         # Chạy ESLint
pnpm lint:fix     # Tự động fix linting issues
pnpm type-check   # Kiểm tra TypeScript

# Testing
pnpm test         # Chạy Playwright tests
pnpm test:ui      # Chạy Playwright với UI
pnpm test:unit    # Chạy Jest unit tests
pnpm test:unit:watch # Chạy Jest ở watch mode

# Git Hooks
pnpm prepare      # Cài đặt Husky hooks
\`\`\`

## 🧪 Testing

### Unit Tests (Jest + Testing Library)
\`\`\`bash
pnpm test:unit
\`\`\`

### E2E Tests (Playwright)
\`\`\`bash
pnpm test
\`\`\`

### API Mocking (MSW)
MSW được tự động kích hoạt trong development mode để mock API endpoints.

## 📁 Cấu trúc thư mục

\`\`\`
├── app/                    # Next.js App Router
│   ├── courses/           # Course pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Homepage
│   └── providers.tsx      # App providers
├── src/
│   ├── components/        # Reusable components
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility functions
│   ├── mocks/            # MSW mocks
│   ├── stores/           # Zustand stores
│   └── types/            # TypeScript types
├── messages/             # i18n messages
├── tests/
│   ├── e2e/             # Playwright tests
│   └── unit/            # Jest tests
├── public/              # Static assets
└── docs/                # Documentation
\`\`\`

## 🔧 Cấu hình

### TypeScript
- Strict mode enabled
- Path mapping configured (`@/*`)
- Next.js plugin integrated

### ESLint
- Next.js recommended rules
- TypeScript support
- Prettier integration

### Prettier
- Tailwind CSS plugin
- Consistent formatting rules

### Husky & lint-staged
- Pre-commit hooks
- Automatic linting and formatting

## 🌐 Internationalization

Hỗ trợ đa ngôn ngữ với next-intl:
- Tiếng Việt (mặc định)
- English

Thêm ngôn ngữ mới:
1. Tạo file message trong `messages/`
2. Cập nhật `middleware.ts`
3. Cập nhật `src/i18n.ts`

## 📊 State Management

### Zustand Stores
- `auth-store.ts` - Authentication state
- `course-store.ts` - Course data and enrollment

### TanStack Query
- Server state caching
- Background refetching
- Optimistic updates

## 🎨 UI Components

Sử dụng shadcn/ui components:
- Button, Card, Input, Badge
- Responsive design
- Dark/light mode support
- Accessible by default

## 🔒 Authentication

Mock authentication system:
- Email/password login
- Role-based access (student, instructor, admin)
- Persistent sessions with Zustand

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Optimized for all screen sizes

## 🚀 Deployment

### Vercel (Khuyến nghị)
\`\`\`bash
pnpm build
\`\`\`

### Docker
\`\`\`bash
docker build -t online-learning-system .
docker run -p 3000:3000 online-learning-system
\`\`\`

## 📈 Performance

- Next.js 14 App Router
- Image optimization
- Code splitting
- Bundle analysis

## 🔍 Monitoring & Analytics

Sẵn sàng tích hợp:
- Vercel Analytics
- Google Analytics
- Error tracking (Sentry)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

### Commit Convention
Sử dụng conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance

## 📋 Checklist triển khai

### ✅ Development Ready
- [x] `pnpm dev` chạy thành công
- [x] Lint/test pass
- [x] MSW intercept API calls
- [x] TypeScript strict mode
- [x] Responsive design
- [x] Dark/light mode

### 🔄 Next Steps
- [ ] Database integration
- [ ] Real authentication
- [ ] Payment processing
- [ ] Video streaming
- [ ] Email notifications
- [ ] Admin dashboard

## 📞 Hỗ trợ

- 📧 Email: support@onlinelearning.com
- 📱 Hotline: 1900-xxx-xxx
- 💬 Discord: [Community Server]
- 📖 Docs: [Documentation Site]

## 📄 License

MIT License - xem [LICENSE](LICENSE) để biết thêm chi tiết.

---

**Được phát triển với ❤️ bởi Online Learning Team**
