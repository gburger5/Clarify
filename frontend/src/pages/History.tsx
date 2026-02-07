import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { getUserHomework } from '../services/firestore';
import { LANGUAGES, type HomeworkResult } from '../types';
import { Clock, BookOpen, Loader2 } from 'lucide-react';

export default function History() {
  const { user } = useAuthStore();
  const [homework, setHomework] = useState<HomeworkResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserHomework(user.uid)
      .then(setHomework)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">History</h1>

      {homework.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700">No homework yet</h2>
          <p className="mt-1 text-sm text-gray-500">
            Scan your first homework to see it here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {homework.map((hw) => (
            <div
              key={hw.id}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              {hw.imageUrl && (
                <img
                  src={hw.imageUrl}
                  alt="Homework"
                  className="h-20 w-20 shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                    {hw.subject}
                  </span>
                  <span className="text-xs text-gray-400">
                    {LANGUAGES[hw.targetLanguage]?.flag}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-gray-700">
                  {hw.originalText}
                </p>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(hw.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
