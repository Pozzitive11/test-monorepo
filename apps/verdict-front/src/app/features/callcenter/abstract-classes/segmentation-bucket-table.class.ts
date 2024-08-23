import { BucketData, PhoneBucketData, SegmentationBucketTableModel } from '../models/report-models'
import { SegmentationTableSort } from './segmentation-table-sort.class'


export abstract class SegmentationBucketTable extends SegmentationTableSort {
  abstract shownData: SegmentationBucketTableModel[]
  abstract reportData: SegmentationBucketTableModel[]

  changeSortType(column: string): void {
    // Сохраняем тип сортировки
    const leftRight = this.saveSorts(column)
    let left = leftRight.left
    let right = leftRight.right

    // Сортируем
    switch (column) {
      case 'Проєкт':
        this.shownData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.project > b.project ? right : left
        })
        break

      case 'Кількість КД':
        this.shownData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.ContractCount > b.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.ContractCount ? left : right
        })
        break

      case 'Кількість КД % від проєкту':
        this.shownData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.ContractCountProjectPercent > b.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.ContractCountProjectPercent ? left : right
        })
        break

      case 'Тіло':
        this.shownData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.SumDelayBody > b.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.SumDelayBody ? left : right
        })
        break

      case 'Outstanding':
        this.shownData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.Outstanding > b.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.Outstanding ? left : right
        })
        break

      case 'Відсотки':
        this.shownData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.BalancePercent > b.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.BalancePercent ? left : right
        })
        break

      case 'Тіло %':
        this.shownData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.SumDelayBodyPercent > b.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.SumDelayBodyPercent ? left : right
        })
        break

      case 'Доля %':
        this.shownData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.DebtPartPercent > b.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.DebtPartPercent ? left : right
        })
        break

      case 'Тіло_avg':
        this.shownData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.BodyAvg > b.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.BodyAvg ? left : right
        })
        break

      case 'Outstanding_avg':
        this.shownData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.OutstandingAvg > b.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.OutstandingAvg ? left : right
        })
        break

      case 'DPD_avg':
        this.shownData.sort((a, b) => {
          if (a.project.includes('Всього')) return 2
          return a.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.DpdAvg > b.phoneData.slice(-1)[0].bucketData.slice(-1)[0].data.DpdAvg ? left : right
        })
        break
    }
  }

  hideAllProjects(): void {
    let isHidden: boolean = false
    for (let projectRow of this.reportData) {
      for (let phoneData of projectRow.phoneData) {
        if (phoneData.hidden) {
          isHidden = true
          break
        }
      }
      if (isHidden) break
    }

    for (let projectRow of this.reportData) {
      if (projectRow.project.includes('Всього'))
        continue
      for (let phoneData of projectRow.phoneData) {
        if (!phoneData.PhonePresence.includes('Всього'))
          phoneData.hidden = !isHidden
      }
    }
  }

  hideAllPhones(): void {
    let isHidden: boolean = false
    for (let projectRow of this.reportData) {
      for (let phoneRow of projectRow.phoneData) {
        for (let bucketRow of phoneRow.bucketData)
          if (bucketRow.hidden || phoneRow.hidden) {
            isHidden = true
            break
          }
        if (isHidden) break
      }
      if (isHidden) break
    }

    for (let projectRow of this.reportData) {
      if (projectRow.project.includes('Всього'))
        continue
      for (let phoneRow of projectRow.phoneData) {
        if (phoneRow.PhonePresence.includes('Всього'))
          continue
        if (isHidden)
          phoneRow.hidden = !isHidden
        for (let bucketData of phoneRow.bucketData) {
          if (!bucketData.bucket.includes('Всього'))
            bucketData.hidden = !isHidden
        }
      }
    }
  }

  hideAllSomething(column: string): void {
    switch (column) {
      case 'Проєкт':
        this.hideAllProjects()
        this.updateShownData()
        break
      case 'Наявність актуального телефону':
        this.hideAllPhones()
        this.updateShownData()
        break
    }
  }

  countProjectLength(projectRow: SegmentationBucketTableModel): number {
    return projectRow.phoneData.reduce(
      (acc, obj) => {
        return acc + obj.bucketData.length
      }, 0
    )
  }

  hidePhoneRow(phoneRow: PhoneBucketData, projectRow: SegmentationBucketTableModel): void {
    if (phoneRow.PhonePresence.includes('Всього') || projectRow.project.includes('Всього'))
      return

    for (let projectData of this.reportData) {
      if (projectData.project !== projectRow.project)
        continue

      for (let phoneData of projectData.phoneData) {
        if (phoneData.PhonePresence !== phoneRow.PhonePresence)
          continue

        for (let bucketData of phoneData.bucketData) {
          if (!bucketData.bucket.includes('Всього'))
            bucketData.hidden = !bucketData.hidden
        }
      }
    }

    this.updateShownData()
  }

  hideProjectRow(projectRow: SegmentationBucketTableModel): void {
    if (projectRow.project.includes('Всього'))
      return

    for (let projectData of this.reportData) {
      if (projectData.project !== projectRow.project)
        continue

      for (let phoneData of projectData.phoneData) {
        if (phoneData.PhonePresence.includes('Всього'))
          continue

        phoneData.hidden = !phoneData.hidden
      }
    }

    this.updateShownData()
  }

  updateShownData(): void {
    this.shownData = []
    for (let projectData of this.reportData) {
      let shownPhoneData: PhoneBucketData[] = []
      for (let phoneData of projectData.phoneData) {
        let shownBucketData: BucketData[] = []
        for (let bucketData of phoneData.bucketData)
          if (!bucketData.hidden)
            shownBucketData.push(bucketData)

        if (!phoneData.hidden)
          shownPhoneData.push({
            PhonePresence: phoneData.PhonePresence,
            bucketData: shownBucketData,
            hidden: phoneData.hidden
          })
      }

      this.shownData.push({
        project: projectData.project,
        phoneData: shownPhoneData
      })
    }
  }
}
