export const data = {
  name: 'genshin',
  description: '原神の攻略サイトを表示',
};

export async function execute(message, args) {
  // 原神攻略サイトのURL
  const genshinUrl = 'https://paimondayo.github.io/Genshin/index.html';
  
  // 原神関連の絵文字
  const emojis = ['✨', '🔮', '⚔️', '🏔️', '🌟'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  // メッセージを作成
  const replyMessage = `${randomEmoji} **原神攻略サイト** ${randomEmoji}\n\n冒険者${message.author.username}さん！テイワット大陸の冒険をサポートするサイトはこちらです：\n${genshinUrl}\n\n風よ、共に行こう！`;
  
  // 結果を送信
  await message.reply(replyMessage);
}
