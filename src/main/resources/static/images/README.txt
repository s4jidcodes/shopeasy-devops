Place local product images here if you want to self-host (recommended for offline/Jenkins demos):

  laptop.jpg         (1:1, studio, neutral background)
  smartphone.jpg
  headphones.jpg
  smartwatch.jpg
  keyboard.jpg
  mouse.jpg
  speaker.jpg
  fitness-band.jpg

The site currently loads product photos from Unsplash CDN (direct URLs) and
falls back to a branded gradient panel (imgFallback) if any URL fails.

To switch to local images, replace the img/img2 URLs in js/script.js, e.g.:
  img:'images/laptop.jpg'
