// Local storage implementation replacing Supabase
export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  text: string;
  image: string;
  order: number;
  created_at: string;
  updated_at: string;
}

const TESTIMONIALS_KEY = 'ddc_testimonials';

// Default testimonials data
const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    designation: 'Head Librarian, University of California',
    text: 'The DDC Number Generator has revolutionized our cataloging process. What used to take hours now takes minutes, and the accuracy is remarkable. This tool has become indispensable for our library operations.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Michael Chen',
    designation: 'Information Systems Librarian, Stanford University',
    text: 'As someone who processes hundreds of new acquisitions monthly, this AI-powered classification tool has been a game-changer. The confidence scores help me quickly identify which classifications need review.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Prof. Emily Rodriguez',
    designation: 'Library Science Department, Columbia University',
    text: 'I use this tool both for research and teaching. My students love how intuitive it is, and it helps them understand DDC principles better. The accuracy consistently exceeds 95%.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const stored = localStorage.getItem(TESTIMONIALS_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      // Initialize with default testimonials
      localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(defaultTestimonials));
      return defaultTestimonials;
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return defaultTestimonials;
  }
}

export async function saveTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at' | 'order'>): Promise<Testimonial> {
  try {
    const testimonials = await getTestimonials();
    const nextOrder = Math.max(...testimonials.map(t => t.order), -1) + 1;
    
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: crypto.randomUUID(),
      order: nextOrder,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    testimonials.push(newTestimonial);
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(testimonials));
    
    return newTestimonial;
  } catch (error) {
    console.error('Error saving testimonial:', error);
    throw error;
  }
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial> {
  try {
    const testimonials = await getTestimonials();
    const index = testimonials.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error(`Testimonial with ID ${id} not found`);
    }
    
    const updated = {
      ...testimonials[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    testimonials[index] = updated;
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(testimonials));
    
    return updated;
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    const testimonials = await getTestimonials();
    const filtered = testimonials.filter(t => t.id !== id);
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
}

export async function reorderTestimonials(orderedIds: string[]): Promise<void> {
  try {
    const testimonials = await getTestimonials();
    const reordered = orderedIds.map((id, index) => {
      const testimonial = testimonials.find(t => t.id === id);
      if (testimonial) {
        return { ...testimonial, order: index };
      }
      return null;
    }).filter(Boolean) as Testimonial[];
    
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(reordered));
  } catch (error) {
    console.error('Error reordering testimonials:', error);
    throw error;
  }
}