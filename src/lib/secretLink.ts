// Generate a random string to use as a secret key
function generateRandomKey(length = 16) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Get the secret key from localStorage or generate a new one
export function getSecretKey(): string {
  const storedKey = localStorage.getItem('ddc_secret_key');
  if (storedKey) {
    return storedKey;
  }
  
  const newKey = generateRandomKey();
  localStorage.setItem('ddc_secret_key', newKey);
  return newKey;
}

// Generate a secret link for CSV export
export function generateSecretLink(): string {
  const key = getSecretKey();
  return `https://ai-dewey.netlify.app/csv-export/${key}`;
}

// Validate if a given key matches the stored secret key
export function validateSecretKey(key: string): boolean {
  const storedKey = getSecretKey();
  return key === storedKey;
}