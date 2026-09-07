for file in media/*.m4a; do
  echo "Processing $file"
  base=$(basename "$file" .m4a)
  mlx_whisper "$file" --model mlx-community/whisper-large-v3-mlx --language ru > "media/${base}.txt"
done
