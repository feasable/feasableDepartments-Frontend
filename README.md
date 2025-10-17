# lunoSpaces Frontend

Modern Next.js dashboard for AI-powered business automation. Features voice interaction, real-time updates, and a monochrome sketch aesthetic.

## 🎨 Features

- **Voice-First Interface**: Talk to AI assistants naturally via Vapi
- **Real-time Dashboard**: Live task updates and notifications
- **Department Management**: Specialized AI for each business function
- **Monochrome Design**: Clean, sketch-style aesthetic
- **Multi-tenant Ready**: Workspace isolation with Supabase RLS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Vapi API key

### Installation
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://zoqqrvmfumzfnhdrgjyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Vapi
NEXT_PUBLIC_VAPI_PUBLIC_KEY=d243af04-b6d6-4b6f-b15a-6394dfec1abd
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── Spaces/       # Department views
│   └── tasks/            # Task management
├── components/            # Reusable components
│   ├── VoicePanel.tsx    # Vapi voice interface
│   ├── DepartmentCard.tsx # Department tiles
│   └── TaskCard.tsx      # Task display
├── lib/                  # Utilities
│   └── supabase/        # Supabase client
└── styles/              # Global styles
```

## 🎙️ Voice Assistants

### Available Assistants
- **Sophia** - Project Manager
- **Max** - Data Analyst
- **Isabel** - Marketing Specialist

### Voice Commands
```
"Create a marketing campaign for Q1"
"Show me my pending tasks"
"What's the status of the data report?"
"Schedule a follow-up for tomorrow"
```

## 🔧 Development

### Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### Build for production
```bash
npm run build
npm start
```

### Type checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_API_BASE_URL
vercel env add NEXT_PUBLIC_VAPI_PUBLIC_KEY

# Deploy to production
vercel --prod
```

### Docker
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
```

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Background**: White (#FFFFFF)
- **Muted**: Gray (#6B7280)
- **Accent**: Hover states with subtle borders

### Typography
- **Headings**: Space Mono (monospace)
- **Body**: Inter (sans-serif)

### Components
- Sketch-style borders with corner decorations
- Subtle hover animations
- Grid paper background pattern
- Department cards with status badges

## 🔐 Security

- JWT validation via Supabase Auth
- Row Level Security (RLS) for multi-tenancy
- Environment variables for sensitive data
- HTTPS only in production
- CSP headers configured

## 📊 Analytics

Integration ready for:
- PostHog (product analytics)
- Sentry (error tracking)
- Google Analytics
- Custom event tracking

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vapi Documentation](https://docs.vapi.ai)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Proprietary - lunoLabs © 2024

## 🆘 Support

- Email: support@luno.org
- Documentation: [docs.luno.org](https://docs.luno.org)
- Discord: [Join our community](https://discord.gg/luno)
