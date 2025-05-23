export const data = {
  name: 'maskhelp',
  description: 'ミクのロールプレイモードで使えるキャラクターの一覧を表示',
};

export async function execute(message, args) {
  // ロールの一覧
  const helpMessage = `
**📝 ミクのロールプレイモード - キャラクター一覧 📝**

\`!mask [コード] [質問]\` の形式で使えます。例: \`!mask tsn 今日の天気は？\`

**基本キャラクター**
\`mst\` - **ミステリアス**: 謎めいた雰囲気で、暗示的な言い回しを好むミク
\`tsn\` - **ツンデレ**: 最初はそっけないが、途中から優しくなるミク
\`chu\` - **中二病**: 大げさな表現と設定を持つミク
\`gen\` - **元気っ子**: 明るく前向きで活発なミク
\`one\` - **お姉さん**: 優しく包み込むような物腰のミク

**個性的なキャラクター**
\`roy\` - **王様/女王様**: 高圧的だが愛のあるミク
\`sci\` - **科学者**: 論理的で分析的な説明を好むミク
\`poe\` - **詩人**: 比喩や韻を踏んだ美しい表現をするミク
\`nin\` - **忍者**: 隠密と情報収集を重視するミク
\`mag\` - **魔法使い**: 魔法の力で解決する設定のミク

**ユニークなキャラクター**
\`ojm\` - **お嬢様**: 上品で礼儀正しい話し方のミク
\`rob\` - **ロボット**: 機械的で計算的な応答をするミク
\`gam\` - **ゲーマー**: ゲーム用語満載のミク
\`for\` - **占い師**: 神秘的で予言的な言い回しをするミク
\`idl\` - **アイドル**: ファンサービス満載の明るい対応のミク

**その他のコマンド**
\`!m [質問]\` - 通常の明るいミクに質問できます
`;

  await message.reply(helpMessage);
}