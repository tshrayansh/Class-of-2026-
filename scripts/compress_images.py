import os
import sys
from PIL import Image

def compress_images(directory):
    print(f"Scanning directory: {directory}")
    for root, dirs, files in os.walk(directory):
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.jpg', '.jpeg', '.png']:
                filepath = os.path.join(root, file)
                original_size = os.path.getsize(filepath)
                
                # Skip compressing if file is already small (e.g., under 150KB)
                if original_size < 150 * 1024:
                    continue
                
                try:
                    with Image.open(filepath) as img:
                        # Convert RGBA to RGB if saving as JPEG
                        if img.mode in ('RGBA', 'LA') and ext in ['.jpg', '.jpeg']:
                            img = img.convert('RGB')
                        
                        # Max dimensions
                        max_size = 1200
                        width, height = img.size
                        
                        if width > max_size or height > max_size:
                            if width > height:
                                new_width = max_size
                                new_height = int(height * (max_size / width))
                            else:
                                new_height = max_size
                                new_width = int(width * (max_size / height))
                            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                            print(f"Resized {file} from {width}x{height} to {new_width}x{new_height}")
                        
                        # Save back compressed
                        img.save(filepath, quality=75, optimize=True)
                        
                        new_size = os.path.getsize(filepath)
                        pct = (1 - (new_size / original_size)) * 100
                        print(f"Compressed {file}: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB ({pct:.1f}% reduction)")
                except Exception as e:
                    print(f"Error compressing {filepath}: {e}")

if __name__ == '__main__':
    target_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public/characters'))
    compress_images(target_dir)
