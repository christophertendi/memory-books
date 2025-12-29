export const validation = {
  // Sanitize text input (remove potentially dangerous content)
  sanitizeText(text) {
    if (typeof text !== 'string') return '';
    
    // Remove HTML tags
    const temp = document.createElement('div');
    temp.textContent = text;
    return temp.innerHTML
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim()
      .slice(0, 1000); // Limit length
  },

  // Validate image size
  validateImageSize(base64String, maxSizeMB = 5) {
    const sizeInBytes = (base64String.length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB <= maxSizeMB;
  },

  // Validate book name
  validateBookName(name) {
    if (!name || typeof name !== 'string') return false;
    if (name.length < 1 || name.length > 100) return false;
    return true;
  },

  // Validate caption
  validateCaption(caption) {
    if (typeof caption !== 'string') return false;
    return caption.length <= 500;
  },

  // Validate category
  validateCategory(category) {
    if (typeof category !== 'string') return false;
    return category.length <= 50;
  }
};