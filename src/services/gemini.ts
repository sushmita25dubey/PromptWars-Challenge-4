import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client if API key is present
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

let aiClient: GoogleGenerativeAI | null = null;
if (API_KEY) {
  try {
    aiClient = new GoogleGenerativeAI(API_KEY);
  } catch (err) {
    console.warn("Failed to initialize GoogleGenerativeAI SDK, falling back to simulation:", err);
  }
}

// Custom prompt runner using Gemini API (or simulator if key is missing)
export async function runGeminiPrompt(prompt: string, systemInstruction?: string): Promise<string> {
  if (API_KEY && aiClient) {
    try {
      const model = aiClient.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });
      const result = await model.generateContent(
        systemInstruction ? `${systemInstruction}\n\nUser Prompt: ${prompt}` : prompt
      );
      return result.response.text();
    } catch (e) {
      console.error("Gemini API call failed, using simulation engine fallback.", e);
    }
  }

  // AI SIMULATION ENGINE (when no key or offline)
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network latency

  const normalized = prompt.toLowerCase();

  // Route 1: Announcement Generator
  if (normalized.includes('announcement') || normalized.includes('gate 4') || normalized.includes('overcrowded')) {
    const rawInput = prompt.replace(/.*generate announcement for:\s*/gi, '');
    return JSON.stringify({
      professional: `⚠️ ATTENTION ALL SPECTATORS: Please be advised that we are experiencing heavy crowd levels near ${rawInput || 'Gate 4'}. To ensure your comfort and safety, we recommend utilizing alternate entrances such as Gate 2 or Gate 3, which are currently showing low wait times. Stewards are stationed along the concourse to guide you. Thank you for your cooperation.`,
      emergency: `🚨 CRITICAL SAFETY ALERT: Crowd density at ${rawInput || 'Gate 4'} has reached peak capacity. Access via this gate is temporarily restricted. ALL incoming visitors must immediately reroute to Gates 2, 3, or 5. Do not queue in the vicinity of ${rawInput || 'Gate 4'}. Follow emergency marshal directions immediately.`,
      translated: {
        es: `⚠️ ATENCIÓN A TODOS LOS ESPECTADORES: Se informa que hay alta congestión de personas cerca de la ${rawInput || 'Puerta 4'}. Recomendamos usar las entradas alternativas como la Puerta 2 o la Puerta 3. Gracias por su cooperación.`,
        fr: `⚠️ ATTENTION À TOUS LES SPECTATEURS: Veuillez noter qu'il y a une forte affluence près de la ${rawInput || 'Porte 4'}. Nous vous recommandons d'utiliser les entrées alternatives comme la Porte 2 ou la Porte 3. Merci de votre coopération.`,
        ar: `⚠️ تنبيه لجميع المتفرجين: يرجى العلم بأننا نشهد مستويات عالية من الازدحام بالقرب من البوابة 4. نوصي باستخدام مداخل بديلة مثل البوابة 2 أو البوابة 3. شكرًا لتعاونكم.`,
        de: `⚠️ ACHTUNG AN ALLE ZUSCHAUER: Bitte beachten Sie, dass im Bereich von Tor 4 ein sehr hohes Personenaufkommen herrscht. Wir empfehlen, die alternativen Eingänge Tor 2 oder Tor 3 zu nutzen. Vielen Dank für Ihre Kooperation.`
      },
      sms: `FIFA 2026 Alert: Avoid ${rawInput || 'Gate 4'} due to high congestion. Access is limited. Use Gates 2 or 3. Map & updates: fifa.sh/g4`,
      push: `🔔 Avoid ${rawInput || 'Gate 4'}! High congestion detected. Use Gates 2 & 3 for direct entry.`
    });
  }

  // Route 2: Live Translation
  if (normalized.includes('translate to') || normalized.includes('translation')) {
    const targetLang = normalized.includes('spanish') ? 'es' :
                       normalized.includes('french') ? 'fr' :
                       normalized.includes('arabic') ? 'ar' :
                       normalized.includes('hindi') ? 'hi' :
                       normalized.includes('japanese') ? 'ja' :
                       normalized.includes('portuguese') ? 'pt' : 'de';

    const textToTranslate = prompt.split('Translate:')[1]?.trim() || prompt;

    const translations: Record<string, Record<string, string>> = {
      es: { "gate 4 overcrowded": "Puerta 4 sobrepoblada. Por favor use la Puerta 2.", "where is restroom": "¿Dónde está el baño?", "thank you": "Gracias" },
      fr: { "gate 4 overcrowded": "Porte 4 surpeuplée. Veuillez utiliser la Porte 2.", "where is restroom": "Où se trouvent les toilettes?", "thank you": "Merci" },
      ar: { "gate 4 overcrowded": "البوابة 4 مزدحمة للغاية. يرجى استخدام البوابة 2.", "where is restroom": "أين تقع دورة المياه؟", "thank you": "شكرًا لك" },
      hi: { "gate 4 overcrowded": "गेट 4 पर अत्यधिक भीड़ है। कृपया गेट 2 का उपयोग करें।", "where is restroom": "शौचालय कहाँ है?", "thank you": "धन्यवाद" },
      ja: { "gate 4 overcrowded": "ゲート4が混雑しています。ゲート2をご利用ください。", "where is restroom": "お手洗いはどこですか？", "thank you": "ありがとうございます" },
      pt: { "gate 4 overcrowded": "Portão 4 superlotado. Por favor, use o Portão 2.", "where is restroom": "Onde fica o banheiro?", "thank you": "Obrigado" },
      de: { "gate 4 overcrowded": "Tor 4 überfüllt. Bitte nutzen Sie Tor 2.", "where is restroom": "Wo ist die Toilette?", "thank you": "Vielen Dank" }
    };

    const matchWord = textToTranslate.toLowerCase();
    let result = textToTranslate;
    const targetTranslations = translations[targetLang];
    if (targetTranslations) {
      for (const key in targetTranslations) {
        if (matchWord.includes(key)) {
          result = targetTranslations[key];
          break;
        }
      }
    }
    if (result === textToTranslate) {
      result = `[Simulated Gemini Translation in ${targetLang.toUpperCase()}]: ${textToTranslate}`;
    }
    return result;
  }

  // Route 3: Fan Assistant Q&A chatbot
  if (normalized.includes('wheelchair') || normalized.includes('accessibility') || normalized.includes('accessible')) {
    return `♿ **Accessibility Assistance:**
MetLife Stadium is fully compliant with WCAG and ADA guidelines.
- **Ramps & Elevators:** Available at all primary gates. Elevator B2 (East Stand) and Elevator D1 (West Stand) provide direct access to sections 100-300.
- **Accessible Restrooms:** Located adjacent to Sections 104, 117, 128, 208, 224, and 315.
- **Sensory Rooms:** Located on Plaza level near Section 101. Noise-canceling headphones are available at Guest Services hubs.
- **Wheelchair Escorts:** You can request a complimentary wheelchair escort from any entrance by notifying the nearest volunteer or scanning the SOS QR code.`;
  }

  if (normalized.includes('metro') || normalized.includes('bus') || normalized.includes('transport') || normalized.includes('get to')) {
    return `🚇 **Transit & Transport Intelligence:**
- **Metro (M1 Express):** Running every 5 minutes. The station is located just outside the North Stand (Zone A). Journey to Penn Station takes 22 minutes. Status is currently **SMOOTH** (65% capacity).
- **Shuttle Buses:** Park & Ride shuttles board at the Gate B Bus Depot. Shuttles are currently experiencing a minor delay of 15 minutes due to high congestion on Route 3.
- **Rideshare (Uber/Lyft/Taxis):** Drop-off and pick-up zones are restricted to **Lot G**. Walking distance from stadium gates is approximately 10 minutes. Demand is high, expect a 25-minute wait time.`;
  }

  if (normalized.includes('restroom') || normalized.includes('washroom') || normalized.includes('toilet')) {
    return `🚻 **Stadium Restroom Locations:**
There are over 80 public restrooms distributed across all stands:
- **North Stand (Zone A):** Sections 101, 102, 107 (men's, women's, and family/accessible).
- **East Stand (Zone B):** Sections 116, 122 (featuring touchless utilities).
- **South Stand (Zone C):** Sections 128, 131, 140 (high-capacity facilities).
- **West Stand (Zone D):** Sections 144, 244 (premium lounge facilities).
All restrooms include baby-changing tables and accessibility support.`;
  }

  if (normalized.includes('food') || normalized.includes('stall') || normalized.includes('eat') || normalized.includes('drink')) {
    return `🍔 **Food & Beverage Stalls:**
Here is a list of popular food stations near your current zone:
1. **World Cup Grill (Section 104):** Classic American sliders, hotdogs, and vegan burgers. (Wait time: ~8 mins)
2. **El Azteca Tacos (Section 118):** Fresh street tacos, nachos, and churros. (Wait time: ~12 mins)
3. **Green Garden Salads (Section 129):** Organic bowls, fresh fruit cups, and juices. (Wait time: ~3 mins)
4. **Maple Leaf Crepes (Section 141):** Sweet and savory crepes, hot coffee, and chocolate waffles. (Wait time: ~5 mins)
*Water Refilling Stations:* Located at Sections 102, 114, 126, and 138. Fill your official FIFA reusable bottle for free!`;
  }

  if (normalized.includes('lost') || normalized.includes('found')) {
    return `🎒 **Lost & Found Hub:**
- **Location:** The primary Stadium Lost & Found office is situated at the **Plaza level near Guest Services Section 101**.
- **Digital Registry:** If you lost an item (phone, keys, wallet, jacket), you can report it via the 'Incident Report' form on this app or contact a volunteer. All recovered items are scanned and uploaded to our database with an AI description.
- **Hours:** Open until 2 hours post-match. Unclaimed items will be transferred to local municipal custody.`;
  }

  if (normalized.includes('emergency') || normalized.includes('sos') || normalized.includes('medical')) {
    return `🚨 **Emergency Response Guidelines:**
- **SOS Button:** Click the **Red SOS** button on the bottom of the dashboard or head to the Emergency tab. This broadcasts your exact GPS coordinates to the Stadium Command Center.
- **Medical Stations:** The primary first-aid clinics are located near Sections **108, 122, and 230**.
- **Security:** Roving security teams are identifiable by high-visibility red vests.
- **Exits:** In the event of an evacuation, follow the glowing green arrows to the nearest exit gates (Gates 1, 2, 3, or 4). Do not use elevators.`;
  }

  return `⚽ **FIFA Stadium AI Assistant:**
Thank you for your question. As of 18:49, the stadium operates at 85% capacity. Here is what you should know:
- **Match Status:** USA is leading England 2-1 (78th minute).
- **Gate 4:** Experiencing high density. Please use Gate 2 or Gate 3 to enter or exit.
- **Sustainability:** We have saved 4,200kg of waste from landfills today. Keep recycling at designated waste bins.

Feel free to ask a more specific question, like "Where is the nearest restroom?" or "How do I get to the Metro?"`;
}
