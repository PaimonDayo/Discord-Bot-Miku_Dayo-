export const data = {
  name: 'slot',
  description: 'ランダムな絵文字が出てきて777を揃えるスロットゲーム',
};

export async function execute(message, args) {
  // スロットに使用する絵文字の配列
  const emojis = ['🍒', '🍊', '🍋', '🍇', '🍉', '💰', '7️⃣'];
  
  // 3つの数字/絵文字をランダムに選択
  const results = Array(3).fill().map(() => {
    return emojis[Math.floor(Math.random() * emojis.length)];
  });
  
  // スロットの見た目を作成
  const slotMachine = `
🎰 スロットマシーン 🎰
┏━━━━━━━━━┓
┃  ${results[0]}  ${results[1]}  ${results[2]}  ┃
┗━━━━━━━━━┛
  `;
  
  // 結果に応じたメッセージを作成
  let resultMessage = "";
  
  if (results[0] === results[1] && results[1] === results[2]) {
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
  
  // 結果を送信
  await message.reply(`${slotMachine}\n${resultMessage}`);
}
