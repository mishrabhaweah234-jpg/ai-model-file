import { toast } from '@/hooks/use-toast';

const filenameSafe = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const downloadImage = async (dataUrl: string, baseName = 'try-on') => {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filenameSafe(baseName)}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast({ title: 'Image saved', description: 'Downloaded to your device.' });
  } catch (err) {
    console.error('Download failed', err);
    toast({ title: 'Download failed', description: 'Could not save the image.', variant: 'destructive' });
  }
};

export const shareImage = async (dataUrl: string, baseName = 'try-on') => {
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `${filenameSafe(baseName)}.png`, { type: blob.type || 'image/png' });

    const navAny = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
    if (navAny.canShare && navAny.canShare({ files: [file] }) && navigator.share) {
      await navigator.share({
        files: [file],
        title: 'My AI Try-On',
        text: 'Check out this outfit I tried on!',
      });
      return;
    }
    // Fallback: download
    await downloadImage(dataUrl, baseName);
  } catch (err: unknown) {
    if ((err as Error)?.name === 'AbortError') return;
    console.error('Share failed', err);
    await downloadImage(dataUrl, baseName);
  }
};
