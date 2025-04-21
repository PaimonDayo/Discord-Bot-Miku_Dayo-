import { GoogleGenerativeAI } from "@google/generative-ai";

export const data = {
  name: 'ask',
  description: 'Geminiに質問するコマンド',
};

export async function execute(message, args) {
  // 環境変数からAPIキーを取得
  const apiKey = process.env["GEMINI_API_KEY"];
  
  // APIキーがない場合はエラーメッセージを返す
  if (!apiKey) {
    return message.reply("GEMINI_API_KEYが設定されていません。BOT管理者に連絡してください。");
  }
  
  // 引数がない場合は使い方を表示
  if (args.length === 0) {
    return message.reply("質問内容を入力してください。例: `!ask 今日の天気はどうですか？`");
  }
  
  const prompt = args.join(" ");
  
  try {
    // Gemini APIの初期化
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // ユーザーに待機メッセージを送信
    await message.channel.send("Geminiに質問中...");
    
    // Gemini APIにプロンプトを投げる
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // レスポンステキストを取得
    const text = typeof response.text === "function" 
                   ? await response.text() 
                   : response.text;
    
    // 結果を送信
    await message.reply(text);
  } catch (error) {
    console.error("Gemini API error:", error);
    await message.reply(`API リクエスト中にエラーが発生しました。\n${error.message}`);
  }
}
