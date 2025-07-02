# Metros Wood Inventory 🌳📦

> **Modern inventory management system for Metros Wood** - Built with Next.js 14, tRPC, Supabase, and PWA capabilities.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)](https://trpc.io/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## ✨ Features

- **📱 Progressive Web App (PWA)** - Installable with offline support
- **🔒 Authentication** - Secure user management with Supabase Auth
- **📊 Real-time Inventory** - Live stock tracking and adjustments
- **🔄 Transaction History** - Complete audit trail for all stock changes
- **🎯 Type-Safe API** - End-to-end type safety with tRPC
- **⚡ Modern UI** - Responsive design with Tailwind CSS and Shadcn/UI
- **🧪 Fully Tested** - Comprehensive test suite with Vitest
- **🚀 Production Ready** - Optimized build with Next.js 14

## 🛠 Tech Stack

### Frontend

- **Next.js 14** - App Router with TypeScript
- **React 19** - Latest React features
- **Tailwind CSS v4** - Utility-first styling
- **Shadcn/UI** - Beautiful, accessible components
- **PWA** - Service worker + offline support

### Backend & Database

- **tRPC** - End-to-end typesafe APIs
- **Supabase** - PostgreSQL database with real-time features
- **Zod** - Schema validation
- **SuperJSON** - JSON serialization

### Development

- **TypeScript** - Strict type checking
- **Vitest** - Unit and integration testing
- **ESLint + Prettier** - Code formatting and linting
- **Husky** - Git hooks for quality control

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/pnpm
- Supabase account

### 1. Clone & Install

```bash
git clone https://github.com/serg1120/metros-wood-inventory.git
cd metros-wood-inventory
npm install
```

### 2. Environment Setup

```bash
cp .env.local.example .env.local
```

Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Create these tables in your Supabase database:

```sql
-- Items table
CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE,
  barcode TEXT,
  category_id INT,
  subcategory TEXT,
  min_stock INT DEFAULT 0,
  current_stock INT DEFAULT 0,
  location TEXT,
  unit_cost DECIMAL(10,2),
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  item_id INT REFERENCES items(id),
  type TEXT CHECK (type IN ('adjustment', 'sale', 'purchase', 'return', 'damage')),
  quantity INT NOT NULL,
  notes TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 API Documentation

### tRPC Procedures

#### `items.list`

Fetch all inventory items with authentication required.

```typescript
const { data: items } = trpc.items.list.useQuery();
```

#### `items.adjustStock`

Adjust item stock levels with transaction logging.

```typescript
const adjustStock = trpc.items.adjustStock.useMutation();

adjustStock.mutate({
  itemId: 123,
  delta: -5, // Positive or negative adjustment
  notes: 'Sold 5 units',
});
```

### Response Types

All responses are fully typed with TypeScript:

```typescript
type Item = {
  id: number;
  name: string;
  sku: string | null;
  current_stock: number;
  min_stock: number;
  // ... other fields
};
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

## 🏗 Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Deployment Options

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Self-hosted**

## 📁 Project Structure

```
metros-wood-inventory/
├── app/                    # Next.js App Router
│   ├── api/trpc/          # tRPC API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── providers/         # Context providers
│   └── items-list.tsx     # Demo component
├── lib/                   # Utilities
│   ├── supabase/          # Supabase configuration
│   └── trpc.ts           # tRPC client setup
├── server/                # tRPC server code
│   ├── router.ts          # API procedures
│   ├── context.ts         # Request context
│   └── trpc.ts           # tRPC setup
├── test/                  # Test configuration
└── public/               # Static assets & PWA files
```

## 🔒 Security

- **Authentication required** for all inventory operations
- **Input validation** with Zod schemas
- **SQL injection protection** via Supabase client
- **Audit trails** for all stock changes
- **Rate limiting** (configure in production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn/UI](https://ui.shadcn.com/) - Beautiful components

---

**Built with ❤️ for Metros Wood**
