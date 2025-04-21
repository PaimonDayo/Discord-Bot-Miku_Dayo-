export const data = {
  name: 'omikuji',
  description: 'おみくじを引いて運勢を占う',
};

export async function execute(message, args) {
  // 運勢の種類と対応する絵文字
  const fortunes = [
    { result: '大吉', emoji: '🌟', description: '最高の運勢！何をやっても上手くいきそう！' },
    { result: '吉', emoji: '✨', description: '良い運勢です。積極的に行動するといいことがあるかも！' },
    { result: '中吉', emoji: '🌈', description: 'まずまずの運勢。リラックスして過ごしましょう。' },
    { result: '小吉', emoji: '🍀', description: '小さな幸運が舞い込みそう。日常の小さな喜びを大切に。' },
    { result: '末吉', emoji: '🌱', description: '後になって良いことがあるかも。焦らず待ちましょう。' },
    { result: '凶', emoji: '⚡', description: '少し注意が必要な日。慎重に行動しましょう。' },
    { result: '大凶', emoji: '☔', description: '運気が低迷中。無理はせず静かに過ごすのがオススメ。' }
  ];
  
  // 項目ごとの運勢
  const aspects = [
    { name: '学業/仕事', results: ['絶好調！目標達成のチャンス！', '堅実に進めれば成果が出るでしょう', '地道な努力が実を結びます', '少し停滞気味。基本に立ち返りましょう', '困難があっても諦めないで'] },
    { name: '恋愛', results: ['素敵な出会いのチャンス！', '良好な関係が続きそう', '自分の気持ちに正直になりましょう', '相手の気持ちを考えて', '焦らず自然体でいることが大切'] },
    { name: '健康', results: ['絶好調！でも無理は禁物', 'バランスの良い食事を心がけて', '適度な運動を取り入れましょう', '疲れが溜まっているかも。休息を', '体調管理に気をつけて'] },
    { name: '金運', results: ['臨時収入があるかも！', '堅実な出費を心がけて', '無駄遣いに注意', '思わぬ出費に備えましょう', '我慢も時には必要です'] }
  ];
  
  // ランダムに運勢を選択
  const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  
  // 項目ごとの運勢をランダムに選択
  const aspectFortunes = aspects.map(aspect => {
    return {
      name: aspect.name,
      result: aspect.results[Math.floor(Math.random() * aspect.results.length)]
    };
  });
  
  // おみくじのアスキーアート
  const omikujiArt = `
  🏮 おみくじ 🏮
  +-------------------+
  |     ${randomFortune.result} ${randomFortune.emoji}     |
  +-------------------+
  `;
  
  // 項目ごとの運勢を文字列に変換
  const aspectResults = aspectFortunes.map(aspect => `**${aspect.name}**: ${aspect.result}`).join('\n');
  
  // 日付と曜日（今日の運勢として）
  const today = new Date();
  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const dateStr = `${today.getMonth() + 1}月${today.getDate()}日（${dayNames[today.getDay()]}）`;
  
  // メッセージを作成
  const replyMessage = `${omikujiArt}\n**${dateStr}の運勢**: ${randomFortune.result}\n*${randomFortune.description}*\n\n${aspectResults}\n\n${message.author.username}さん、今日も素敵な一日になりますように！`;
  
  // 結果を送信
  await message.reply(replyMessage);
}
