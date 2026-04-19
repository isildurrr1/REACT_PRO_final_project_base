# homework-react-21951242

## Запуск проекта локально:

- `npm i` - установка зависимостей
- `npm run start` - запуск проекта
- `npm run build` - сборка через Webpack
- `npm run build:esbuild` - сборка через esbuild

---

## Итоговый проект — 20 баллов

### Задача 1 — Архитектура и структура (4 балла)

Все компоненты из `shared/ui` стали **чисто презентационными** — убраны все хуки Redux/RTK Query.
Бизнес-логика вынесена в `src/4-features/`:

```
src/
├── 1-app/          App.tsx, провайдеры, роутер
├── 2-pages/        страницы (CartPage, ProductPage, HomePage, ...)
├── 3-widgets/      Header, Footer, CardList
├── 4-features/
│   ├── auth/         ui/(SignInForm, SignUpForm), utils/, index.ts
│   ├── cart/         ui/CartCounterFeature.tsx, hooks/useCartCounter.ts, index.ts
│   ├── favorites/    ui/LikeButtonFeature.tsx, hooks/useLikeToggle.ts, index.ts
│   ├── products/     ui/(CardFeature, SortFeature, CreateProductForm), hooks/useSort.ts, index.ts
│   ├── search/       ui/SearchFeature.tsx, hooks/useProductsSearch.ts, index.ts
│   └── reviews/      ui/(ReviewList, ReviewForm), index.ts
└── 5-shared/       ui/(Card, CartCounter, LikeButton, Modal, ...), store, api, utils
```

Каждый компонент в `shared/ui` принимает только пропсы и не знает о Redux:
- `LikeButton` → принимает `isLiked`, `onToggle`, `disabled`
- `CartCounter` → принимает `count`, `stock`, `onIncrement`, `onDecrement`, `onChange`
- `Card` → принимает `product`, `isLiked`, `onToggleLike`, `isInCart`, `cartCount`, `stock` и колбэки
- `Search` → принимает `value`, `onChange`, `onClear`
- `Sort` → принимает `value`, `options`, `onChange`

Умные feature-обёртки (`CardFeature`, `LikeButtonFeature`, `CartCounterFeature`, `SearchFeature`, `SortFeature`) содержат бизнес-логику и передают данные вниз через пропсы.

### Задача 2 — Оптимизация рендеров (4 балла)

**React.memo** обёрнуты:
- `Card`, `CartCounter`, `LikeButton`, `Rating` — предотвращают лишние перерисовки грида
- `CartItem` — обёрнут в `memo`, колбэк `onDelete` передаётся стабильным
- `CardFeature` — обёрнут в `memo`

**useCallback** в `CartList`:
```tsx
const handleDelete = useCallback((id: string) => {
  dispatch(cartActions.deleteCartProduct(id));
}, [dispatch]);
```
Без `useCallback` `CartItem` перерисовывался бы при каждом ре-рендере `CartList`, даже если корзина не менялась — потому что каждый раз создавался новый объект функции.

**useMemo** для суммы корзины в `CartAmount`:
```tsx
const { allPrice, allDiscount } = useMemo(
  () => ({
    allPrice: products.reduce((acc, p) => p.price * p.count + acc, 0),
    allDiscount: products.reduce((acc, p) => p.discount * p.count + acc, 0),
  }),
  [products]
);
```

**Targeted селекторы** в `CardFeature` и `useCartCounter`:
```tsx
useAppSelector((state) =>
  cartSelectors.getCartProducts(state).find((p) => p.id === product.id)
);
```
Вместо `getCartProducts` (весь массив) — только конкретный товар. Остальные карточки не ре-рендерятся.

**Profiler-hotspot:** `Card` вызывал `useAppSelector(cartSelectors.getCartProducts)` напрямую → весь список карточек перерисовывался при любом изменении корзины. После разделения на `CardFeature` (умный, `memo`) + `Card` (презентационный, `memo`) — ре-рендерится только конкретная карточка.

### Задача 3 — React.Portal для модального окна (3 балла)

Компонент `src/5-shared/ui/Modal/ui/Modal.tsx` создаётся через `createPortal` в `#modal-root` (добавлен в `public/index.html`).

Функциональность:
- Закрытие по **ESC** (useEffect + addEventListener)
- Закрытие по **клику на оверлей** (проверка `e.target === e.currentTarget`)
- Управление **фокусом**: при открытии фокус идёт на кнопку «×», при закрытии — возвращается на элемент-триггер через `triggerRef`

Применено на странице товара: клик по фото → открывается увеличенное изображение в модалке. Zoom доступен только при успешно загрузившемся изображении (не placeholder).

### Задача 4 — useRef (2 балла)

**Автофокус** в `features/auth/ui/SignInForm.tsx`:
```tsx
const emailInputRef = useRef<HTMLInputElement>(null);
useEffect(() => { emailInputRef.current?.focus(); }, []);
// <TextField inputRef={emailInputRef} ... />
```

**Управление ref-ом триггера** в `ProductPage.tsx`:
```tsx
const imgButtonRef = useRef<HTMLButtonElement>(null);
// передаётся в Modal как triggerRef — при закрытии фокус возвращается на кнопку
```
`useRef` не вызывает ре-рендер при изменении значения (в отличие от `useState`) — именно для этого используется для хранения DOM-ссылок.

### Задача 5 — esbuild (2 балла)

Файл `esbuild.config.js` в корне проекта. Запуск: `npm run build:esbuild`.

Плагины:
- `esbuild-css-modules-plugin` — поддержка CSS Modules
- Кастомный `svgrPlugin` — конвертирует SVG в React-компоненты (`{ ReactComponent as X }`) + экспортирует data URL для дефолтных импортов

| Сборщик | Время | Размер dist |
|---------|-------|-------------|
| Webpack 5 | ~5.5 с | 709 КБ (JS + CSS) |
| esbuild | ~1.1 с | 1.16 МБ* |

\* esbuild без code splitting по чанкам CSS и tree shaking библиотек даёт больший итоговый размер, но JS бандл генерируется в ~5× быстрее.

**Вывод:** esbuild кардинально быстрее. Для локальной разработки и CI — идеальный выбор. Для продакшна с оптимальным размером предпочтительнее Webpack.

### Задача 6 — React 19 + useOptimistic (3 балла)

React обновлён до **19.x** (package.json с `overrides` для peer-deps MUI/emotion).

`useOptimistic` + `useTransition` реализованы в `features/favorites/hooks/useLikeToggle.ts`:

```tsx
// stableIsLiked — локальное состояние, источник истины для useOptimistic.
// При успехе обновляется ВНУТРИ transition до его завершения —
// useOptimistic откатывается к уже актуальному значению (без мигания).
const [stableIsLiked, setStableIsLiked] = useState(actualIsLiked);
useEffect(() => { setStableIsLiked(actualIsLiked); }, [actualIsLiked]);

const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(stableIsLiked);
const [isPending, startTransition] = useTransition();

const toggleLike = () => {
  const next = !stableIsLiked;
  startTransition(async () => {
    setOptimisticIsLiked(next);           // мгновенный UI
    const response = next
      ? await setLike({ id })
      : await deleteLike({ id });
    if (!response.error) {
      setStableIsLiked(next);             // нет отката при завершении transition
    } else {
      toast.error('Не удалось обновить'); // откат автоматически через useOptimistic
    }
  });
};
```

**UX-эффект:** нажатие на сердечко → иконка заполняется **мгновенно**. При ошибке — автоматический откат к предыдущему состоянию + toast.error. Без `useOptimistic` — визуальный лаг 200-500 мс до ответа сервера.
