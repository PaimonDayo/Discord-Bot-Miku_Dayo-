export const data = {
  name: 'cafe',
  description: 'ランダムな飲み物が出てくるカフェシミュレーション',
};

export async function execute(message, args) {
  // 飲み物の種類とそれに対応する絵文字
  const drinks = [
    { name: 'コーヒー', emoji: '☕', description: '香り高い深煎りコーヒー。一日の始まりにぴったり！' },
    { name: 'カフェラテ', emoji: '🥛', description: 'ふわふわミルクの優しい甘さが広がるカフェラテ。' },
    { name: '抹茶ラテ', emoji: '🍵', description: '濃厚な抹茶の風味とミルクのハーモニー。和の心を感じて。' },
    { name: 'フルーツティー', emoji: '🍹', description: '彩り豊かなフルーツの香りが広がる爽やかなお茶。' },
    { name: 'ホットチョコレート', emoji: '🍫', description: '濃厚でリッチな味わいのチョコレートドリンク。心も体も温まります。' },
    { name: 'フラペチーノ', emoji: '🥤', description: 'クリーミーでひんやり、夏にぴったりのフローズンドリンク。' },
    { name: 'アフォガード', emoji: '🍨', description: 'バニラアイスにエスプレッソをかけた大人のデザートドリンク。' },
    { name: 'ハーブティー', emoji: '🌿', description: 'リラックス効果抜群のハーブの香りが広がるお茶。' },
    { name: 'フレッシュジュース', emoji: '🍊', description: '旬のフルーツをその場で搾った贅沢ジュース。ビタミンたっぷり！' },
    { name: 'ミルクティー', emoji: '🧋', description: '紅茶の香りとミルクのまろやかさが絶妙なハーモニー。' }
  ];
  
  // ランダムに1つ選択
  const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
  
  // カフェのアスキーアート
  const cafeArt = `
  ☕ Miku's Cafe ☕
  +-----------------+
  |  ${randomDrink.emoji}   Welcome!   |
  +-----------------+
  `;
  
  // メッセージを作成
  const replyMessage = `${cafeArt}\n**本日のおすすめ**: ${randomDrink.name} ${randomDrink.emoji}\n*${randomDrink.description}*\n\nいらっしゃいませ、${message.author.username}さん！${randomDrink.name}をお持ちしました。ごゆっくりどうぞ〜♪`;
  
  // 結果を送信
  await message.reply(replyMessage);
}
