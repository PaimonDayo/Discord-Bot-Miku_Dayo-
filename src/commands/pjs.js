import fetch from 'node-fetch';

export const data = {
  name: 'pjs',
  description: 'プロジェクトセカイの2DMVの再生リストからランダムな動画を再生',
};

export async function execute(message, args) {
  try {
    // プロジェクトセカイの公式再生リストURL
    const playlistUrl = 'https://music.youtube.com/playlist?list=PLiFNg5fXiX32G3fNBC7U02t19zVkHAmdD';
    
    // プロセカのアスキーアート
    const projectSekaiArt = `
  🎵 プロジェクトセカイ MV 🎵
  ┏━━━━━━━━━━━━━━━━━━━━━┓
  ┃     Random MV Player    ┃
  ┗━━━━━━━━━━━━━━━━━━━━━┛
    `;

    // 選曲メッセージとプレイリストURLを表示
    await message.channel.send(`${projectSekaiArt}\n**プロジェクトセカイの2DMV再生リスト**から\nランダムな曲を楽しむことができます♪\n\n${playlistUrl}`);

    // 楽しみ方のヒントも表示
    await message.channel.send('```ヒント:\n- リンク先では「シャッフル再生」をオンにすると、毎回違う曲から始まります\n- モバイルでは「YouTube Music」アプリで開くとバックグラウンド再生も可能です```');

    // プロセカキャラクターのランダムメッセージ
    const characterMessages = [
      "今日はどんな曲に出会えるかな？ワクワクするね♪ - ミク",
      "音楽って本当に素敵…みんなの心を一つにしてくれるね - ルカ",
      "ふわぁ…この曲、心地いいリズムだね。もっと聴いていたいな - KAITO",
      "みんな一緒に歌おう！リンの歌声、聞かせてあげる！ - リン",
      "この曲のベースライン、かっこよすぎだろ…思わず踊っちゃうよな - レン",
      "この曲聴くと、なんだかステージに立つ自分をイメージしちゃうな - MEIKO",
      "この世界の歌、一つ一つにストーリーがあるんだ。素敵だよね - 一歌",
      "音楽は心を映す鏡…今のあなたはどんな曲に心惹かれる？ - 咲希",
      "この曲のメロディ、何度聴いても飽きないよね！ - 穂波",
      "みんなで聴く音楽は特別…一緒にこの瞬間を楽しもう！ - 志歩"
    ];
    
    const randomMessage = characterMessages[Math.floor(Math.random() * characterMessages.length)];
    await message.channel.send(`**${randomMessage}**`);
    
  } catch (error) {
    console.error("Error in pjs command:", error);
    await message.reply("コマンド実行中にエラーが発生しました。もう一度お試しください。");
  }
}
