# 가계부 · 螺鈿帳簿

수입·지출을 한 줄씩 적어두는 아주 단순한 가계부. 기록은 서버로 나가지 않고 **브라우저 localStorage에만** 남는다.

**→ https://huhsame-gagyebu.vercel.app**

```bash
npm run dev
```

→ http://localhost:3000

`main`에 push하면 Vercel이 알아서 프로덕션에 다시 올린다.

## 할 수 있는 것

- 지출 / 수입 기입 (날짜 · 카테고리 · 금액 · 메모)
- 달 단위로 넘겨보기 (`‹` `›`, "this month"로 복귀)
- 그 달의 수입 · 지출 · 남은 돈 합계
- 카테고리별 지출 비중(도넛) · 날짜별 흐름(막대)
- 기록 지우기 (행 오른쪽 ✕)

## 겉모습

나전칠기(螺鈿) — 흑칠 바탕에 자개 광택이 흐르고 금박이 얹힌 장부.

- 배경에서 자개빛 덩어리 여섯이 돌며 숨쉰다 (`mix-blend-mode: screen`으로 어두운 바탕 위에서 발광)
- 표제·소제목은 금박 그라디언트가 훑고 지나간다 (`.gilt`)
- 기입하면 엽전이 터진다 (canvas, 중력 + 회전)
- 합계 카드와 기입 폼은 마우스를 따라 기울고 광원이 따라온다
- `prefers-reduced-motion`을 켜면 전부 멈춘다

## 구조

| 경로 | 역할 |
| --- | --- |
| `src/app/page.tsx` | 상태(거래 목록·선택한 달)와 화면 조립 |
| `src/app/globals.css` | 테마 변수 · 옻칠 표면 · 모션 정의 |
| `src/lib/ledger.ts` | 타입 · 카테고리 · localStorage 입출력 · 집계 · 포맷 |
| `src/hooks/use-tilt.ts` | 마우스 위치 → 기울기·광원 CSS 변수 |
| `src/components/entry-form.tsx` | 기입 폼 |
| `src/components/summary-band.tsx` | 월 합계 카드 3장 |
| `src/components/ledger-table.tsx` | 장부 목록 |
| `src/components/spend-donut.tsx` | 카테고리별 지출 도넛 |
| `src/components/day-bars.tsx` | 날짜별 수입·지출 막대 |
| `src/components/count-up.tsx` | 굴러가는 숫자 |
| `src/components/coin-burst.tsx` | 엽전 파티클 (canvas) |
| `src/components/lacquer-backdrop.tsx` | 자개 배경 · 커서 광원 |

Next.js 16 (App Router · Turbopack) + React 19 + Tailwind v4.

## 메모

- 데이터는 `ggb.ledger.v1` 키로 저장된다. 브라우저를 바꾸면 따라가지 않는다.
- 서버·DB·로그인은 없다. 여러 기기에서 쓰려면 그때 붙이면 된다.
- dev 스크립트는 HTTP 헤더 한도를 64KB로 올려 띄운다. localhost 쿠키는 포트를 가리지 않아서 다른 dev 서버들이 쌓아둔 쿠키까지 함께 실려오고, Node 기본값 16KB를 넘으면 431이 난다.
