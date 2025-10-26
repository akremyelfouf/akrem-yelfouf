import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getLengthInstruction = (length: string): string => {
    switch (length) {
        case 'قصير جداً':
            return 'أنشئ ملخصًا موجزًا للغاية في بضعة نقاط رئيسية.';
        case 'قصير':
            return 'أنشئ ملخصًا قصيرًا في فقرة واحدة مركزة.';
        case 'متوسط':
            return 'أنشئ ملخصًا متوازنًا يغطي كافة الأقسام الرئيسية بشكل معتدل.';
        case 'طويل':
            return 'أنشئ ملخصًا مفصلاً مع الحفاظ على أهم التفاصيل من كل قسم.';
        case 'طويل جداً':
            return 'أنشئ ملخصًا شاملاً وموسعًا لكل قسم، مع استيعاب أكبر قدر من المعلومات الهامة.';
        default:
            return 'أنشئ ملخصًا متوازنًا يغطي كافة الأقسام الرئيسية بشكل معتدل.';
    }
};

export const summarizeText = async (text: string, length: string): Promise<string> => {
    try {
        const lengthInstruction = getLengthInstruction(length);

        const professionalPrompt = `
${lengthInstruction}

يجب أن تلتزم بالقواعد التالية بدقة عند إعداد ملخص أكاديمي احترافي للنص البحثي التالي:
1.  **الحفاظ على العناوين**: حافظ على جميع عناوين الأقسام الأصلية (مثل: المقدمة، المنهجية، النتائج، الخاتمة) دون أي تعديل، حذف، أو إعادة صياغة.
2.  **التركيز على الجوهر**: تحت كل عنوان، قدم تلخيصًا موجزًا ومركزًا للفقرات التي تليه، مستخلصًا الأفكار الرئيسية، الحجج الأساسية، البيانات الهامة، والنتائج الرئيسية فقط.
3.  **اللغة الأكاديمية**: استخدم لغة عربية فصحى، رصينة، وموضوعية.
4.  **الحيادية**: تجنب إضافة أي معلومات، تفسيرات، أو آراء غير موجودة في النص الأصلي.
5.  **التسلسل المنطقي**: تأكد من أن الملخص الناتج يحافظ على التسلسل المنطقي والهيكل العام للبحث الأصلي.

النص المراد تلخيصه:
---
${text}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Using a more advanced model for professional results
            contents: professionalPrompt,
            config: {
                systemInstruction: "أنت خبير أكاديمي متخصص في تحليل وتلخيص الأبحاث العلمية باللغة العربية. مهمتك هي إنتاج ملخص احترافي ودقيق، يسلط الضوء على النقاط الجوهرية، والمنهجية المتبعة، وأهم النتائج والاستنتاجات، مع الحفاظ الكامل على هيكل البحث الأصلي وعناوينه.",
                temperature: 0.4, // Lower temperature for more focused and less creative output
                topP: 0.9,
                topK: 40,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error summarizing text with Gemini API:", error);
        
        let detailedMessage = "فشلت خدمة التلخيص. يرجى المحاولة مرة أخرى.";

        // Try to extract a more specific message from the error object
        if (error instanceof Error) {
            // The error message from the Gemini API is often descriptive.
            detailedMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'toString' in error) {
            // Fallback for other types of error objects that might be thrown
            detailedMessage = error.toString();
        }

        // Throw a new error that will be caught by the App component,
        // which will then display it in the UI.
        throw new Error(detailedMessage);
    }
};