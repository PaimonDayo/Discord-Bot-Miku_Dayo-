import fetch from 'node-fetch';

export const data = {
  name: 'geminiimage',
  description: 'Google Gemini APIによる画像生成',
};

export async function execute(message, args) {
  try {
    // プロンプトを取得
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply('画像を生成するためのプロンプトを入力してください。例: `!geminiimage 青空の下で踊る初音ミク`');
    }
    
    // 処理中メッセージ
    const loadingMessage = await message.channel.send('🎨 Google Gemini APIで画像を生成中です... (少々お待ちください)');
    
    // Google Gemini APIを使用 - text-to-image用のエンドポイント
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateImage",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          prompt: {
            text: prompt
          },
          responseFormat: "AUTO",
          safetySettings: [
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
      }
    );
    
    // エラーチェック
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    // レスポンスからBase64エンコードされた画像データを取得
    const data = await response.json();
    const imageBase64 = data.imageData.data;
    
    // Base64データをバッファに変換
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    
    // 処理中メッセージを削除
    await loadingMessage.delete().catch(console.error);
    
    // Discordに画像を送信
    await message.reply({
      content: `"${prompt}" の画像が生成されました:`,
      files: [{ attachment: imageBuffer, name: 'gemini-generated-image.png' }]
    });
    
  } catch (error) {
    console.error("Image generation error:", error);
    
    // より詳細なエラーメッセージを表示
    let errorMessage = `画像生成中にエラーが発生しました: ${error.message}`;
    
    // API特有のエラーの場合
    if (error.message.includes('API error')) {
      errorMessage += '\nGoogle Gemini APIとの通信に問題が発生しました。APIキーが正しいか確認してください。';
    }
    
    await message.reply(errorMessage);
  }
}