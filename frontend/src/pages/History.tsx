import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { getUserHomework, deleteHomework, deleteAllUserHomework } from '../services/firestore';
import { LANGUAGES, type HomeworkResult } from '../types';
import { Clock, BookOpen, Loader2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


type DateGroup = 'Today' | 'Yesterday' | 'This Week' | 'This Month' | 'Earlier';

function getDateGroup(timestamp: number): DateGroup {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'This Week';
  if (diffDays <= 30) return 'This Month';
  return 'Earlier';
}

export default function History() {
  const { user } = useAuthStore();
  const [homework, setHomework] = useState<HomeworkResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const navigate = useNavigate();

  const loadHomework = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserHomework(user.uid);
      setHomework(data);
    } catch (err) {
      console.error('History query failed:', err);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomework();
  }, [user]);

  const handleDelete = async (e: React.MouseEvent, homeworkId: string) => {
    e.stopPropagation();
    if (!confirm('Delete this homework? This cannot be undone.')) return;

    setDeleting(homeworkId);
    try {
      await deleteHomework(homeworkId);
      setHomework(homework.filter((hw) => hw.id !== homeworkId));
      toast.success('Homework deleted');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete homework');
    } finally {
      setDeleting(null);
    }
  };

  const handleClearAll = async () => {
    if (!user) return;
    if (!confirm('⚠️ Delete ALL homework history?\n\nThis will permanently delete all your saved homework and conversations. This action cannot be undone.')) return;

    setLoading(true);
    try {
      await deleteAllUserHomework(user.uid);
      setHomework([]);
      toast.success('All history cleared');
    } catch (err) {
      console.error('Clear all failed:', err);
      toast.error('Failed to clear history');
    } finally {
      setLoading(false);
    }
  };

  // Get unique subjects
  const subjects = ['All', ...new Set(homework.map((hw) => hw.subject))];

  // Filter homework by subject
  const filteredHomework = selectedSubject === 'All'
    ? homework
    : homework.filter((hw) => hw.subject === selectedSubject);

  // Group homework by date
  const groupedHomework: Record<DateGroup, HomeworkResult[]> = {
    'Today': [],
    'Yesterday': [],
    'This Week': [],
    'This Month': [],
    'Earlier': [],
  };

  filteredHomework.forEach((hw) => {
    const group = getDateGroup(hw.timestamp);
    groupedHomework[group].push(hw);
  });

  const dateGroups: DateGroup[] = ['Today', 'Yesterday', 'This Week', 'This Month', 'Earlier'];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
      </div>

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
        <>
          {/* Subject Filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  selectedSubject === subject
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>

          {/* Clear All Button - Less Prominent */}
          {homework.length > 0 && (
            <button
              onClick={handleClearAll}
              className="mb-4 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:text-red-600 hover:underline"
            >
              <Trash2 className="h-4 w-4" />
              Clear All History
            </button>
          )}

          {/* Grouped Homework */}
          {filteredHomework.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              No {selectedSubject.toLowerCase()} homework found
            </div>
          ) : (
            <div className="space-y-6">
              {dateGroups.map((group) => {
                const items = groupedHomework[group];
                if (items.length === 0) return null;

                return (
                  <div key={group}>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {group}
                    </h2>
                    <div className="space-y-3">
                      {items.map((hw) => (
            <div
              key={hw.id}
              className="group relative flex cursor-pointer gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50"
            >
              <div
                onClick={() => navigate(`/history/${hw.id}`)}
                className="flex flex-1 gap-4"
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
              <button
                onClick={(e) => handleDelete(e, hw.id!)}
                disabled={deleting === hw.id}
                className="shrink-0 self-start rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                {deleting === hw.id ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Trash2 className="h-5 w-5" />
                )}
              </button>
            </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
