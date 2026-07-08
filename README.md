# FIFA SmartHub AI
> "An AI-powered Stadium Operations & Tournament Intelligence Platform for the FIFA World Cup 2026."

FIFA SmartHub AI is an enterprise-grade stadium operating system powered by Gemini 1.5. It optimizes matchday crowd densities, carbon offsets, transit scheduling, universal accessibility routing, emergency SOS alerts, and multi-language announcements in real-time. Designed to act as an operations center presented at Google I/O or FIFA’s official technology showcase.

---

## 🚀 Tech Stack

- **Core**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS v4, PostCSS, Google Fonts (Outfit, Inter)
- **State & Routing**: Zustand (Local Storage sync options)
- **Visualizations**: Chart.js, React-ChartJS-2, custom interactive SVG maps
- **Forms & Validation**: React Hook Form, Zod Resolver
- **Generative AI**: Gemini API (with robust local simulation engine backups)
- **Testing Suite**: Vitest, JSDOM, React Testing Library
- **Accessibility**: target WCAG 2.1 AA (integrated high-contrast styles, dynamic scale scaling, motion filters)

---

## 🏛️ Architectural Directory Structure

```text
src/
├── api/             # API services and integration wrappers
├── assets/          # Static logos and graphic media
├── components/      # Global layout blocks (Header, Sidebar, Theme toggles)
├── constants/       # Mock datasets, translations, preset questions
├── context/         # Context providers (Zustand store links)
├── features/        # Interactive modules (Fan chat, Crowd maps, Transit, Admin control)
├── hooks/           # Reusable helper hooks
├── layouts/         # Layout view wraps
├── pages/           # High-level route views (Landing, Login, Dashboard)
├── services/        # Firebase OAuth wrappers, Gemini API clients
├── styles/          # Custom CSS stylesheets
├── tests/           # Vitest integration test suites
└── types/           # Core TypeScript data schemas and definitions
```

---

## 🛠️ Installation & Setup

1. **Clone & Initialize Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root workspace directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```
   *Note: If environment keys are omitted, the application automatically activates local simulation fallbacks, ensuring complete visual functionality during offline code evaluations.*

3. **Launch Local Development Server**:
   ```bash
   npm run dev
   ```

4. **Verify TypeScript and Build Compilation**:
   ```bash
   npm run build
   ```

5. **Run Telemetry Test Suite**:
   ```bash
   npm run test
   ```

---

## ⚽ Feature Core Modules

1. **Landing Page**: Animated hero grid with stadium counters, glassmorphic layout showcases, and "Launch SmartHub" CTAs.
2. **Secure Login**: Firebase authentication selectors configuring active operational roles (Match Fan, Volunteer, Security, Organizer, System Admin).
3. **Control Tower Dashboard**: Compiled match scoreboards, weather sensors, active incident dispatch metrics, and resource load counts.
4. **AI Fan Assistant**: Gemini chatbot answering seat guides, transit routes, washrooms, and food stalls with voice inputs and outputs.
5. **Crowd twin management**: Color-coded SVG stadium sectors dynamically rendering local heat densities, forecast sliders, and detour prompts.
6. **AI Transit dispatch**: Travel indicators (Metro, Bus, Rideshare) detailing costs, occupancy percentages, and animated route lines.
7. **Accessibility Center**: Compliance toggles (High contrast, scale sizing, motion reduction) adjusting page styles, alongside a sign language support media stream.
8. **Live Translator**: Multilingual tool translating alerts, directional banners, and signages into 8 tournament languages.
9. **Emergency SOS Hub**: Floating panic buttons dispatching GPS sector alerts to responders, alongside structured incident logging boards.
10. **Volunteer Workspace**: Shift attendance indicators, assigned duties, training checklists, and step-by-step guidance guidelines.
11. **Sustainability Console**: Recycled waste breakdowns rendered via Chart.js, solar generation offsets, and green carbon offset recommendations.

---

## 🔮 Future Enhancements

- Integrate live WebRTC camera grids for real-time visual crowd density parsing.
- Deploy real Bluetooth Low Energy (BLE) beacons for indoors localization and seat maps routing.
- Sync active ticket QR codes to Firestore for secure entrance passes validation.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE details for info.
⚽ FIFA SmartHub AI is an unofficial tournament operations concept designed for showcase purposes.
