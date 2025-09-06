# DDC Number Generator

An AI-powered Dewey Decimal Classification (DDC) number generator built with React, Vite, TypeScript, and Supabase. This application helps librarians and information professionals automatically classify library materials using artificial intelligence.

![DDC Generator Screenshot](https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=600&fit=crop)

## 🚀 Features

- 🤖 AI-powered DDC classification using DeepSeek or OpenRouter API
- 🔐 Simple local user authentication
- 📊 Classification history tracking with local storage
- 🎯 High accuracy classifications with confidence scores
- 📱 Responsive design with Tailwind CSS
- 🌓 Dark/Light mode support
- 🔍 Bulk classification support
- 🎤 Voice input support
- 📈 Local admin dashboard with analytics
- 💬 Testimonials system
- 📧 Newsletter subscription
- 📊 CSV/Excel export capabilities

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Authentication**: Local storage based
- **Database**: Local storage
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
   # No environment variables needed for local storage version
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
├── public/           # Static assets
└── package.json      # Project dependencies
```

## 🔐 Authentication

The application uses local storage for simple authentication with the following features:
- Demo email/password authentication
- Local user profile storage
- Session management
- Demo credentials: demo@example.com / demo123

## 💾 Data Storage

All data is stored locally in the browser using localStorage:
- **Classifications**: User classification history
- **Testimonials**: User testimonials and reviews
- **Newsletter**: Email subscriptions
- **User Data**: Authentication and profile information

## 👥 User Roles

- **Public Users**: Can view the application, submit testimonials, and try demo features
- **Authenticated Users**: Can generate DDC classifications and maintain history
- **Admin**: Access to local admin dashboard and content management

## 🔒 Security Features

- Local data storage (no external database)
- Simple authentication system
- CORS configuration
- Content Security Policy headers

## 📊 Admin Dashboard

The admin dashboard provides:
- Local user management
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

The application provides DDC classification using AI APIs:

```typescript
// Example classification
import { classifyText } from './lib/deepseek';

const result = await classifyText('Introduction to Computer Programming');
console.log(JSON.parse(result)); // { number: "005.1", category: "Programming", description: "..." }
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
- AI APIs by [DeepSeek](https://deepseek.com/) and [OpenRouter](https://openrouter.ai/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team at moradiashivam@gmail.com.