export interface ProjectRnumberRowModel {
  ProjectName: string             // 'Проєкт',
  RNumber: number | string        // 'Номер реєстру',

  ProjectNum: number              // порядковый номер проекта в таблице
  ReestrNum: number               // порядковый номер реестра в таблице
  RowNum: number                  // порядковый номер строки
}


export interface ProjectRnumberTableModel {
  column_names: string[]
  rows: ProjectRnumberRowModel[]
}


export abstract class ProjectRnumberTable {
  reportData?: ProjectRnumberTableModel
  hiddenRows: number[] = []

  // PROJECTS STUFF

  getProjectLen(ProjectNum: number): number {
    if (!this.reportData) return 0

    let len = this.reportData.rows.filter(
      (reportRow) => {
        return reportRow.ProjectNum === ProjectNum
          && !this.hiddenRows.includes(reportRow.RowNum)
          && !reportRow.ProjectName.includes('Всього')
      }
    ).length

    return len > 0 ? len : 1
  }

  isFirstProjectRow(row: ProjectRnumberRowModel): boolean {
    if (!this.reportData) return false

    for (let reportRow of this.reportData.rows) {
      if (reportRow.ProjectNum === row.ProjectNum && !this.hiddenRows.includes(reportRow.RowNum))
        return reportRow.RowNum === row.RowNum
    }

    return true
  }

  isProjectHidden(ProjectNum: number): boolean {
    if (!this.reportData) return false

    return this.reportData.rows.filter(
      (reportRow) => {
        return reportRow.ProjectNum === ProjectNum
          && !reportRow.ProjectName.includes('Всього')
          && !(reportRow.ProjectName === '')
          && !this.hiddenRows.includes(reportRow.RowNum)
      }
    ).length === 1
  }

  toggleProject(ProjectNum: number) {
    if (!this.reportData) return

    if (this.isProjectHidden(ProjectNum)) {
      let projectRowNums: number[] = []
      for (let row of this.reportData.rows) {
        if (row.ProjectName.includes('Всього'))
          continue
        if (row.ProjectNum === ProjectNum) {
          projectRowNums.push(row.RowNum)
        }
      }
      this.hiddenRows = this.hiddenRows.filter(
        (rowNum) => { return !projectRowNums.includes(rowNum) }
      )
    } else {
      const projectRows = this.reportData.rows.filter(
        (reportRow) => { return reportRow.ProjectNum === ProjectNum }
      ).slice(0, -1)

      for (let row of projectRows)
        this.hiddenRows.push(row.RowNum)
    }
  }

  hideAllProjects() {
    if (!this.reportData) return

    for (let row of this.reportData.rows) {
      if (!this.isProjectHidden(row.ProjectNum))
        this.toggleProject(row.ProjectNum)
    }
  }

  showAllProjects() {
    if (!this.reportData) return

    for (let row of this.reportData.rows) {
      if (this.isProjectHidden(row.ProjectNum))
        this.toggleProject(row.ProjectNum)
    }
  }

  areProjectsHidden(): boolean {
    if (!this.reportData) return false

    for (let row of this.reportData.rows) {
      if (this.isProjectHidden(row.ProjectNum))
        return true
    }

    return false
  }


  // REESTR STUFF

  getReestrLen(RNumber: number | string): number {
    if (!this.reportData) return 0
    if (typeof RNumber === 'string') return 1

    return this.reportData.rows.filter(
      (reportRow) => {
        return !this.hiddenRows.includes(reportRow.RowNum) && reportRow.RNumber === RNumber
      }
    ).length
  }

  isFirstReestrRow(row: ProjectRnumberRowModel): boolean {
    if (!this.reportData) return false

    for (let reportRow of this.reportData.rows) {
      if (
        reportRow.ReestrNum === row.ReestrNum
        && !this.hiddenRows.includes(reportRow.RowNum)
        && reportRow.RNumber === row.RNumber
      ) return reportRow.RowNum === row.RowNum
    }
    return true
  }

  isReestrHidden(RNumber: number | string) {
    if (!this.reportData) return false
    if (typeof RNumber === 'string') return false

    return this.reportData.rows.filter(
      (reportRow) => {
        return reportRow.RNumber === RNumber && !this.hiddenRows.includes(reportRow.RowNum)
      }
    ).length <= 1
  }

  toggleReestr(RNumber: number | string) {
    if (!this.reportData || typeof RNumber === 'string') return

    if (this.isReestrHidden(RNumber)) {
      let projectRowNums: number[] = []
      for (let row of this.reportData.rows) {
        if (row.RNumber === RNumber) {
          projectRowNums.push(row.RowNum)
        }
      }
      this.hiddenRows = this.hiddenRows.filter(
        (rowNum) => { return !projectRowNums.includes(rowNum) }
      )
    } else {
      const projectRows = this.reportData.rows.filter(
        (reportRow) => { return reportRow.RNumber === RNumber }
      ).slice(0, -1)

      for (let row of projectRows)
        this.hiddenRows.push(row.RowNum)
    }

  }

  hideAllReestrs() {
    if (!this.reportData) return

    for (let row of this.reportData.rows) {
      if (typeof row.RNumber === 'string')
        continue
      if (!this.isReestrHidden(row.RNumber))
        this.toggleReestr(row.RNumber)
    }
  }

  showAllReestrs() {
    if (!this.reportData) return

    for (let row of this.reportData.rows) {
      if (typeof row.RNumber === 'string')
        continue
      if (this.isReestrHidden(row.RNumber))
        this.toggleReestr(row.RNumber)
    }
  }

  areReestrsHidden(): boolean {
    if (!this.reportData) return false

    for (let row of this.reportData.rows) {
      if (typeof row.RNumber === 'string')
        continue
      if (this.isReestrHidden(row.RNumber))
        return true
    }

    return false
  }

}





