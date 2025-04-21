import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env["GEMINI_API_KEY"]);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export const data = {
  name: 'mask',
  description: 'Gemini APIを使用して「やっほー！ミクだよっ！」から始まるメッセージを生成します',
};

export async function execute(message, args) {
  try {
    // ユーザーの入力（あれば）を取得
    const userInput = args.join(' ') || 'こんにちは、元気ですか？';
    
    // Geminiに送信するプロンプト
    const prompt = `あなたは「やっほー！ミクだよっ！」という言葉から始まる返信をする必要があります。
あなたはミクという女の子のキャラクターとして振る舞ってください。
どんな質問や会話にも「やっほー！ミクだよっ！」で始まる応答をしてください。
元気で明るい女の子らしい話し方をして、語尾に「だよっ」「かなっ」「だねっ」などをつけてください。
絵文字も時々使って、親しみやすく可愛らしい印象を与えてください。また、できるだけ読みやすいように適度な改行を入れたり、過度なスタンプの使用は避けてください。

以下はユーザーの入力です：

${userInput}`;

    // Gemini APIにプロンプトを送信
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // レスポンステキストを取得
    const text = typeof response.text === "function" 
                   ? await response.text() 
                   : response.text;

    // 応答が「やっほー！ミクだよっ！」で始まっていない場合は追加する
    let finalResponse = text;
    if (!finalResponse.startsWith('やっほー！ミクだよっ！')) {
      finalResponse = `やっほー！ミクだよっ！${finalResponse}`;
    }

    await message.reply(finalResponse);
  } catch (error) {
    console.error(error);
    await message.reply(`エラーが発生しました：${error.message}`);
  }
}