export interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  subscribedAt: number;
}

const SUBSCRIBERS_KEY = 'newsletter_subscribers';

export function getSubscribers(): Subscriber[] {
  try {
    const data = localStorage.getItem(SUBSCRIBERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting subscribers:', error);
    return [];
  }
}

export function addSubscriber(email: string): Subscriber {
  const subscribers = getSubscribers();
  
  // Check if email already exists
  if (subscribers.some(s => s.email === email)) {
    throw new Error('Email already subscribed');
  }

  const newSubscriber: Subscriber = {
    id: crypto.randomUUID(),
    email,
    subscribed: true,
    subscribedAt: Date.now()
  };

  subscribers.push(newSubscriber);
  localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subscribers));
  return newSubscriber;
}

export function updateSubscriber(id: string, updates: Partial<Subscriber>): Subscriber {
  const subscribers = getSubscribers();
  const index = subscribers.findIndex(s => s.id === id);
  
  if (index === -1) {
    throw new Error('Subscriber not found');
  }

  const updated = {
    ...subscribers[index],
    ...updates
  };

  subscribers[index] = updated;
  localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subscribers));
  return updated;
}

export function deleteSubscriber(id: string): void {
  const subscribers = getSubscribers();
  const filtered = subscribers.filter(s => s.id !== id);
  localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(filtered));
}

export function getSubscriberStats() {
  const subscribers = getSubscribers();
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;
  const oneMonth = 30 * oneDay;

  return {
    total: subscribers.length,
    active: subscribers.filter(s => s.subscribed).length,
    daily: subscribers.filter(s => now - s.subscribedAt < oneDay).length,
    weekly: subscribers.filter(s => now - s.subscribedAt < oneWeek).length,
    monthly: subscribers.filter(s => now - s.subscribedAt < oneMonth).length
  };
}

export function exportSubscribers(): Blob {
  const subscribers = getSubscribers();
  const csv = [
    ['Email', 'Status', 'Subscribed Date'],
    ...subscribers.map(s => [
      s.email,
      s.subscribed ? 'Active' : 'Inactive',
      new Date(s.subscribedAt).toLocaleString()
    ])
  ].map(row => row.join(',')).join('\n');

  return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
}