'use server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateMessage = async (
    promt: string,
    temperature: number = 0.6
) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: promt }],
            temperature: temperature,
            max_tokens: 200,
            top_p: 0.8,
        });
        return response.choices[0]?.message.content || '';
    } catch (err) {
        console.error(err);
        throw new Error('An error occurred while generating the message');
    }
};
