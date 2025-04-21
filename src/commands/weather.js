export const data = {
  name: 'weather',
  description: '天気情報を初音ミク（ワンダーランドのセカイ）風に表示',
  usage: '!weather [都市名]', // 使用方法の説明
};

export async function execute(message, args) {
  // OpenWeatherMap APIキー（必ず自分のAPIキーに置き換えてください）
  const WEATHER_API_KEY = "8b2dfb5e79bd50f7fdf0c17b3f9cfb30";
  
  let city = "";
  
  try {
    // 引数があれば、都市名として使用
    if (args.length > 0) {
      city = args.join(" ");
    } else {
      // 引数がない場合、IPベースで位置情報を取得
      await message.channel.send("位置情報を取得中...");
      
      try {
        // ipapi.coを使用して位置情報を取得（APIキー不要）
        const geoResponse = await fetch("https://ipapi.co/json/");
        
        if (!geoResponse.ok) {
          throw new Error(`位置情報の取得に失敗しました (${geoResponse.status})`);
        }
        
        const geoData = await geoResponse.json();
        
        // 都市名とその他の情報を取得
        city = geoData.city || "Tokyo"; // デフォルトを東京に
        
        message.channel.send(`あなたの位置情報から **${city}** の天気を確認します...`);
      } catch (geoError) {
        console.error("Geolocation error:", geoError);
        city = "Tokyo"; // 位置情報の取得に失敗した場合はデフォルトを東京に
        message.channel.send(`位置情報の取得に失敗しました。デフォルトの東京の天気を確認します...`);
      }
    }

    // OpenWeatherMap APIのURL
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric&lang=ja`;
    
    // APIからデータを取得
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      if (response.status === 404) {
        return message.reply(`「${city}」という都市は見つかりませんでした。都市名を確認してください。`);
      } else if (response.status === 401) {
        return message.reply("APIキーが無効です。BOT管理者に連絡してください。");
      } else {
        return message.reply(`天気情報の取得に失敗しました。エラーコード: ${response.status}`);
      }
    }
    
    const data = await response.json();
    
    // 天気情報を取得
    const weatherId = data.weather[0].id;
    const weatherDescription = data.weather[0].description;
    const temp = Math.round(data.main.temp);
    
    // 天気に応じたワンダーランドのミク風リアクションを決定
    let reaction = "";
    let emoji = "";
    
    // 天気に応じたリアクション
    if (weatherId >= 600 && weatherId < 700) { // 雪
      reaction = "わぁ！真っ白なお砂糖みたいな雪が降ってる！冷たくてふわふわで、とっても不思議...雪の結晶って、小さな魔法みたいだよね♪ 一緒に雪うさぎ作ろ～！";
      emoji = "❄️☃️";
    } else if (weatherId >= 200 && weatherId < 300) { // 雷雨
      reaction = "空から光のショーが始まったよ！雷さんはちょっぴり怖いけど、キラキラ光る様子はまるでワンダーランドの魔法みたい！でも、みんな安全な場所で見てね♪";
      emoji = "⚡🌧️";
    } else if (weatherId >= 300 && weatherId < 600) { // 雨
      reaction = "しとしと雨の音、聞こえる？雨の日は特別な魔法がかかってるんだよ♪ 傘のドレスで踊りたくなっちゃう！でも濡れないように気をつけてね！";
      emoji = "☔🌧️";
    } else if (weatherId === 800) { // 晴れ
      reaction = "わぁ、お空がキラキラしてる！今日はおひさまがニコニコ笑ってるね♪ お出かけ日和だよ！一緒にティーパーティーしたいな～！";
      emoji = "☀️✨";
    } else if (weatherId > 800 && weatherId < 900) { // 曇り
      reaction = "ふわふわの雲さんがたくさん集まってるね。不思議の国のお茶会も、こんな日はちょっと屋根のある場所がいいかも...でもね、曇り空も素敵だよ！";
      emoji = "☁️🍵";
    } else {
      // その他の天気
      reaction = "今日のお空はどんな色かな？どんな天気でも、想像力で素敵な冒険ができるよ！一緒にワンダーランドの世界を探検しよう♪";
      emoji = "🌈🎠";
    }
    
    // 気温に応じたコメントを追加
    let tempComment = "";
    if (temp > 30) {
      tempComment = "うわぁ、とっても暑いね！マッドハッターのお茶会も今日は日陰でやってるかも。冷たいお飲み物で水分補給してね♪";
    } else if (temp > 25) {
      tempComment = "ぽかぽか陽気だね！お花たちも喜んでる気がするよ。たくさん遊べる素敵な日だね！";
    } else if (temp > 15) {
      tempComment = "とっても過ごしやすい温度だね！ワンダーランドを探検するにはぴったりだよ！";
    } else if (temp > 5) {
      tempComment = "ちょっと肌寒いけど、動けば気持ちいい気温だね！ポケットにマフラーを忍ばせておくといいかも♪";
    } else {
      tempComment = "ひゃっ、冷たい風が頬をつんつんするね！温かい格好でおでかけしてね。ホットティーであったまろ♪";
    }
    
    // ワンダーランドのミクのリアクションを表示
    const replyText = `**${data.name}の天気**: ${weatherDescription} (${temp}°C) ${emoji}\n\n`;
    const characterReply = `**ワンダーランドのミク**: 「${reaction}\n${tempComment}」 ${emoji}`;
    
    // 天気情報と合わせて最終的なメッセージを作成
    return message.reply(replyText + characterReply);
    
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return message.reply(`天気情報の取得中にエラーが発生しました: ${error.message}`);
  }
}