import React from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { LogIn } from 'lucide-react';

export function AuthButton() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white transition-all duration-200 hover:scale-105">
            <LogIn className="w-5 h-5" />
            <span>Sign In</span>
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton 
          appearance={{
            elements: {
              rootBox: "relative",
              userButtonAvatarBox: "w-9 h-9",
              userButtonTrigger: "bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-1 transition-all duration-200 hover:scale-105"
            }
          }}
        />
      </SignedIn>
    </div>
  );
}