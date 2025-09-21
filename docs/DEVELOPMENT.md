# 🛠️ Development Guide

## Môi trường phát triển

### Yêu cầu
- Node.js 18+
- pnpm (khuyến nghị)
- Git
- VS Code (khuyến nghị)

### VS Code Extensions
Cài đặt các extension được khuyến nghị:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Path Intellisense
- Playwright Test for VS Code

## Quy trình phát triển

### 1. Setup môi trường
\`\`\`bash
# Clone và cài đặt
git clone <repo>
cd online-learning-system
pnpm install

# Thiết lập Git hooks
pnpm prepare

# Chạy development server
pnpm dev
\`\`\`

### 2. Code Style
- Sử dụng TypeScript strict mode
- Follow ESLint rules
- Prettier auto-format
- Conventional commits

### 3. Testing Strategy
\`\`\`bash
# Unit tests
pnpm test:unit

# E2E tests
pnpm test

# Watch mode
pnpm test:unit:watch
\`\`\`

## Architecture

### Folder Structure
\`\`\`
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── stores/        # Zustand state stores
├── types/         # TypeScript definitions
└── mocks/         # MSW API mocks
\`\`\`

### State Management
- **Zustand**: Client state (auth, UI state)
- **TanStack Query**: Server state (API data)
- **React Hook Form**: Form state

### API Layer
- MSW for development mocking
- TanStack Query for data fetching
- Type-safe API calls

## Component Development

### UI Components
\`\`\`tsx
// Use shadcn/ui as base
import { Button } from '@/components/ui/button'

// Custom components in src/components/
export function CourseCard({ course }: { course: Course }) {
  return (
    <Card>
      {/* Component content */}
    </Card>
  )
}
\`\`\`

### Styling Guidelines
- Tailwind CSS utility classes
- Mobile-first responsive design
- Dark mode support
- Consistent spacing scale

### Form Handling
\`\`\`tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })
  
  // Form implementation
}
\`\`\`

## Testing Guidelines

### Unit Tests
\`\`\`tsx
// Component testing
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

test('renders button', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
\`\`\`

### E2E Tests
\`\`\`typescript
// Playwright tests
import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading')).toBeVisible()
})
\`\`\`

## Performance

### Optimization Checklist
- [ ] Image optimization with Next.js Image
- [ ] Code splitting with dynamic imports
- [ ] Bundle analysis
- [ ] Core Web Vitals monitoring

### Bundle Analysis
\`\`\`bash
# Analyze bundle size
pnpm build
pnpm analyze
\`\`\`

## Deployment

### Environment Variables
\`\`\`env
# Production
NEXT_PUBLIC_API_BASE_URL=https://api.production.com
NEXT_PUBLIC_APP_NAME="Online Learning System"

# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://yourdomain.com
\`\`\`

### Build Process
\`\`\`bash
# Production build
pnpm build

# Test production build locally
pnpm start
\`\`\`

## Troubleshooting

### Common Issues

#### MSW not working
\`\`\`bash
# Clear browser cache
# Check browser console for service worker errors
# Restart development server
\`\`\`

#### TypeScript errors
\`\`\`bash
# Check tsconfig.json paths
# Restart TypeScript server in VS Code
pnpm type-check
\`\`\`

#### Build failures
\`\`\`bash
# Clear Next.js cache
rm -rf .next
pnpm build
\`\`\`

## Best Practices

### Code Organization
- One component per file
- Co-locate related files
- Use barrel exports
- Consistent naming conventions

### Performance
- Lazy load components
- Optimize images
- Use React.memo for expensive components
- Implement proper loading states

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

### Security
- Validate all inputs
- Sanitize user content
- Use HTTPS in production
- Implement proper authentication
