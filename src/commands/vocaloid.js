import { EmbedBuilder } from "discord.js";
import fetch from "node-fetch";

export const data = {
  name: "vocaloid",
  description: "ランダムなボカロ曲を表示します",
};

// 有名なボカロP/アーティストのリスト
const popularVocaloidProducers = [
  "ryo supercell",
  "DECO*27",
  "wowaka",
  "Mitchie M",
  "PinocchioP",
  "Neru",
  "n-buna",
  "kemu",
  "40mP",
  "GYARI",
  "Giga",
  "livetune",
  "mikitoP",
  "sasakure.UK",
  "cosMo@暴走P",
  "ハチ",
  "かいりきベア",
  "ピノキオピー",
  "てにをは",
  "れるりり",
  "トラボルタ",
  "いよわ",
  "Kanaria",
  "じん",
  "サツキ",
  "Chinozo",
  "syudou",
  "OSTER Project",
  "八王子P",
  "ジミーサムP",
  "ユリイ・カノン",
  "ラマーズP",
  "バルーン",
  "ぬゆり",
  "ナノウ",
  "まふまふ",
  "Orangestar",
  "初音ミク",
  "鏡音リン",
  "鏡音レン",
  "巡音ルカ",
  "KAITO",
  "MEIKO",
  "GUMI",
  "IA",
  "flower",
];

// 検索クエリのバリエーション
const queryVariations = [
  "ボカロ",
  "VOCALOID",
  "ミクオリジナル",
  "ボーカロイド",
  "ボカロ曲",
  "ボカロPV",
  "ボカロランキング",
  "ボカロカバー",
];

export async function execute(message, args) {
  try {
    await message.channel.send("🎵 ランダムなボカロ曲を探しています...");

    // ランダムにプロデューサーまたはボカロと検索バリエーションを選択
    const randomProducer =
      popularVocaloidProducers[Math.floor(Math.random() * popularVocaloidProducers.length)];
    const randomVariation = queryVariations[Math.floor(Math.random() * queryVariations.length)];

    // 検索クエリを作成
    let searchQuery;
    // 30%の確率でプロデューサー名だけを使用
    if (Math.random() < 0.3) {
      searchQuery = `${randomProducer} ${randomVariation}`;
    } else {
      // 70%の確率で単にボカロ関連のクエリを使用
      searchQuery = randomVariation;
    }

    // YouTube APIを呼び出して検索
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=50&key=${process.env.YOUTUBE_API_KEY}`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();

    // 検索結果がない場合
    if (!data.items || data.items.length === 0) {
      return message.reply("ボカロ曲が見つかりませんでした。もう一度試してみてください。");
    }

    // ランダムに1つの動画を選択
    const randomIndex = Math.floor(Math.random() * data.items.length);
    const randomVideo = data.items[randomIndex];

    // 動画の詳細情報を取得
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${randomVideo.id.videoId}&key=${process.env.YOUTUBE_API_KEY}`,
    );

    if (!videoDetailsResponse.ok) {
      const errorData = await videoDetailsResponse.json();
      throw new Error(
        `YouTube API Error: ${videoDetailsResponse.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const videoDetails = await videoDetailsResponse.json();
    const videoInfo = videoDetails.items[0];

    // 動画の期間をフォーマット (PT1H2M3S 形式から読みやすい形式に)
    const duration = videoInfo.contentDetails.duration;
    let formattedDuration = "";

    const hours = duration.match(/(\d+)H/);
    const minutes = duration.match(/(\d+)M/);
    const seconds = duration.match(/(\d+)S/);

    if (hours) formattedDuration += `${hours[1]}時間 `;
    if (minutes) formattedDuration += `${minutes[1]}分 `;
    if (seconds) formattedDuration += `${seconds[1]}秒`;

    // 視聴回数をフォーマット (例: 1,000,000 -> 1M)
    const viewCount = Number.parseInt(videoInfo.statistics.viewCount);
    let formattedViewCount = "";

    if (viewCount >= 1000000) {
      formattedViewCount = `${(viewCount / 1000000).toFixed(1)}M`;
    } else if (viewCount >= 1000) {
      formattedViewCount = `${(viewCount / 1000).toFixed(1)}K`;
    } else {
      formattedViewCount = viewCount.toString();
    }

    // 高解像度のサムネイルURLを取得
    const thumbnailUrl = videoInfo.snippet.thumbnails.high.url;

    // Embedを作成
    const embed = new EmbedBuilder()
      .setColor(0x39c5bb) // ミクカラー
      .setTitle(videoInfo.snippet.title)
      .setURL(`https://www.youtube.com/watch?v=${videoInfo.id}`)
      .setDescription(`${videoInfo.snippet.description?.slice(0, 100)}...`)
      .setThumbnail(thumbnailUrl)
      .addFields(
        { name: "チャンネル", value: videoInfo.snippet.channelTitle, inline: true },
        { name: "再生時間", value: formattedDuration, inline: true },
        { name: "視聴回数", value: formattedViewCount, inline: true },
        {
          name: "公開日",
          value: new Date(videoInfo.snippet.publishedAt).toLocaleDateString("ja-JP"),
          inline: true,
        },
      )
      .setImage(thumbnailUrl)
      .setFooter({ text: "ボカロ曲をランダムに表示" });

    // 結果を送信
    await message.reply({
      content: `🎵 ランダムなボカロ曲が見つかりました！\nhttps://www.youtube.com/watch?v=${videoInfo.id}`,
      embeds: [embed],
    });
  } catch (error) {
    console.error("Vocaloid command error:", error);
    await message.reply(`エラーが発生しました: ${error.message}`);
  }
}
