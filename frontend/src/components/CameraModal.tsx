import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, RotateCcw, Upload, Check } from 'lucide-react';

interface CameraModalProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

export default function CameraModal({ onCapture, onClose }: CameraModalProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const capture = useCallback(() => {
    const shot = webcamRef.current?.getScreenshot();
    if (shot) setCaptured(shot);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCaptured(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const confirm = () => {
    if (captured) onCapture(captured);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onClose} className="rounded-full p-2 text-white active:bg-white/20">
          <X className="h-6 w-6" />
        </button>
        <span className="text-sm font-medium text-white">Scan Homework</span>
        <button
          onClick={() => setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'))}
          className="rounded-full p-2 text-white active:bg-white/20"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      {/* Camera / Preview */}
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        {captured ? (
          <img src={captured} alt="Captured" className="max-h-full max-w-full object-contain" />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            screenshotQuality={0.85}
            videoConstraints={{ facingMode, width: 1280, height: 720 }}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-8 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {captured ? (
          <>
            <button
              onClick={() => setCaptured(null)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white"
            >
              <RotateCcw className="h-6 w-6" />
            </button>
            <button
              onClick={confirm}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg"
            >
              <Check className="h-8 w-8" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white"
            >
              <Upload className="h-6 w-6" />
            </button>
            <button
              onClick={capture}
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20"
            >
              <Camera className="h-7 w-7 text-white" />
            </button>
            <div className="h-14 w-14" />
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
}
