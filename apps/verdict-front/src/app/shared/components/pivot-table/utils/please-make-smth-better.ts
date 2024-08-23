import { pivotValueToString } from './transform.functions'
import { TTable } from '../../../models/basic-types'

export const pleaseMakeSomethingBetter = (key: string, data: TTable): { [key: string]: string[] } => {
  switch (key) {
    case 'Відкриті ВП по активним ПВ Пріоритетні справи':
      return {
        ['Вид сводної']: ['Активний ПВ'],
        ['Пріоритетні справи']: ['1'],
        ['Актуальний реєстр']: data
          .map((row) => pivotValueToString(row['Актуальний реєстр']))
          .filter((value) => !['0'].includes(value)),
        ['Стан ВП']: data
          .map((row) => pivotValueToString(row['Стан ВП']))
          .filter((value) => !['Відмовлено у відкритті', 'Завершено'].includes(value)),
        ['Група колекшн']: data
          .map((row) => pivotValueToString(row['Група колекшн']))
          .filter((value) => !['ЗВП', 'Сторона не замінена', 'Не наше ВП'].includes(value))
      }
    case 'Відкриті ВП по активним ПВ Непріоритетні справи':
      return {
        ['Вид сводної']: ['Активний ПВ'],
        ['Актуальний реєстр']: data
          .map((row) => pivotValueToString(row['Актуальний реєстр']))
          .filter((value) => !['0'].includes(value)),
        ['Пріоритетні справи']: ['0'],
        ['Стан ВП']: data
          .map((row) => pivotValueToString(row['Стан ВП']))
          .filter((value) => !['Відмовлено у відкритті', 'Завершено'].includes(value)),
        ['Група колекшн']: data
          .map((row) => pivotValueToString(row['Група колекшн']))
          .filter((value) => !['ЗВП', 'Сторона не замінена', 'Не наше ВП'].includes(value))
      }
    case 'Відкриті ВП по неактивним ПВ':
      return {
        ['Вид сводної']: ['Неактивний ПВ'],
        ['Актуальний реєстр']: ['1'],
        ['Стан ВП']: data
          .map((row) => pivotValueToString(row['Стан ВП']))
          .filter((value) => !['Відмовлено у відкритті', 'Завершено'].includes(value)),
        ['Група колекшн']: data
          .map((row) => pivotValueToString(row['Група колекшн']))
          .filter((value) => !['ЗВП', 'Сторона не замінена', 'Не наше ВП'].includes(value))
      }
    case 'Відкриті ВП по ДВС':
      return {
        ['Вид сводної']: ['ДВС'],
        ['Актуальний реєстр']: data
          .map((row) => pivotValueToString(row['Актуальний реєстр']))
          .filter((value) => !['0'].includes(value)),
        ['Стан ВП']: data
          .map((row) => pivotValueToString(row['Стан ВП']))
          .filter((value) => !['Відмовлено у відкритті', 'Завершено'].includes(value)),
        ['Група колекшн']: data
          .map((row) => pivotValueToString(row['Група колекшн']))
          .filter((value) => !['ЗВП', 'Сторона не замінена', 'Не наше ВП'].includes(value))
      }
    case 'Відкриті ВП де не замінено сторону':
      return {
        ['Актуальний реєстр']: data
          .map((row) => pivotValueToString(row['Актуальний реєстр']))
          .filter((value) => !['0', '(пусті)'].includes(value)),
        ['Стан ВП']: data
          .map((row) => pivotValueToString(row['Стан ВП']))
          .filter((value) => !['Відмовлено у відкритті', 'Завершено'].includes(value)),
        ['Група колекшн']: ['Сторона не замінена']
      }
    case 'Торги без іпотеки по листам':
      return {
        ['Активний ПВ']: ['1'],
        ['Тип ВД']: ['Виконавчий лист'],
        ['Тип лота 2']: data
          .map((row) => pivotValueToString(row['Тип лота 2']))
          .filter((value) => !['Заставне майно(іпотека)'].includes(value))
      }
    case 'Торги без іпотеки по написам':
      return {
        ['Активний ПВ']: ['1'],
        ['Тип ВД']: ['Виконавчий напис'],
        ['Тип лота 2']: data
          .map((row) => pivotValueToString(row['Тип лота 2']))
          .filter((value) => !['Заставне майно(іпотека)'].includes(value))
      }
    case 'Черга майна на опрацювання по написам':
      return {
        ['Актуальний реєстр']: data.map(row => pivotValueToString(row['Актуальний реєстр'])).filter(value => !['0', '(пусті)'].includes(value)),
        ['Тип ВД']: ['Виконавчий напис'],
        ['СЛ Категория']: data
          .map((row) => pivotValueToString(row['СЛ Категория']))
          .filter((value) => !['вечный СЛ – работа полностью остановлена'].includes(value)),
        ['Група колекшн']: data
          .map((row) => pivotValueToString(row['Група колекшн']))
          .filter((value) => !['ЗВП', 'Сторона не замінена', 'Не наше ВП'].includes(value)),
        ['Стан ВП']: data
          .map((row) => pivotValueToString(row['Стан ВП']))
          .filter((value) => !['Відмовлено у відкритті', 'Завершено', '(пусті)'].includes(value)),
        ['Тип майна']: data
          .map((row) => pivotValueToString(row['Тип майна']))
          .filter((value) => !['Не брати в роботу'].includes(value))
      }
    case 'Черга майна на опрацювання по листам':
      return {
        ['Актуальний реєстр']: data
          .map((row) => pivotValueToString(row['Актуальний реєстр']))
          .filter((value) => !['0', '(пусті)'].includes(value)),
        ['Тип ВД']: data
          .map((row) => pivotValueToString(row['Тип ВД']))
          .filter((value) => !['Виконавчий напис'].includes(value)),
        ['СЛ Категория']: data
          .map((row) => pivotValueToString(row['СЛ Категория']))
          .filter((value) => !['вечный СЛ – работа полностью остановлена'].includes(value)),
        ['Група колекшн']: data
          .map((row) => pivotValueToString(row['Група колекшн']))
          .filter((value) => !['ЗВП', 'Сторона не замінена', 'Не наше ВП'].includes(value)),
        ['Стан ВП']: data
          .map((row) => pivotValueToString(row['Стан ВП']))
          .filter((value) => !['Відмовлено у відкритті', 'Завершено', '(пусті)'].includes(value)),
        ['Тип майна']: data
          .map((row) => pivotValueToString(row['Тип майна']))
          .filter((value) => !['Не брати в роботу'].includes(value))
      }
    case 'Черга на опис нерухомості по написам':
      return {
        ['Актуальний реєстр']: data
          .map((row) => pivotValueToString(row['Актуальний реєстр']))
          .filter((value) => !['0', '(пусті)'].includes(value)),
        ['Стан ВП']: data
          .map((row) => pivotValueToString(row['Стан ВП']))
          .filter((value) => !['Відмовлено у відкритті', 'Завершено'].includes(value)),
        ['Тип ВД']: ['Виконавчий напис'],
        ['СЛ Категория']: data
          .map((row) => pivotValueToString(row['СЛ Категория']))
          .filter((value) => !['вечный СЛ – работа полностью остановлена'].includes(value)),
        ['Група колекшн']: data
          .map((row) => pivotValueToString(row['Група колекшн']))
          .filter((value) => !['ЗВП', 'Сторона не замінена', 'Не наше ВП'].includes(value)),
        ['Статус по опрацюванню']: ['Запланирована опись'],
        ['Опрацьовано']: ['1'],
        ['Тип майна']: data
          .map((row) => pivotValueToString(row['Тип майна']))
          .filter((value) => !['Не брати в роботу'].includes(value))
      }
    case 'Черга на опис нерухомості по листам':
      return {
        ['Актуальний реєстр']: data
          .map((row) => pivotValueToString(row['Актуальний реєстр']))
          .filter((value) => !['0', '(пусті)'].includes(value)),
        ['Стан ВП']: data
          .map((row) => pivotValueToString(row['Стан ВП']))
          .filter((value) => !['Відмовлено у відкритті', 'Завершено'].includes(value)),
        ['Тип ВД']: data
          .map((row) => pivotValueToString(row['Тип ВД']))
          .filter((value) => !['Виконавчий напис'].includes(value)),
        ['СЛ Категория']: data
          .map((row) => pivotValueToString(row['СЛ Категория']))
          .filter((value) => !['вечный СЛ – работа полностью остановлена'].includes(value)),
        ['Група колекшн']: data
          .map((row) => pivotValueToString(row['Група колекшн']))
          .filter((value) => !['ЗВП', 'Сторона не замінена', 'Не наше ВП'].includes(value)),
        ['Статус по опрацюванню']: ['Запланирована опись'],
        ['Опрацьовано']: ['1'],
        ['Тип майна']: data
          .map((row) => pivotValueToString(row['Тип майна']))
          .filter((value) => !['Не брати в роботу'].includes(value))
      }
    case 'Черга На опис нерухомості по написам':
      return {
        ['Актуальний реєстр']: data
          .map((row) => pivotValueToString(row['Актуальний реєстр']))
          .filter((value) => !['0', '(пусті)'].includes(value)),
        ['Стан ВП']: data
          .map((row) => pivotValueToString(row['Стан ВП']))
          .filter((value) => !['Відмовлено у відкритті', 'Завершено'].includes(value)),
        ['Тип ВД']: ['Виконавчий напис'],
        ['СЛ Категория']: data
          .map((row) => pivotValueToString(row['СЛ Категория']))
          .filter((value) => !['вечный СЛ – работа полностью остановлена'].includes(value)),
        ['Група колекшн']: data
          .map((row) => pivotValueToString(row['Група колекшн']))
          .filter((value) => !['ЗВП', 'Сторона не замінена', 'Не наше ВП'].includes(value)),
        ['Опрацьовано']: ['1'],
        ['Тип майна']: data
          .map((row) => pivotValueToString(row['Тип майна']))
          .filter((value) => !['Не брати в роботу'].includes(value))
      }
    case 'Черга На опис нерухомості по листам':
      return {
        ['Актуальний реєстр']: data
          .map((row) => pivotValueToString(row['Актуальний реєстр']))
          .filter((value) => !['0', '(пусті)'].includes(value)),
        ['Стан ВП']: data
          .map((row) => pivotValueToString(row['Стан ВП']))
          .filter((value) => !['Відмовлено у відкритті', 'Завершено'].includes(value)),
        ['Тип ВД']: data
          .map((row) => pivotValueToString(row['Тип ВД']))
          .filter((value) => !['Виконавчий напис'].includes(value)),
        ['СЛ Категория']: data
          .map((row) => pivotValueToString(row['СЛ Категория']))
          .filter((value) => !['вечный СЛ – работа полностью остановлена'].includes(value)),
        ['Група колекшн']: data
          .map((row) => pivotValueToString(row['Група колекшн']))
          .filter((value) => !['ЗВП', 'Сторона не замінена', 'Не наше ВП'].includes(value)),
        ['Опрацьовано']: ['1'],
        ['Тип майна']: data
          .map((row) => pivotValueToString(row['Тип майна']))
          .filter((value) => !['Не брати в роботу'].includes(value))
      }
    default:
      return {}
  }
}

