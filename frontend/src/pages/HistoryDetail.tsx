import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHomeworkById } from '../services/firestore';
import type { HomeworkResult } from '../types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';

export default function HistoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [homework, setHomework] = useState<HomeworkResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getHomeworkById(id)
      .then(setHomework)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!homework) {
    return <p className="p-6 text-center">Not found</p>;
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-6 space-y-4">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Image */}
      {homework.imageUrl && (
        <img
          src={homework.imageUrl}
          className="w-full rounded-xl"
          alt="Homework"
        />
      )}

      {/* Meta */}
      <div className="flex gap-2">
        <span className="rounded-full bg-primary-100 px-3 py-1 text-sm text-primary-700">
          {homework.subject}
        </span>

        <span className="text-sm text-gray-500">
          {new Date(homework.timestamp).toLocaleString()}
        </span>
      </div>

      {/* Original */}
      <div>
        <h2 className="font-semibold">Original</h2>
        <p className="text-gray-700">{homework.originalText}</p>
      </div>

      {/* Translation */}
      <div>
        <h2 className="font-semibold">Translation</h2>
        <p className="text-gray-700">{homework.translatedText}</p>
      </div>

      {/* Explanation */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Explanation</h2>
          {homework.audioUrl && <AudioPlayer src={homework.audioUrl} />}
        </div>
        <p className="mt-1 text-gray-700 whitespace-pre-line">
          {homework.explanation}
        </p>
      </div>
    </div>
  );
}
