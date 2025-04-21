import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const data = {
  name: 'help',
  description: '現在のコマンド一覧を表示',
};

export async function execute(message, args) {
  try {
    // コマンドファイルが格納されているディレクトリのパス
    const commandsPath = path.resolve('./src/commands');
    
    // コマンドファイルを読み込み、.js ファイルのみフィルタ
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    // ヘルプメッセージの作成
    let helpMessage = "```\n📚 ミクDayo! Bot コマンド一覧 📚\n\n";
    
    // 各コマンドファイルを読み込み、情報を追加
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      try {
        const command = await import(pathToFileURL(filePath).href);
        if (command.data && command.data.name) {
          // コマンド名と説明を追加
          helpMessage += `!${command.data.name} - ${command.data.description || 'No description'}\n`;
        }
      } catch (importError) {
        console.error(`Error importing command file ${file}:`, importError);
      }
    }
    
    helpMessage += "\n使い方: !コマンド名\n例: !slot\n```";
    
    // ヘルプメッセージを送信
    await message.reply(helpMessage);
    
  } catch (error) {
    console.error("Error generating help command:", error);
    await message.reply("コマンド一覧の生成中にエラーが発生しました。");
  }
}
