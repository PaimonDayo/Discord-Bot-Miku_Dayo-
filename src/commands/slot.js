import { GoogleGenerativeAI } from '@google/generative-ai';

export const data = {
  name: 'slot',
  description: 'ランダムな絵文字が出てきて777を揃えるスロットゲーム',
};

// 絵文字に対応するテーマやロール
const emojiThemes = {
  '🍒': 'フルーツ愛好家', 
  '🍊': 'みかん農家', 
  '🍋': 'レモネード職人',
  '🍇': 'ワイン醸造家',
  '🍉': 'スイカ名人',
  '💰': '富豪',
  '7️⃣': 'ラッキーセブン達人'
};

// Gemini APIを使って絵文字に合わせた褒め言葉を生成する関数
async function generatePraiseMessage(emoji) {
  try {
    // Google Generative AI クライアントを初期化
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // 絵文字に対応するテーマを取得
    const theme = emojiThemes[emoji] || '幸運な人';
    
    // プロンプトテンプレート
    const prompt = `
    スロットゲームで「${emoji}」の絵文字を3つ揃えて勝利したプレイヤーに対する、明るく元気で面白い褒め言葉を1〜2文で生成してください。
    プレイヤーは「${theme}」として称えてあげてください。絵文字を使って楽しい文章にしてください。
    `;
    
    // 生成リクエストの設定
    const generationConfig = {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 200,
    };
    
    // テキスト生成を実行
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    // エラーの場合はデフォルトの褒め言葉を返す
    return `🎉 おめでとう！${emoji}を揃えるとは驚きの才能です！ 🎉`;
  }
}

export async function execute(message, args) {
  // スロットに使用する絵文字の配列
  const emojis = ['🍒', '🍊', '🍋', '🍇', '🍉', '💰', '7️⃣'];
  
  // ユーザー名がpaimondayoで、時刻の秒数が10の場合はランダムな絵文字が揃うようにする
  let results;
  if (message.author.username.toLowerCase() === 'paimondayo' && new Date().getSeconds() === 10) {
    // ランダムに1つの絵文字を選び、それを3つ揃える
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    results = [randomEmoji, randomEmoji, randomEmoji];
  } else {
    // 通常のランダム処理
    results = Array(3).fill().map(() => {
      return emojis[Math.floor(Math.random() * emojis.length)];
    });
  }
  
  // スロットの見た目を作成
  const slotMachine = `
🎰 スロットマシーン 🎰
┏━━━━━━━━━┓
┃  ${results[0]}  ${results[1]}  ${results[2]}  ┃
┗━━━━━━━━━┛
  `;
  
  // 結果に応じたメッセージを作成
  let resultMessage = "";
  let allMatched = false;
  
  if (results[0] === results[1] && results[1] === results[2]) {
    allMatched = true;
    // 一旦デフォルトメッセージを設定
    if (results[0] === '7️⃣') {
      resultMessage = "🎉 大当たり！777を揃えました！おめでとうございます！ 🎉";
    } else {
      resultMessage = "🎉 おめでとう！絵文字が全て揃いました！ 🎉";
    }
  } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
    resultMessage = "🎴 惜しい！2つ揃いました！もう少し！";
  } else {
    resultMessage = "😢 残念！揃いませんでした。もう一度挑戦してみてね！";
  }
  
  // 揃った場合は、Gemini APIを使って絵文字に合わせたカスタムメッセージを生成
  if (allMatched) {
    try {
      const customMessage = await generatePraiseMessage(results[0]);
      resultMessage = customMessage.trim();
    } catch (error) {
      console.error("Error generating custom message:", error);
      // エラーの場合は元のメッセージを使用
    }
  }
  
  // 結果を送信
  await message.reply(`${slotMachine}\n${resultMessage}`);
}
