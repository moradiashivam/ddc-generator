# DDC Number Generator

An AI-powered Dewey Decimal Classification (DDC) number generator built with React, Vite, TypeScript, and Supabase. This application helps librarians and information professionals automatically classify library materials using artificial intelligence.

![DDC Generator Screenshot](https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=600&fit=crop)

## 🚀 Features

- 🤖 AI-powered DDC classification using DeepSeek API
- 🔐 User authentication with Clerk
- 📊 Classification history tracking with Supabase
- 🎯 High accuracy classifications with confidence scores
- 📱 Responsive design with Tailwind CSS
- 🌓 Dark/Light mode support
- 🔍 Bulk classification support
- 🎤 Voice input support
- 📈 Admin dashboard with analytics
- 💬 Testimonials system
- 📧 Newsletter subscription
- 📊 CSV/Excel export capabilities

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context
- **Icons**: Lucide React
- **Charts**: Chart.js with react-chartjs-2
- **Tables**: TanStack Table
- **File Handling**: XLSX, PapaParse
- **Drag & Drop**: react-dropzone, @dnd-kit
- **Toast Notifications**: react-hot-toast
- **Animations**: tsparticles

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ddc-generator.git
   cd ddc-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📁 Project Structure

```
ddc-generator/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/       # React context providers
│   ├── lib/           # Utility functions and API clients
│   ├── pages/         # Page components and routes
│   └── types/         # TypeScript type definitions
├── supabase/
│   └── migrations/    # Database migration files
├── public/           # Static assets
└── package.json      # Project dependencies
```

## 🔐 Authentication

The application uses Clerk for authentication with the following features:
- Email/password authentication
- User profile management
- Admin role management
- Session handling

## 💾 Database Schema

### Classifications Table
```sql
CREATE TABLE classifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  input_text text NOT NULL,
  ddc_number text NOT NULL,
  category text NOT NULL,
  confidence_score float DEFAULT 1.0,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);
```

### Testimonials Table
```sql
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  text text NOT NULL,
  image text NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Subscribers Table
```sql
CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## 👥 User Roles

- **Public Users**: Can view the application and submit testimonials
- **Authenticated Users**: Can generate DDC classifications and maintain history
- **Admin**: Full access to dashboard, user management, and content management

## 🔒 Security Features

- Row Level Security (RLS) in Supabase
- JWT-based authentication
- Environment variable protection
- CORS configuration
- Content Security Policy headers

## 📊 Admin Dashboard

The admin dashboard provides:
- User management
- Classification analytics
- Testimonial management
- Newsletter subscriber management
- Export capabilities

## 🚀 Deployment

The application is configured for deployment on Netlify:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = true

[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"
```

## 📝 API Documentation

The application provides a RESTful API for DDC classification:

```typescript
// Example API call
const response = await fetch(`${SUPABASE_URL}/rest/v1/classifications`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
  },
  body: JSON.stringify({
    input_text: 'Text to classify',
    user_id: 'authenticated_user_id'
  })
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shivam Moradia**  
College Librarian  
St. Xavier's College (Autonomous) Ahmedabad

## 🙏 Acknowledgments

- Project Mentor: Dr. Meghna Vyas
- Built with [React](https://reactjs.org/)
- Authentication by [Clerk](https://clerk.dev/)
- Database by [Supabase](https://supabase.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team at moradiashivam@gmail.com.