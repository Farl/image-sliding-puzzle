import { useCallback, useEffect, useMemo, useState } from 'react';
import { EMPTY_TILE, isAdjacent, isSolved, shuffleTiles } from '../utils/puzzle';

async function loadImageInfo(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        src: url,
        aspectRatio: image.width / image.height
      });
    };
    image.onerror = reject;
    image.src = url;
  });
}

export function usePuzzleGame() {
  const [dimension, setDimension] = useState(3);
  const [tiles, setTiles] = useState(() => shuffleTiles(3));
  const [showNumbers, setShowNumbers] = useState(true);
  const [imagePrompt, setImagePrompt] = useState('');
  const [image, setImage] = useState('');
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [solved, setSolved] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startTime = Date.now() + 1000;
    const timer = setInterval(() => {
      if (!started || solved) return;
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
    }, 1000);

    return () => clearInterval(timer);
  }, [started, solved]);

  const initializeBoard = useCallback((nextDimension = dimension) => {
    setTiles(shuffleTiles(nextDimension));
    setStarted(false);
    setSolved(false);
    setElapsedSeconds(0);
  }, [dimension]);

  useEffect(() => {
    initializeBoard(dimension);
  }, [dimension, initializeBoard]);

  useEffect(() => {
    let cancelled = false;

    async function loadDefaultImage() {
      setLoading(true);
      try {
        const response = await fetch('https://cataas.com/cat');
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        const loaded = await loadImageInfo(objectUrl);
        if (!cancelled) {
          setImage(loaded.src);
          setImageAspectRatio(loaded.aspectRatio);
        }
      } catch (error) {
        console.error('Failed to load default image', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDefaultImage();

    return () => {
      cancelled = true;
    };
  }, []);

  const moveTile = useCallback(
    (index) => {
      if (solved) return;

      setTiles((previous) => {
        const emptyIndex = previous.indexOf(EMPTY_TILE);
        if (!isAdjacent(index, emptyIndex, dimension)) return previous;

        if (!started) setStarted(true);

        const next = [...previous];
        [next[index], next[emptyIndex]] = [next[emptyIndex], next[index]];

        if (isSolved(next)) {
          setSolved(true);
          window.setTimeout(() => {
            window.alert('Congratulations! You solved the puzzle!');
          }, 0);
        }

        return next;
      });
    },
    [dimension, solved, started]
  );

  const onFileSelect = useCallback(async (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    const reader = new FileReader();
    reader.onload = async (loadEvent) => {
      try {
        const source = String(loadEvent.target?.result || '');
        const loaded = await loadImageInfo(source);
        setImage(loaded.src);
        setImageAspectRatio(loaded.aspectRatio);
      } catch (error) {
        console.error('Failed to load selected image', error);
      }
    };
    reader.readAsDataURL(selected);
  }, []);

  const generateImage = useCallback(async () => {
    const prompt = imagePrompt.trim();
    if (!prompt) {
      window.alert('Please enter an image description.');
      return;
    }

    if (typeof window.websim?.imageGen !== 'function') {
      window.alert('Image generation is unavailable in this environment.');
      return;
    }

    setLoading(true);
    try {
      const result = await window.websim.imageGen({
        prompt,
        aspect_ratio: '1:1'
      });
      const loaded = await loadImageInfo(result.url);
      setImage(loaded.src);
      setImageAspectRatio(loaded.aspectRatio);
      initializeBoard(dimension);
    } catch (error) {
      console.error('Failed to generate image', error);
      window.alert('Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [dimension, imagePrompt, initializeBoard]);

  const state = useMemo(
    () => ({
      dimension,
      tiles,
      showNumbers,
      imagePrompt,
      image,
      imageAspectRatio,
      loading,
      elapsedSeconds
    }),
    [dimension, tiles, showNumbers, imagePrompt, image, imageAspectRatio, loading, elapsedSeconds]
  );

  const actions = useMemo(
    () => ({
      setDimension: (next) => setDimension(Math.min(8, Math.max(3, Number(next) || 3))),
      setImagePrompt,
      setShowNumbers,
      startNewGame: () => initializeBoard(dimension),
      moveTile,
      onFileSelect,
      generateImage
    }),
    [dimension, generateImage, initializeBoard, moveTile, onFileSelect]
  );

  return { state, actions };
}
