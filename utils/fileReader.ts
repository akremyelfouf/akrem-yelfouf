
export const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                if (file.type === 'text/plain') {
                    resolve(event.target?.result as string);
                } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    const arrayBuffer = event.target?.result as ArrayBuffer;
                    if (window.mammoth) {
                        const result = await window.mammoth.extractRawText({ arrayBuffer });
                        resolve(result.value);
                    } else {
                        reject(new Error('Mammoth.js library not loaded.'));
                    }
                } else {
                    reject(new Error('نوع الملف غير مدعوم. الرجاء رفع ملف .txt أو .docx'));
                }
            } catch (error) {
                reject(new Error('فشل في معالجة الملف.'));
            }
        };

        reader.onerror = () => {
            reject(new Error('فشل في قراءة الملف.'));
        };
        
        if (file.type === 'text/plain') {
            reader.readAsText(file, 'UTF-8');
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            reader.readAsArrayBuffer(file);
        } else {
            reject(new Error('نوع الملف غير مدعوم. الرجاء رفع ملف .txt أو .docx'));
        }
    });
};
