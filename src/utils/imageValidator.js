// Image upload security and validation

export const imageValidator = {
  // Allowed image types
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  
  // Max file size (5MB)
  maxSize: 5 * 1024 * 1024,

  // Validate image file
  async validateImage(file) {
    return new Promise((resolve, reject) => {
      // Check if file exists
      if (!file) {
        reject('No file provided.');
        return;
      }

      // Check file type
      if (!this.allowedTypes.includes(file.type)) {
        reject('Invalid file type. Please use JPG, PNG, or WebP.');
        return;
      }

      // Check file size
      if (file.size > this.maxSize) {
        reject('File too large. Maximum size is 5MB.');
        return;
      }

      // Verify it's actually an image by loading it
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.onload = () => {
          // Additional check: ensure image has valid dimensions
          if (img.width === 0 || img.height === 0) {
            reject('Invalid image dimensions.');
            return;
          }
          resolve(true);
        };
        img.onerror = () => reject('Invalid image file. File may be corrupted.');
        img.src = e.target.result;
      };

      reader.onerror = () => reject('Failed to read file.');
      reader.readAsDataURL(file);
    });
  },

  // Compress image before upload
  async compressImage(base64String, maxWidth = 1200, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw image on canvas
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed);
        } catch (error) {
          reject('Failed to compress image: ' + error.message);
        }
      };

      img.onerror = () => reject('Failed to load image for compression.');
      img.src = base64String;
    });
  },

  // Validate base64 image string
  validateBase64Image(base64String) {
    if (!base64String || typeof base64String !== 'string') {
      return false;
    }

    // Check if it's a valid base64 image format
    const imageRegex = /^data:image\/(jpeg|jpg|png|webp);base64,/;
    if (!imageRegex.test(base64String)) {
      return false;
    }

    // Check size (5MB limit)
    const sizeInBytes = (base64String.length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    return sizeInMB <= 5;
  },

  // Get image dimensions from base64
  async getImageDimensions(base64String) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject('Failed to load image.');
      img.src = base64String;
    });
  }
};
