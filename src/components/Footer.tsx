import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full py-12 mt-12 bg-black/30 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center space-y-12">
          {/* Developer Section */}
          <div className="space-y-2">
            <div className="inline-block">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Developed by
              </h2>
              <div className="text-3xl font-semibold text-white">Shivam Moradia</div>
            </div>
            <p className="text-white/80">College Librarian</p>
            <p className="text-white/80">St. Xavier's College (Autonomous) Ahmedabad</p>
            
            <div className="flex items-center justify-center space-x-6 mt-4">
              <a
                href="https://www.linkedin.com/in/shivam-moradia-5a3703103"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:moradiashivam@gmail.com"
                className="text-white/80 hover:text-white transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/moradiashivam/ddc-generator"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center">
            <div className="text-white/60 text-lg">Under the guidance of</div>
          </div>

          {/* Mentor Section */}
          <div className="space-y-2">
            <div className="inline-block">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                Project Mentor
              </h2>
              <div className="text-3xl font-semibold text-white">Dr. Meghna Vyas</div>
            </div>
            <p className="text-white/80">Associate Professor</p>
            <p className="text-white/80">PG Department of Library and Information Science</p>
            <p className="text-white/80">Sardar Patel University, Vallabh Vidyanagar</p>
            
            <div className="flex items-center justify-center space-x-6 mt-4">
              <a
                href="https://www.linkedin.com/in/dr-meghna-vyas-461968a2/?originalSubdomain=in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:meghnavyas08@gmail.com"
                className="text-white/80 hover:text-white transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-white/60 text-sm pt-6 border-t border-white/10">
            © 2024 DDC Generator. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}