# LiquidGlassButton

自成一包的液態玻璃按鈕。**整個資料夾複製走即可用**,唯一相依是 React(18+)。

```
LiquidGlassButton/
├─ LiquidGlassButton.tsx    元件
├─ LiquidGlassButton.css    純 CSS(一般 class 名稱,前綴 lgb-)
├─ index.ts                 匯出點
└─ README.md
```

## 使用

把整個資料夾放進你的專案(例如 `src/components/LiquidGlassButton/`),然後:

```tsx
import { LiquidGlassButton } from './components/LiquidGlassButton'

// 清透玻璃水珠
<LiquidGlassButton size={200} onClick={() => {}}>Get started</LiquidGlassButton>

// 會像水一樣蠕動的長藥丸
<LiquidGlassButton shape="pill" size={104} width={420}>
  沒問題！下載影片　›
</LiquidGlassButton>

// 帶底色的彩色玻璃藥丸(自動加光澤 + 陰影)
<LiquidGlassButton shape="pill" size={104} width={420} color="#ea7d68">
  沒問題！下載影片　›
</LiquidGlassButton>

// 跟 parent 寬度走
<LiquidGlassButton shape="pill" size={104} width="100%">
  沒問題！下載影片　›
</LiquidGlassButton>
```

CSS 會由元件自動 `import`,不需要額外設定(專案要能 import `.css`——Vite / Next.js / CRA 皆可)。

> 折射效果需要**按鈕背後有內容**(漸層、圖片、色塊)才看得出來。
> Chrome/Edge 完整;Safari 折射較弱;Firefox 會退化成霧面玻璃(仍有形狀、光澤、蠕動、水波)。

## 主要 props

| prop                                      | 型別                            | 預設                     | 說明                                          |
| ----------------------------------------- | ------------------------------- | ------------------------ | --------------------------------------------- |
| `children` / `label`                      | `ReactNode`                     | `"Get started"`          | 按鈕文字                                      |
| `onClick`                                 | `() => void`                    | —                        | 點擊事件                                      |
| `shape`                                   | `'blob' \| 'pill'`              | `'blob'`                 | 水珠 or 長藥丸                                |
| `size`                                    | `number`                        | `180`                    | blob＝直徑;pill＝高度                         |
| `width`                                   | `number \| string`              | `100%`                   | pill 長度,可傳 `320` 或 `100%` 這類 CSS width |
| `color`                                   | `string`                        | —                        | 底色(設了就變彩色玻璃藥丸 + 陰影)             |
| `rotate` / `rotateSpeed`                  | `boolean` / `number`            | `true` / `12`            | blob 旋轉蠕動                                 |
| `wobble` / `wobbleAmount` / `wobbleSpeed` | `boolean` / `number` / `number` | `true` / `0.045` / `1.1` | pill 水波蠕動                                 |
| `blur` / `refraction` / `tint`            | `number`                        | `12` / `2.5` / `0.12`    | 玻璃質感                                      |
| `specular` / `ripple`                     | `boolean`                       | `true`                   | 鏡面高光 / 點擊水波                           |
| `className` / `style` / `aria-label`      | —                               | —                        | 一般覆寫                                      |

尊重 `prefers-reduced-motion`:使用者關動畫時,旋轉/水波/點擊水波都會自動停用。
