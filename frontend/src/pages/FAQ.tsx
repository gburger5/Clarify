import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, BookOpen, Camera, Globe, Lightbulb, MessageSquare, History } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export default function FAQ() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'How does Clarify work?',
      answer: 'Clarify uses AI to help you understand your homework. Simply take a photo or type your question, and we\'ll provide a step-by-step explanation in your preferred language. You can choose from 7 languages: Spanish, Chinese, Arabic, Vietnamese, French, Hindi, and Portuguese.',
      icon: <BookOpen className="h-5 w-5 text-primary-600" />,
    },
    {
      question: 'What subjects does Clarify support?',
      answer: 'Clarify supports all subjects including Math, Science, History, English, Biology, Chemistry, Physics, and more. Whether it\'s algebra, essay questions, or lab problems, we can help explain it!',
      icon: <MessageSquare className="h-5 w-5 text-green-600" />,
    },
    {
      question: 'What is Hints Mode?',
      answer: 'Hints Mode gives you helpful guidance without revealing the full solution. Instead of showing you the complete answer, we\'ll ask guiding questions, suggest concepts to review, or give you the first step. This helps you learn to solve problems independently!',
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />,
    },
    {
      question: 'How do I take a good photo of my homework?',
      answer: 'For best results: 1) Make sure the problem is well-lit and clearly visible, 2) Hold your camera steady and avoid blur, 3) Capture the entire problem in the frame, 4) Avoid shadows covering the text, 5) Make sure handwriting is legible.',
      icon: <Camera className="h-5 w-5 text-purple-600" />,
    },
    {
      question: 'Can I change my preferred language?',
      answer: 'Yes! Go to Profile > Preferred Language to select a different language. All future explanations will be provided in your newly selected language.',
      icon: <Globe className="h-5 w-5 text-blue-600" />,
    },
    {
      question: 'Where can I find my past homework?',
      answer: 'Tap the History tab at the bottom of the app to see all your saved homework. You can filter by subject, search by date, and tap any item to view the full explanation and any follow-up questions you asked.',
      icon: <History className="h-5 w-5 text-gray-600" />,
    },
    {
      question: 'Can I ask follow-up questions?',
      answer: 'Absolutely! After receiving an explanation, you can type follow-up questions or use voice input to ask for clarification. All conversations are saved in your history.',
      icon: <MessageSquare className="h-5 w-5 text-primary-600" />,
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Yes! Your homework and conversations are stored securely in your private account. Only you can access your saved homework. We never share your data with third parties.',
      icon: <BookOpen className="h-5 w-5 text-red-600" />,
    },
    {
      question: 'What grade levels does Clarify support?',
      answer: 'Clarify supports students from 1st grade through college and beyond! Our AI adjusts the complexity and vocabulary of explanations based on your grade level, which you can set in your profile.',
      icon: <BookOpen className="h-5 w-5 text-green-600" />,
    },
    {
      question: 'Does Clarify work offline?',
      answer: 'No, Clarify requires an internet connection to analyze homework and provide explanations. However, once saved, you can view your homework history offline.',
      icon: <Globe className="h-5 w-5 text-gray-600" />,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-6 pb-20">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="mt-1 text-gray-600">Everything you need to know about Clarify</p>
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-gray-50"
            >
              <div className="shrink-0">{faq.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
              </div>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 shrink-0 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
              )}
            </button>
            {openIndex === index && (
              <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="mt-8 rounded-xl border border-primary-200 bg-primary-50 p-6 text-center">
        <h3 className="mb-2 text-lg font-semibold text-primary-900">Still have questions?</h3>
        <p className="mb-4 text-sm text-primary-700">
          We're here to help! Contact our support team for assistance.
        </p>
        <button
          onClick={() => window.open('mailto:support@clarify.app', '_blank')}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
}
