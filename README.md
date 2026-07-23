# 가계부 · 家計簿

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
- 기록 지우기 (행 오른쪽 ✕)

## 구조

| 경로 | 역할 |
| --- | --- |
| `src/app/page.tsx` | 상태(거래 목록·선택한 달)와 화면 조립 |
| `src/lib/ledger.ts` | 타입 · 카테고리 · localStorage 입출력 · 포맷 |
| `src/components/entry-form.tsx` | 기입 영수증 |
| `src/components/summary-band.tsx` | 월 합계 |
| `src/components/ledger-table.tsx` | 장부 목록 |

Next.js 16 (App Router · Turbopack) + React 19 + Tailwind v4.

## 메모

- 데이터는 `ggb.ledger.v1` 키로 저장된다. 브라우저를 바꾸면 따라가지 않는다.
- 서버·DB·로그인은 없다. 여러 기기에서 쓰려면 그때 붙이면 된다.
