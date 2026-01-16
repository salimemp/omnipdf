# OmniPDF - Ultra-Modern Cross-Platform PDF Converter

<div align="center">

![OmniPDF Logo](apps/web/public/favicon.ico)

**The most powerful all-in-one PDF converter with AI-powered features**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue)](https://tauri.app)
[![React Native](https://img.shields.io/badge/React_Native-0.73-61dafb)](https://reactnative.dev)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Convert, merge, split, compress, and edit PDFs with AI-powered features**

</div>

---

## 🌟 Features

### Core PDF Tools
| Tool | Description | Status |
|------|-------------|--------|
| **Merge PDF** | Combine multiple PDFs into one document | ✅ |
| **Split PDF** | Extract pages or split into separate files | ✅ |
| **Compress PDF** | Reduce file size while maintaining quality | ✅ |
| **Convert PDF** | Convert to and from 25+ formats | ✅ |
| **Edit PDF** | Add text, images, and annotations | 🚧 |
| **OCR** | Extract text from scanned documents | 🚧 |
| **Protect PDF** | Add password encryption | ✅ |
| **Unlock PDF** | Remove password protection | ✅ |
| **Rotate PDF** | Rotate pages by 90° increments | ✅ |
| **Rearrange PDF** | Reorder pages with drag & drop | 🚧 |

### Supported Formats
```
Input:  PDF, DOCX, DOC, XLSX, XLS, PPTX, PPT, TXT, HTML, JPG, JPEG, PNG, 
        GIF, BMP, TIFF, WEBP, SVG, EPUB, MOBI, AZW3, CSV, JSON, XML, 
        MARKDOWN, RTF, ODT, ODS, ODP

Output: PDF, DOCX, DOC, XLSX, XLS, PPTX, PPT, TXT, HTML, JPG, PNG, 
        GIF, BMP, TIFF, WEBP, EPUB, MOBI, AZW3, CSV, JSON, XML, 
        MARKDOWN, RTF, ODT, ODS, ODP
```

### AI-Powered Features (Gemini API)
- **AI Summarization** - Generate executive summaries of documents
- **AI Chat** - Ask questions about document content
- **AI Translation** - Convert documents to 50+ languages
- **Read Aloud** - Text-to-speech with natural voices
- **Smart Categorization** - Auto-tag and organize documents

### Cloud Integration
| Provider | Status | Features |
|----------|--------|----------|
| **Google Drive** | ✅ | Import/Export files |
| **Dropbox** | ✅ | Import/Export files |
| **OneDrive** | ✅ | Import/Export files |
| **Box** | 🚧 | Import/Export files (Enterprise) |

### Security & Compliance
- ✅ AES-256 file encryption
- ✅ Automatic file deletion (configurable)
- ✅ Zero-knowledge architecture option
- ✅ SOC2 Type II compliant infrastructure
- ✅ HIPAA compliant (Enterprise)
- ✅ CCPA compliant
- ✅ PIPEDA compliant
- ✅ FedRAMP ready (Enterprise)

### Platform Support
| Platform | Status | Technology |
|----------|--------|------------|
| **Web** | ✅ | Next.js 14, React 18, Tailwind CSS |
| **Windows** | ✅ | Tauri 2.0, React |
| **macOS** | ✅ | Tauri 2.0, React |
| **Linux** | ✅ | Tauri 2.0, React |
| **iOS** | ✅ | React Native, Expo |
| **Android** | ✅ | React Native, Expo |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Cloudflare Edge                      │
├─────────────────────────────────────────────────────────┤
│  Workers (Serverless API)                               │
│  ├── PDF conversion service                             │
│  ├── AI processing (Gemini API)                         │
│  ├── Authentication endpoints                           │
│  ├── Rate limiting & caching                            │
│  └── Email service (Resend)                             │
├─────────────────────────────────────────────────────────┤
│  R2 Object Storage                                      │
│  ├── User file storage (no egress fees!)               │
│  ├── Processed files cache                              │
│  └── CDN-distributed globally                           │
├─────────────────────────────────────────────────────────┤
│  D1 Database (SQLite at edge)                           │
│  ├── User accounts, preferences                         │
│  ├── Document metadata                                  │
│  ├── Usage analytics                                    │
│  └── Subscription data                                  │
├─────────────────────────────────────────────────────────┤
│  Pages (Web App Hosting)                                │
│  ├── Next.js 14 React application                       │
│  ├── SSR/SSG rendering                                  │
│  └── Edge-compatible                                    │
├─────────────────────────────────────────────────────────┤
│  Turnstile (Bot Protection)                             │
│  └── Anti-abuse, fraud prevention                       │
├─────────────────────────────────────────────────────────┤
│  Access (Zero Trust Security)                           │
│  └── Application-level access control                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend (Web)** | Next.js 14, React 18, Tailwind CSS | Modern web application |
| **Frontend (Desktop)** | Tauri 2.0, React | Native desktop apps |
| **Frontend (Mobile)** | React Native, Expo | iOS & Android apps |
| **Backend** | Cloudflare Workers, Hono | Serverless API |
| **Database** | Supabase (PostgreSQL), D1 | User & document data |
| **Auth** | Supabase Auth | Google, GitHub OAuth |
| **Storage** | Cloudflare R2 | File storage |
| **AI** | Google Gemini API | AI features |
| **Email** | Resend | Transactional emails |
| **Payments** | Stripe | Subscription billing |
| **Infrastructure** | Cloudflare | Global CDN & edge |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Cloudflare account
- Supabase account
- Stripe account (for payments)
- Resend account (for emails)
- Google Cloud account (for Gemini API)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/omnipdf.git
cd omnipdf
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. **Set up the database**
```bash
cd packages/api
npm run db:generate
npm run db:push
```

5. **Start development servers**
```bash
# Start all apps in parallel
npm run dev
```

6. **Access the application**
- Web: http://localhost:3000
- Desktop: Use Tauri dev command
- Mobile: Use Expo dev command

---

## 🔧 Configuration

### Environment Variables

```bash
# Supabase (Authentication & Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token
CLOUDFLARE_R2_ACCESS_KEY_ID=your-r2-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-r2-secret-key
CLOUDFLARE_R2_BUCKET_NAME=omnipdf-documents

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Stripe Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# AI (Google Gemini)
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Email (Resend)
RESEND_API_KEY=re_your-resend-key

# Cloud Storage OAuth
GOOGLE_DRIVE_CLIENT_ID=your-drive-client-id
DROPBOX_CLIENT_ID=your-dropbox-app-key
ONEDRIVE_CLIENT_ID=your-onedrive-client-id
BOX_CLIENT_ID=your-box-client-id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=OmniPDF

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/omnipdf
```

---

## 💰 Pricing

| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| **Monthly conversions** | 25 | Unlimited | Unlimited |
| **File size limit** | 25MB | 500MB | 2GB |
| **Cloud storage** | 1GB | 50GB | 1TB |
| **AI credits** | 5 | 100/month | Unlimited |
| **Cloud services** | 1 | 4 | 4 |
| **Team features** | ❌ | ❌ | ✅ |
| **SSO/SAML** | ❌ | ❌ | ✅ |
| **API access** | ❌ | ❌ | ✅ |
| **Monthly price** | $0 | $7.99 | $24.99 |
| **Annual price** | $0 | $79.99 | $249.99 |

### Local Currency Support
We support 35+ currencies with automatic tax calculation:
- VAT (EU, UK)
- GST (Australia, Singapore, India)
- Sales Tax (US states)
- And more...

---

## 🌍 Internationalization

### Supported Languages (35+)
| Language | Native Name | Status |
|----------|-------------|--------|
| English | English | ✅ Complete |
| Spanish | Español | ✅ Complete |
| French | Français | ✅ Complete |
| German | Deutsch | ✅ Complete |
| Chinese | 中文 | ✅ Complete |
| Japanese | 日本語 | ✅ Complete |
| Portuguese | Português | ✅ Complete |
| Russian | Русский | ✅ Complete |
| Arabic | العربية | ✅ Complete |
| Korean | 한국어 | ✅ Complete |
| Hindi | हिन्दी | ✅ Complete |
| Italian | Italiano | ✅ Partial |
| Dutch | Nederlands | ✅ Partial |
| Polish | Polski | ✅ Partial |
| Turkish | Türkçe | ✅ Partial |
| And 20+ more... | | 🚧 Partial |

### Accessibility
- ✅ WCAG 2.1 AA compliant
- ✅ Screen reader optimized
- ✅ Full keyboard navigation
- ✅ High contrast mode
- ✅ Reduced motion support
- ✅ Adjustable font sizes

---

## 📁 Project Structure

```
omnipdf/
├── apps/
│   ├── web/              # Next.js 14 web application
│   │   ├── src/
│   │   │   ├── app/              # App router pages
│   │   │   │   ├── api/          # API routes
│   │   │   │   ├── auth/         # Auth pages
│   │   │   │   ├── convert/      # Convert page
│   │   │   │   ├── dashboard/    # Dashboard
│   │   │   │   └── pricing/      # Pricing page
│   │   │   ├── components/       # React components
│   │   │   │   ├── accessibility/ # A11y components
│   │   │   │   ├── convert/      # Conversion UI
│   │   │   │   ├── layout/       # Layout components
│   │   │   │   └── localization/ # i18n components
│   │   │   ├── lib/              # Utilities
│   │   │   └── store/            # Zustand store
│   │   └── public/               # Static assets
│   ├── desktop/          # Tauri desktop application
│   │   ├── src-tauri/    # Tauri config & Rust
│   │   └── package.json
│   └── mobile/           # React Native app
│       └── package.json
├── packages/
│   ├── api/              # Serverless API
│   │   ├── prisma/       # Database schema
│   │   └── src/
│   ├── shared/           # Shared types & utilities
│   └── ui/               # Reusable UI components
├── worker.ts             # Cloudflare Worker entry
├── wrangler.toml         # Cloudflare config
├── turbo.json            # Turborepo config
└── README.md
```

---

## 🔒 Security

### Authentication
- Email/password with mandatory verification
- Google OAuth
- GitHub OAuth
- Two-factor authentication (2FA)
- Session management with automatic expiry

### Data Protection
- AES-256 encryption at rest
- TLS 1.3 for data in transit
- Zero-knowledge architecture option
- Automatic file deletion (24hr default)
- GDPR-compliant data handling

### Compliance
- SOC2 Type II certified infrastructure
- HIPAA compliant (Enterprise)
- CCPA compliant
- PIPEDA compliant
- FedRAMP ready (Enterprise)

---

## 📱 Screenshots

### Web Application
![Web Dashboard](docs/images/web-dashboard.png)
![Convert Page](docs/images/convert-page.png)
![Pricing Page](docs/images/pricing-page.png)

### Desktop Application
![Desktop App](docs/images/desktop-app.png)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Cloudflare](https://cloudflare.com) for edge computing infrastructure
- [Supabase](https://supabase.com) for authentication and database
- [Google](https://google.com) for Gemini AI
- [Tauri](https://tauri.app) for desktop framework
- [React Native](https://reactnative.dev) for mobile framework
- [Resend](https://resend.com) for email delivery

---

## 📞 Support

- **Documentation**: [docs.omnipdf.com](https://docs.omnipdf.com)
- **Help Center**: [help.omnipdf.com](https://help.omnipdf.com)
- **Email**: support@omnipdf.com
- **Twitter**: [@OmniPDF](https://twitter.com/omnipdf)

---

<div align="center">

**Built with ❤️ by a solo developer**

[Website](https://omnipdf.com) • [Twitter](https://twitter.com/omnipdf) • [GitHub](https://github.com/omnipdf)

</div>
