import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  MessageSquareQuote, 
  Upload, 
  Trash2, 
  Edit2,
  GripVertical,
  Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getTestimonials, 
  saveTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  reorderTestimonials,
  type Testimonial 
} from '../../lib/testimonials';

function SortableTestimonial({ testimonial, onEdit, onDelete }: { 
  testimonial: Testimonial;
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
    >
      <div className="flex items-start space-x-4">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {testimonial.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {testimonial.designation}
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {testimonial.text}
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(testimonial)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(testimonial.id)}
            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    text: '',
    image: ''
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

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
    
    try {
      if (editingTestimonial) {
        const updated = await updateTestimonial(editingTestimonial.id, formData);
        setTestimonials(prev => 
          prev.map(t => t.id === updated.id ? updated : t)
        );
        toast.success('Testimonial updated successfully');
      } else {
        const newTestimonial = await saveTestimonial(formData);
        setTestimonials(prev => [...prev, newTestimonial]);
        toast.success('Testimonial added successfully');
      }
      
      setIsEditing(false);
      setEditingTestimonial(null);
      setFormData({ name: '', designation: '', text: '', image: '' });
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      designation: testimonial.designation,
      text: testimonial.text,
      image: testimonial.image
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial(id);
        setTestimonials(prev => prev.filter(t => t.id !== id));
        toast.success('Testimonial deleted successfully');
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('Failed to delete testimonial');
      }
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setTestimonials((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        const reordered = arrayMove(items, oldIndex, newIndex);
        reorderTestimonials(reordered.map(item => item.id))
          .catch(error => {
            console.error('Error reordering testimonials:', error);
            toast.error('Failed to reorder testimonials');
          });
        return reordered;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Testimonials
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Testimonial
          </button>
        )}
      </div>

      {isEditing && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editingTestimonial ? 'Edit' : 'Add'} Testimonial
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Photo
              </label>
              <div 
                {...getRootProps()} 
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
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
                      Click or drag image here (400x400 recommended)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Testimonial
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                maxLength={1200}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formData.text.length}/1200 characters
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingTestimonial(null);
                  setFormData({ name: '', designation: '', text: '', image: '' });
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingTestimonial ? 'Update' : 'Add'} Testimonial
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={testimonials.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {testimonials.map((testimonial) => (
              <SortableTestimonial
                key={testimonial.id}
                testimonial={testimonial}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <MessageSquareQuote className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              No testimonials yet. Add your first one!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}