# app-pivot-table

Компонент для відображення зведених таблиць.

> Наразі може відображати тільки одну таблицю на сторінці.

## Використання

1. Додати компонент на сторінку:

    ```html
    <app-pivot-table></app-pivot-table>
    ```

2. Інжектнути сервіс `PivotTableService` в компонент, який буде відповідати за сторінку, на якій буде відображатися таблиця (`/shared/components/pivot-table/pivot-table.service`):

    ```typescript
    private readonly pivotTableService = inject(PivotTableService)
    ```

3. Викликати метод `this.pivotTableService.setDataObserver(data$)`, в який передати `Observable<TTable>` з даними для відображення в таблиці.

4. Заповнити пресет для зведеної:

* `this.pivotTableService.aggFunctions` - перелік агрегатних функцій, які будуть доступні для вибору в таблиці;
  Тип - `{ [key: string]: (val: TValue[]) => TValue }` (де key - це назва функції);
  стандартний набір функцій знаходиться в `src/app/shared/components/pivot-table/utils/aggregation.functions.ts`;
  можна додати свої функції, які повинні відповідати типу `(val: TValue[]) => TValue`

* `this.pivotTableService.aggFunctionsDescriptions` - перелік описів агрегатних функцій, які будуть доступні для вибору в таблиці;
  Назви та кількість функцій повинні відповідати переліку `this.pivotTableService.aggFunctions`;
  Використовується для відображення опису функції в інтерфейсі.

* `this.pivotTableService.aggFunctionsReverse` - перелік функцій, які будуть використовуватися для обчислення значень для відображення полотна
  (коли користувач натискає на значення в таблиці, можливе відкриття полотна з вихідними даними; ці функції використовуються для фільтрування даних для полотна);

* `this.pivotTableService.selectedValues` - список вибраних значень (стовпців) для відображення в таблиці (аналог області `Значення` у зведених Excel);

* `this.pivotTableService.selectedIndex` - список вибраних рядків для відображення в таблиці (аналог області `Рядки` у зведених Excel);

* `this.pivotTableService.selectedFilterKeys` - список вибраних фільтрів для відображення в таблиці (аналог області `Фільтри` у зведених Excel);

* `this.pivotTableService.selectedAggFunctions` - список вибраних агрегатних функцій для відображення в таблиці (аналог обраних функцій в області `Значення` у зведених Excel);
  Назви - це `key` з переліку `this.pivotTableService.aggFunctions`; Кількість функцій повинна відповідати кількості вибраних значень
  (`this.pivotTableService.selectedAggFunctions.length === this.pivotTableService.selectedValues.length`);

* `this.pivotTableService.selectedAliases` - список назв для стовпців зведеної таблиці; Кількість назв повинна відповідати кількості вибраних значень
  (`this.pivotTableService.selectedAliases.length === this.pivotTableService.selectedValues.length`);

5. EventEmitter `basicTableViewSelected` викликається, коли користувач натискає на значення у зведеній таблиці та повертає тип `{ rowName: string, col: string }`, де `rowName` - назва рядка, `col` - назва стовпця.
   Використовуючи ці дані можна відобразити полотно з вихідними даними:

    ```typescript
    private readonly basicTableService = inject(TableWithFiltersDataService);
   
   ...
   
    // відображення полотна з вихідними даними
    this.basicTableService.setData(
      fromPromise(this.pivotTableService.getParticularData(params.rowName, params.col))
    )
    ```

`getParticularData` використовує значення з `aggFunctionsReverse` для фільтрування даних для полотна.

Компонент для відображення полотна з вихідними даними:

```html

<app-table-with-filters></app-table-with-filters>
```
