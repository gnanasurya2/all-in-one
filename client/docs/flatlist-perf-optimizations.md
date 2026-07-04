# FlatList Scroll Performance Optimizations

## Problem

The expense list had noticeably poor scroll performance. Items were re-rendering unnecessarily and too many items were being held in memory/rendered at once.

---

## Root Causes & Fixes

### 1. FlatList Not Tuned for Performance (`HomeScreen.tsx`)

**Problem:** FlatList ships with conservative defaults designed for correctness, not speed.

- `windowSize` defaults to `21` — meaning 10 viewports above and below the current view are kept rendered. For a list of transactions, that's a huge amount of components alive at once.
- `maxToRenderPerBatch` defaults to `10` — rendering 10 new items per JS frame causes visible jank when scrolling fast.
- No `removeClippedSubviews` — offscreen items stay attached to the native view hierarchy.

**Fix:**
```tsx
<FlatList
  ...
  maxToRenderPerBatch={5}   // render 5 items per batch instead of 10
  windowSize={5}            // keep 2 viewports above/below instead of 10
  initialNumToRender={10}   // start with 10 visible items
  removeClippedSubviews     // detach offscreen items from native view tree
/>
```

`windowSize={5}` alone is the biggest win — it drops the number of live components from ~21 screens worth to 5.

---

### 2. Inline Callbacks in `renderItem` Defeated `memo` (`HomeScreen.tsx`)

**Problem:** The original `renderItem` created brand-new arrow functions on every call:

```tsx
// Before — new function refs created every time renderItem runs
const renderItem = useCallback(({ item }) => (
  <Transcation
    {...item}
    onEditPressed={() => navigation.navigate('Create', { data: { ...item } })}
    onDeletePressed={async () => await deleteExpenseAync(item.id)}
  />
), [deleteExpenseAync, navigation]);
```

`Transcation` is wrapped in `memo`, but `memo` does a shallow prop comparison. Since `onEditPressed` and `onDeletePressed` are new function references every time `renderItem` runs (e.g., when `isCalenderOpen` toggles and HomeScreen re-renders), `memo` always sees changed props and re-renders every visible item.

**Fix:** A `TranscationItem` wrapper component with stable, memoized callbacks:

```tsx
const TranscationItem = memo(({ item, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => onEdit(item), [onEdit, item]);
  const handleDelete = useCallback(() => onDelete(item.id), [onDelete, item.id]);
  return (
    <Transcation {...item} onEditPressed={handleEdit} onDeletePressed={handleDelete} />
  );
});

// Stable list-level handlers — only recreated if navigation/deleteExpenseAync change
const handleEdit = useCallback((item) =>
  navigation.navigate('Create', { data: { ...item } }), [navigation]);

const handleDelete = useCallback((id) => {
  deleteExpenseAync(id);
}, [deleteExpenseAync]);

const renderItem = useCallback(({ item }) => (
  <TranscationItem item={item} onEdit={handleEdit} onDelete={handleDelete} />
), [handleEdit, handleDelete]);
```

Now `Transcation` only re-renders when the item's actual data changes — not on every HomeScreen state update.

---

### 3. Inline Style Object in `Transcation` (`components/Transcation/index.tsx`)

**Problem:**

```tsx
// Before — new object allocated on every render
<View style={{backgroundColor: SURFACE_COLORS.PAGE}}>
```

Every render creates a new object `{backgroundColor: ...}`. This is a minor but unnecessary allocation per item per render.

**Fix:** Move to `StyleSheet.create`:

```tsx
// After
<View style={styles.innerWrapper}>

// In StyleSheet:
innerWrapper: {
  backgroundColor: SURFACE_COLORS.PAGE,
},
```

`StyleSheet.create` registers styles natively and compares by ID, not by object reference.

---

### 4. Unstable Render Action Callbacks in `CustomSwipeable` (`components/Transcation/CustomSwipeable.tsx`)

**Problem:** The swipe action renderers were inline arrow functions:

```tsx
// Before — new function on every CustomSwipeable render
renderRightActions={(_, progress) =>
  renderRightActions({progress, onRightActionPressed})
}
```

`Swipeable` (from RNGH) may use these as effect/memo dependencies internally. New references on every render prevent stable diffing.

**Fix:** Wrap with `useCallback`:

```tsx
const handleRightActions = useCallback(
  (_, progress) => renderRightActions({progress, onRightActionPressed}),
  [onRightActionPressed],
);

const handleLeftActions = useCallback(
  (_, progress) => renderLeftActions({progress, onLeftActionPressed}),
  [onLeftActionPressed],
);
```

Because `onRightActionPressed` and `onLeftActionPressed` are now stable (from `TranscationItem`'s `useCallback`), these render functions are also stable across renders.

---

## Summary of Changes

| File | Change | Impact |
|------|--------|--------|
| `HomeScreen.tsx` | FlatList `windowSize`, `maxToRenderPerBatch`, `removeClippedSubviews` | Fewer items rendered, less memory, smoother scroll |
| `HomeScreen.tsx` | `TranscationItem` wrapper with stable `useCallback` handlers | Prevents re-renders on unrelated HomeScreen state changes |
| `Transcation/index.tsx` | Moved inline style to `StyleSheet` | Removes per-render object allocation |
| `CustomSwipeable.tsx` | `useCallback` for render action functions | Stable swipe action references |

---

## What Was Already Good

- `Transcation` was already wrapped in `memo` ✓
- `keyExtractor` was already wrapped in `useCallback` ✓
- `renderItem` was already wrapped in `useCallback` ✓
- Date/amount formatting in `Transcation` was already inside `useMemo` ✓
- Swipe animations run on the UI thread via Reanimated (not JS thread) ✓
