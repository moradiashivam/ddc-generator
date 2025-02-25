# DDC Number Generator

An AI-powered Dewey Decimal Classification (DDC) number generator built with React, Vite, and Clerk authentication.

![DDC Generator Screenshot](https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=600&fit=crop)

## Features

- 🤖 AI-powered DDC classification
- 🔐 Secure authentication with Clerk
- 🌓 Dark/Light mode support
- 📊 Classification history tracking
- 🎯 High accuracy classifications
- 📱 Responsive design
- 🔍 Bulk classification support
- 🎤 Voice input support

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/moradiashivam/ddc-generator-2.git
   cd ddc-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Set up Clerk Authentication:
   - Go to [Clerk Dashboard](https://dashboard.clerk.dev)
   - Create a new application
   - Copy your Publishable Key
   - Update the `.env` file with your key:
     ```
     VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
     ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Ubuntu Server Deployment

### Server Prerequisites

1. Update system packages:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. Install Node.js and npm:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. Install nginx:
   ```bash
   sudo apt install nginx -y
   ```

4. Configure firewall:
   ```bash
   sudo ufw allow 'Nginx Full'
   sudo ufw allow OpenSSH
   sudo ufw enable
   ```

### Application Deployment

1. Create application directory:
   ```bash
   sudo mkdir -p /var/www/ddc-generator
   sudo chown -R $USER:$USER /var/www/ddc-generator
   ```

2. Clone the repository:
   ```bash
   cd /var/www/ddc-generator
   git clone https://github.com/yourusername/ddc-generator.git .
   ```

3. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Update with your Clerk credentials:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
   ```

5. Configure Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/ddc-generator
   ```
   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/ddc-generator/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN";
       add_header X-XSS-Protection "1; mode=block";
       add_header X-Content-Type-Options "nosniff";
   }
   ```

6. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/ddc-generator /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. Set up SSL with Certbot:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d your-domain.com
   ```

### Clerk Authentication Setup

1. Configure Clerk Application:
   - Go to [Clerk Dashboard](https://dashboard.clerk.dev)
   - Create a new application
   - In "JWT Templates", add your domain
   - Configure OAuth providers (Google, GitHub, etc.)
   - Set allowed origins to include your domain
   - Update environment variables with new credentials

2. Update Production Environment:
   ```bash
   nano /var/www/ddc-generator/.env
   ```
   Add your production Clerk keys:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_production_key
   ```

3. Rebuild the application:
   ```bash
   npm run build
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_CLERK_PUBLISHABLE_KEY | Clerk public key for authentication | Yes |

## Security Considerations

1. Always use environment variables for sensitive data
2. Keep your Clerk keys secure and never commit them to version control
3. Regularly update dependencies for security patches
4. Use HTTPS in production
5. Implement rate limiting on your server
6. Regular security audits and updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Authentication by [Clerk](https://clerk.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
