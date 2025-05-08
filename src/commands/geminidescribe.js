import { GoogleGenerativeAI } from '@google/generative-ai';

export const data = {
  name: 'geminidescribe',
  description: 'Google Gemini APIによる画像の詳細な説明生成',
};

export async function execute(message, args) {
  try {
    // プロンプトを取得
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply('説明を生成するためのプロンプトを入力してください。例: `!geminidescribe 青空の下で踊る初音ミク`');
    }
    
    // 処理中メッセージ
    const loadingMessage = await message.channel.send('🖋️ Google Gemini APIで説明文を生成中です...');
    
    // Google Generative AI クライアントを初期化
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // プロンプトテンプレート
    const completePrompt = `
次の内容について、詳細で視覚的な説明文を生成してください。この説明文は画像生成AIに入力するプロンプトとして使われます：
"${prompt}"

説明文には以下の要素を含めてください：
- シーンの詳細な視覚的説明
- 登場する人物や物体の特徴
- 色彩、照明、雰囲気
- 構図や視点の情報
- アートスタイルやレンダリング方法の提案

説明文は日本語で、3〜5文程度にまとめてください。
`;
    
    // 生成リクエストの設定
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 500,
    };
    
    // テキスト生成を実行
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: completePrompt }] }],
      generationConfig,
    });
    
    const response = result.response;
    const generatedText = response.text();
    
    // 処理中メッセージを削除
    await loadingMessage.delete().catch(console.error);
    
    // Discordに生成された説明文を送信
    await message.reply({
      content: `"${prompt}" の説明文が生成されました:\n\n${generatedText}`,
    });
    
  } catch (error) {
    console.error("Text generation error:", error);
    await message.reply(`説明文生成中にエラーが発生しました: ${error.message}`);
  }
}