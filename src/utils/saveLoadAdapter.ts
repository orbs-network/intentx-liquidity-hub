import localforage from 'localforage'
import {
  ChartData,
  ChartMetaInfo,
  IExternalSaveLoadAdapter,
  StudyTemplateData,
  StudyTemplateMetaInfo,
} from '../../public/static/charting_library/charting_library'

// Configuración de LocalForage
localforage.config({
  name: 'intentx',
  storeName: 'tradingView',
})

const save_load_adapter: IExternalSaveLoadAdapter = {
  async getAllCharts(): Promise<ChartMetaInfo[]> {
    return (await localforage.getItem('charts')) || []
  },

  async removeChart(id) {
    let charts: ChartData[] = (await localforage.getItem('charts')) || []
    charts = charts.filter((chart) => chart.id !== id)

    await localforage.setItem('charts', charts)
  },

  async saveChart(chartData: ChartData): Promise<string> {
    if (!chartData.id) {
      chartData.id = Math.random().toString()
    } else {
      await this.removeChart(chartData.id)
    }

    const charts: ChartData[] = (await localforage.getItem('charts')) || []
    charts.push(chartData)

    await localforage.setItem('charts', charts)
    return chartData.id
  },

  async getChartContent(chartId: number): Promise<string> {
    const charts: ChartData[] = (await localforage.getItem('charts')) || []
    const chart = charts.find((c) => c.id == chartId.toString())

    if (chart) {
      return chart.content
    } else {
      console.error('Chart not found')
      throw new Error('Chart not found')
    }
  },

  async removeStudyTemplate(studyTemplateData: StudyTemplateMetaInfo): Promise<void> {
    let studyTemplates: StudyTemplateData[] = (await localforage.getItem('studyTemplates')) || []
    studyTemplates = studyTemplates.filter((template) => template.name !== studyTemplateData.name)

    await localforage.setItem('studyTemplates', studyTemplates)
  },

  async getStudyTemplateContent(studyTemplateData: StudyTemplateMetaInfo): Promise<string> {
    const studyTemplates: StudyTemplateData[] = (await localforage.getItem('studyTemplates')) || []
    const template = studyTemplates.find((t) => t.name === studyTemplateData.name)

    if (template) {
      return template.content
    } else {
      console.error('Study template not found')
      throw new Error('Study template not found')
    }
  },

  async saveStudyTemplate(studyTemplateData: StudyTemplateData): Promise<void> {
    const studyTemplates: StudyTemplateData[] = (await localforage.getItem('studyTemplates')) || []
    const index = studyTemplates.findIndex((template) => template.name === studyTemplateData.name)

    if (index > -1) {
      studyTemplates[index] = studyTemplateData
    } else {
      studyTemplates.push(studyTemplateData)
    }

    await localforage.setItem('studyTemplates', studyTemplates)
  },

  async getAllStudyTemplates() {
    return (await localforage.getItem('studyTemplates')) || []
  },

  async removeDrawingTemplate(toolName: string, templateName: string): Promise<void> {
    let drawingTemplates: any[] = (await localforage.getItem('drawingTemplates')) || []
    drawingTemplates = drawingTemplates.filter((template) => template.name !== templateName)

    await localforage.setItem('drawingTemplates', drawingTemplates)
  },

  async loadDrawingTemplate(toolName, templateName) {
    const drawingTemplates: any[] = (await localforage.getItem('drawingTemplates')) || []
    const template = drawingTemplates.find((t) => t.name === templateName)

    if (template) {
      return template.content
    } else {
      console.error('Drawing template not found')
      throw new Error('Drawing template not found')
    }
  },

  async saveDrawingTemplate(toolName, templateName, content) {
    let drawingTemplates: any[] = (await localforage.getItem('drawingTemplates')) || []
    drawingTemplates = drawingTemplates.filter((template) => template.name !== templateName)

    drawingTemplates.push({ name: templateName, content: content })

    await localforage.setItem('drawingTemplates', drawingTemplates)
  },

  async getDrawingTemplates() {
    const drawingTemplates: any[] = (await localforage.getItem('drawingTemplates')) || []
    return drawingTemplates.map((template) => template.name)
  },

  async getAllChartTemplates() {
    const chartTemplates: any[] = (await localforage.getItem('chartTemplates')) || []
    return chartTemplates.map((x) => x.name)
  },

  async saveChartTemplate(templateName, content) {
    const chartTemplates: any[] = (await localforage.getItem('chartTemplates')) || []
    const index = chartTemplates.findIndex((x) => x.name === templateName)

    if (index > -1) {
      chartTemplates[index].content = content
    } else {
      chartTemplates.push({ name: templateName, content })
    }

    await localforage.setItem('chartTemplates', chartTemplates)
  },

  async removeChartTemplate(templateName) {
    let chartTemplates: any[] = (await localforage.getItem('chartTemplates')) || []
    chartTemplates = chartTemplates.filter((x) => x.name !== templateName)

    await localforage.setItem('chartTemplates', chartTemplates)
  },

  async getChartTemplateContent(templateName) {
    const chartTemplates: any[] = (await localforage.getItem('chartTemplates')) || []
    const template = chartTemplates.find((x) => x.name === templateName)

    if (template) {
      return structuredClone(template.content)
    } else {
      console.error('Chart template not found')
      throw new Error('Chart template not found')
    }
  },
}

export default save_load_adapter
