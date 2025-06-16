import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { MessageSquareQuote, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

export function TestimonialSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    text: '',
    image: ''
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Calculate dimensions for 400x400
            let width = img.width;
            let height = img.height;
            const aspectRatio = width / height;
            
            if (aspectRatio > 1) {
              width = 400;
              height = width / aspectRatio;
            } else {
              height = 400;
              width = height * aspectRatio;
            }
            
            canvas.width = 400;
            canvas.height = 400;
            
            // Draw image centered
            ctx?.drawImage(
              img,
              (400 - width) / 2,
              (400 - height) / 2,
              width,
              height
            );
            
            const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
            setFormData(prev => ({ ...prev, image: resizedImage }));
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.designation || !formData.text || !formData.image) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([formData]);

      if (error) throw error;

      toast.success('Thank you for your testimonial!');
      setFormData({
        name: '',
        designation: '',
        text: '',
        image: ''
      });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast.error('Failed to submit testimonial. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-500/20 dark:bg-purple-500/30 rounded-lg">
          <MessageSquareQuote className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Share Your Experience
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Photo
          </label>
          <div 
            {...getRootProps()} 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
          >
            <input {...getInputProps()} />
            {formData.image ? (
              <img
                src={formData.image}
                alt="Preview"
                className="w-32 h-32 rounded-full mx-auto object-cover"
              />
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click or drag your photo here
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Role/Designation
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Experience
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
            maxLength={1200}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formData.text.length}/1200 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            'Submit Testimonial'
          )}
        </button>
      </form>
    </div>
  );
}