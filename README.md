# 📚 Clarify

**Education shouldn't be language dependent.**

Clarify is a multilingual AI homework assistant that helps students understand their assignments in their native language. Built for the millions of English Language Learners who struggle not because they can't learn, but because education isn't delivered in a language they fully understand.

## Demo - To Be Added

## 🌟 The Problem

Over 5 million students in US schools are English Language Learners (ELLs). These students often fall behind not due to lack of ability, but because they're learning complex subjects in a language they don't fully understand. Parents who want to help with homework face the same language barriers.

## 💡 My Solution

Clarify breaks down language barriers in education by:

1. **📸 Snap a photo** of any homework assignment/problem (or type it, or use your voice!)
2. **🤖 AI analyzes** the content using Google Gemini Vision
3. **🌍 Get explanations** in your native language (Spanish, Chinese, Arabic, Vietnamese, French, Hindi, Portuguese)
4. **🔊 Listen** to natural voice explanations via ElevenLabs
5. **💬 Ask questions** using your voice and get instant answers

## ✨ Features

- **Multilingual Support**: 7+ languages with native voice support
- **Multi-Subject**: Works for math, science, history, English, and more
- **Voice Interaction**: Ask follow-up questions naturally in your language
- **Cross-Device Sync**: Access your homework history from any device
- **Step-by-Step Explanations**: Not just translations - actual teaching
- **Progress Tracking**: Review past homework and conversations
- **Mobile-First**: Optimized for phones since students use them most
- **Hint Mode**: Priority on learning and growth!

## 🚀 Tech Stack

### Frontend
- **React** with **TypeScript** for type safety
- **Vite** for blazing-fast development
- **TailwindCSS** for responsive, mobile-first design
- **React Router** for navigation
- **Zustand** for lightweight state management

### Backend & Services
- **Firebase Authentication** - Google Sign-In + Email/Password
- **Firebase Firestore** - Real-time database for homework history
- **Firebase Storage** - Secure image storage
- **Google Gemini 2.0 Flash** - Vision + text generation AI
- **ElevenLabs** - Natural multilingual text-to-speech
- **Web Speech API** - Browser-based voice input

### Additional Libraries
- **Howler.js** - Audio playback
- **react-webcam** - Camera access
- **react-hot-toast** - Notifications
- **Lucide React** - Icons

## 🎯 Usage

### For Students

1. **Sign up** with Google or email
2. **Select your language** from the homepage
3. **Scan your homework** by taking a photo or uploading an image or Speak directly to the Clarify Agent
4. **Read the explanation** in your language
5. **Listen** to the explanation being read aloud
6. **Ask questions** using the microphone or typing if you need clarification
7. **Review history** to revisit past homework

### For Parents

1. **Sign up** and select your language
2. **Take a photo** of your child's homework
3. **Understand** what the assignment is asking
4. **Help your child** with confidence, even if you don't speak English fluently

## 🌐 Supported Languages

- 🇪🇸 **Spanish** (Español) - Primarily Tested as it is the only one I am semi-familiar with.
- 🇨🇳 **Chinese** (中文)
- 🇸🇦 **Arabic** (العربية)
- 🇻🇳 **Vietnamese** (Tiếng Việt)
- 🇫🇷 **French** (Français)
- 🇮🇳 **Hindi** (हिन्दी)
- 🇧🇷 **Portuguese** (Português)

## 🐛 Known Issues

- Web Speech API only works in Chrome and Safari

## 🗺️ Roadmap

- [ ] Add more languages (Korean, Japanese, Tagalog, Russian, etc)
- [ ] Teacher dashboard to track student progress
- [ ] Share homework explanations with classmates
- [ ] Integration with school learning management systems
- [ ] Mobile native apps (iOS/Android)
- [ ] OCR improvements for handwritten text
- [ ] Subject-specific tutoring modes

## 👨‍💻 Authors

- **Gabe** - Fourth-year CS major at University of Florida
- Built for Code for Change 2026 Hackathon - Education Track

## 🙏 Acknowledgments

- **Google Gemini** for powerful multimodal AI capabilities
- **ElevenLabs** for natural multilingual voice synthesis
- **Firebase** for reliable backend infrastructure
- **Code for Change organizers** for creating this opportunity
- **MLH** for providing lovely APIs and information

## 📞 Contact

- **Project Link**: [https://github.com/gburger5/clarify]((https://github.com/gburger5/Clarify/))
- **Live Demo**: ([https://clarify.vercel.app](https://clarify-alpha.vercel.app/))
- **Feedback**: Open an issue or email [GEBurger0224@gmail.com](mailto:GEBurger0224@gmail.com)

---

**Built with ❤️ for students who deserve education in every language**

*"Education shouldn't be language dependent."*
