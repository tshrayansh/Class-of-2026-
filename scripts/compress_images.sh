#!/bin/bash

# Target directory
TARGET_DIR="public/characters"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Directory $TARGET_DIR not found!"
  exit 1
fi

echo "Starting macOS-native image optimization with sips..."

# Find and optimize all JPG and JPEG files in place
find "$TARGET_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.JPG" -o -name "*.JPEG" \) | while read -r img; do
  # Get original size in bytes
  orig_size=$(stat -f%z "$img")
  
  # Only compress if size is larger than 150KB (153600 bytes)
  if [ "$orig_size" -gt 153600 ]; then
    echo "Optimizing: $img ($(numfmt --to=iec-i --suffix=B "$orig_size"))"
    
    # 1. Resize max dimension to 1200px (preserves aspect ratio)
    sips --resampleHeightWidthMax 1200 "$img" > /dev/null 2>&1
    
    # 2. Compress quality to 75%
    sips -s formatOptions 75 "$img" > /dev/null 2>&1
    
    # Get new size
    new_size=$(stat -f%z "$img")
    pct=$(( 100 * (orig_size - new_size) / orig_size ))
    echo "  -> Completed: $(numfmt --to=iec-i --suffix=B "$new_size") ($pct% space saved)"
  fi
done

echo "Optimization complete!"
