#!/bin/bash
# 雙擊即開啟 Terminal 並啟動 pixel-gemini-omni 的 dev server（npm run serve）

cd "/Users/james/Documents/works/2026/2026-pixel-gemini-omni" || {
  echo "❌ 找不到專案資料夾，請確認路徑是否正確。"
  read -n 1 -s -r -p "按任意鍵關閉…"
  exit 1
}

echo "📂 專案：$(pwd)"
echo "🚀 執行：npm run serve"
echo "----------------------------------------"
npm run serve

# 若 serve 意外結束，讓視窗停住以便看錯誤訊息
echo "----------------------------------------"
echo "⚠️ serve 已結束（exit code: $?）"
read -n 1 -s -r -p "按任意鍵關閉視窗…"
