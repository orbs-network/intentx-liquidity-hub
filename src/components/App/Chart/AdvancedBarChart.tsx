import React, { useEffect, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import styled from 'styled-components'
import { Row } from 'components/Row'
import { useSetMainAnalyticsHistoryFilterDateRange } from 'state/analytics/hooks'
import dayjs from 'dayjs'

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 8px;
  min-height: 20em;
  background-color: rgba(0, 0, 0, 0.2);
`

const AdvancedBarChart = ({ data, chartTitle, leftAxisLabel, isUSD = false, seriesName }: any) => {
  const setMainAnalyticsHistoryFilterDateRange = useSetMainAnalyticsHistoryFilterDateRange()

  const interval = 30.44 * 24 * 60 * 60 * 1000 // One month

  const minTime: number = 1000000000000000
  const maxTime: number = 0

  const [startTime, setStartTime] = useState(Date.now() - interval)
  const [endTime, setEndTime] = useState(Date.now())
  const [seriesData, setSeriesData] = useState<any>([])
  const [isMonthView, setIsMonthView] = useState<boolean>(false)

  useEffect(() => {
    if (isMonthView && data) {
      const monthlyTotals = {}

      data.forEach((entry) => {
        const date = new Date(entry.time)
        const yearMonthKey = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`

        if (!monthlyTotals[yearMonthKey]) {
          monthlyTotals[yearMonthKey] = { value: 0, time: date }
        }
        monthlyTotals[yearMonthKey].value += entry.value
      })

      setSeriesData(Object.values(monthlyTotals))
    } else {
      setSeriesData(data)
    }
  }, [data, isMonthView])

  const yAxisFormatter = (value: number) => {
    const absValue = Math.abs(value)
    if (absValue >= 1000000000) {
      const formattedValue = (absValue / 1000000000).toFixed(2) + 'B'
      return isUSD ? '$' + formattedValue : formattedValue
    } else if (absValue >= 1000000) {
      const formattedValue = (absValue / 1000000).toFixed(2) + 'M'
      return isUSD ? '$' + formattedValue : formattedValue
    } else if (absValue >= 1000) {
      const formattedValue = (absValue / 1000).toFixed(2) + 'K'
      return isUSD ? '$' + formattedValue : formattedValue
    } else {
      const formattedValue = value > absValue ? value.toFixed(2) : absValue
      return isUSD ? '$' + formattedValue : formattedValue
    }
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const updateChartData = (): void => {
    setMainAnalyticsHistoryFilterDateRange([new Date(startTime), new Date(endTime)])
  }

  const goBack = () => {
    setEndTime(startTime)
    setStartTime(startTime - interval)
    updateChartData()
  }

  const goForward = () => {
    setStartTime(endTime)
    setEndTime(endTime + interval)
    updateChartData()
  }

  const options = {
    backgroundColor: 'transparent',
    color: ['#EA3C55'],
    grid: {
      left: '60',
      right: '60',
      top: '60',
      bottom: '40',
    },
    autoResize: true,
    darkMode: true,
    xAxis: {
      type: 'time',
      splitNumber: 5,
    },
    title: {
      show: true,
      text: chartTitle,
      textVerticalAlign: 'top',
      top: 5,
      textStyle: {
        color: '#fff',
        fontSize: 14,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: leftAxisLabel,
        nameGap: 45,
        nameRotate: 90,
        nameLocation: 'center',
        splitNumber: 4,
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        axisLabel: {
          formatter: (value: any) => {
            const absValue = Math.abs(value)
            if (absValue >= 1000000000) {
              const formattedValue = (absValue / 1000000000).toFixed(0) + 'B'
              return isUSD ? '$' + formattedValue : formattedValue
            } else if (absValue >= 1000000) {
              const formattedValue = (absValue / 1000000).toFixed(0) + 'M'
              return isUSD ? '$' + formattedValue : formattedValue
            } else if (absValue >= 1000) {
              const formattedValue = (absValue / 1000).toFixed(0) + 'K'
              return isUSD ? '$' + formattedValue : formattedValue
            }
            return value.toString()
          },
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
      formatter: (params: any) => {
        const timestamp = params[0].value[0]
        const date = new Date(timestamp)

        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${(date.getFullYear() % 100).toString().padStart(2, '0')}`
        let res = `Date: <b>${formattedDate}</b> <br/>`
        params.forEach(function (item: any) {
          res += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color}"></span>`
          res += capitalizeFirstLetter(item.seriesName) + ': ' + yAxisFormatter(item?.data?.[1]) + '<br/>'
        })
        return res
      },
    },
    legend: {
      show: false,
    },
    toolbox: {
      show: true,
      itemSize: 20,
      itemGap: 4,
      feature: {
        myToolMonthView: {
          show: true,
          title: '',
          icon: 'path://M19.408,10.696V19H18.316V12.808L15.556,19H14.788L12.016,12.796V19H10.924V10.696H12.1L15.172,17.56L18.244,10.696H19.408ZM19,0.5H11C5.20101,0.5,0.5,5.20101,0.5,11V19C0.5,24.799,5.20101,29.5,11,29.5H19C24.799,29.5,29.5,24.799,29.5,19V11C29.5,5.20101,24.799,0.5,19,0.5Z',
          iconStyle: {
            color: isMonthView ? 'rgba(255,255,255, 0.3)' : 'rgba(255,255,255, 0)',
            borderColor: 'rgba(255,255,255, 0.8)',
          },
          onclick: function () {
            setIsMonthView((prev) => !prev)
          },
          emphasis: {
            iconStyle: {
              borderColor: 'rgba(255,255,255, 1)',
            },
          },
        },
        myToolArrowLeft: {
          show: true,
          title: '',
          icon: 'path://M16,11L12,15L16,19M19,1L11,1C5.47715,1,0.999998,5.47716,0.999998,11L0.999999,19C1,24.5228,5.47715,29,11,29L19,29C24.5228,29,29,24.5228,29,19L29,11C29,5.47715,24.5228,1,19,1Z',
          iconStyle: {
            borderColor: 'rgba(255,255,255, 0.3)',
          },
          onclick: function () {},
          emphasis: {
            iconStyle: {
              borderColor: 'rgba(255,255,255, 0.3)',
            },
          },
        },
        myToolLabel: {
          show: true,
          title: '',
          icon: 'path://M50.6329,54.4997C49.7906,50.25,47.168,48.1251,42.7651,48.1251C39.3577,48.1251,36.8117,49.446,35.1271,52.0877C33.4426,54.6911,32.6194,58.9983,32.6577,65.0091C33.5383,63.0183,34.9931,61.4677,37.0223,60.3574C39.0897,59.2089,41.3869,58.6346,43.9137,58.6346C47.8571,58.6346,50.9966,59.8597,53.332,62.31C55.7057,64.7603,56.8926,68.1486,56.8926,72.4749C56.8926,75.0783,56.3757,77.4137,55.342,79.4811C54.3466,81.5486,52.8151,83.1949,50.7477,84.42C48.7186,85.6451,46.2491,86.2577,43.3394,86.2577C39.396,86.2577,36.314,85.3771,34.0934,83.616C31.8729,81.8549,30.3223,79.4237,29.4417,76.3226C28.5611,73.2214,28.1209,69.3929,28.1209,64.8369C28.1209,50.786,33.0214,43.7606,42.8226,43.7606C46.5746,43.7606,49.5226,44.7751,51.6666,46.8043C53.8106,48.8334,55.074,51.3986,55.4569,54.4997H50.6329ZM42.8226,63.0566C41.1763,63.0566,39.6257,63.4011,38.1709,64.0903C36.716,64.7411,35.5291,65.7557,34.6103,67.134C33.7297,68.474,33.2894,70.1203,33.2894,72.0729C33.2894,74.9826,34.1317,77.3563,35.8163,79.194C37.5009,80.9934,39.9129,81.8931,43.0523,81.8931C45.7323,81.8931,47.8571,81.07,49.4269,79.4237C51.0349,77.7391,51.8389,75.4803,51.8389,72.6471C51.8389,69.6609,51.0731,67.3254,49.5417,65.6409C48.0103,63.918,45.7706,63.0566,42.8226,63.0566ZM106.406,46.4023V86.1429H100.18V56.5097L86.9717,86.1429H83.2962L70.0303,56.4523V86.1429H64.8043V46.4023H70.4323L85.134,79.2514L99.8357,46.4023H105.406Z',
          iconStyle: {
            color: 'rgba(255,255,255, 1)',
            borderColor: 'rgba(255,255,255, 1)',
          },
          onclick: function () {},
          emphasis: {
            iconStyle: {
              color: 'rgba(255,255,255, 1)',
              borderColor: 'rgba(255,255,255, 1)',
            },
          },
        },
        myToolArrowRight: {
          show: true,
          title: '',
          icon: 'path://M14,19L18,15L14,11M11,29H19C24.5228,29,29,24.5228,29,19V11C29,5.47715,24.5228,1,19,1H11C5.47715,1,1,5.47715,1,11V19C1,24.5228,5.47715,29,11,29Z',
          iconStyle: {
            borderColor: 'rgba(255,255,255, 0.3)',
          },
          onclick: function () {},
          emphasis: {
            iconStyle: {
              borderColor: 'rgba(255,255,255, 0.3)',
            },
          },
        },
        saveAsImage: {
          show: true,
          title: '',
          iconStyle: {
            borderColor: 'rgba(255,255,255, 0.8)',
          },
          emphasis: {
            iconStyle: {
              borderColor: 'rgba(255,255,255, 1)',
            },
          },
          icon: 'path://M20,16.6667V18.8889C20,19.1836,19.8829,19.4662,19.6746,19.6746C19.4662,19.8829,19.1836,20,18.8889,20H11.1111C10.8164,20,10.5338,19.8829,10.3254,19.6746C10.1171,19.4662,10,19.1836,10,18.8889V16.6667M12.2222,13.8889L15,16.6667M15,16.6667L17.7778,13.8889M15,16.6667V10M11,29H19C24.5228,29,29,24.5228,29,19V11C29,5.47715,24.5228,1,19,1H11C5.47715,1,1,5.47715,1,11V19C1,24.5228,5.47715,29,11,29Z',
        },
      },
      tooltip: {
        show: false,
      },
    },
    dataZoom: [
      {
        type: 'inside',
        throttle: 50,
      },
    ],
    series: [
      {
        name: seriesName,
        data: seriesData?.map((element) => [new Date(element.time), element.value]),
        type: 'bar',
      },
    ],
  }

  return (
    <ChartContainer>
      <ReactECharts option={options} />
    </ChartContainer>
  )
}

export default AdvancedBarChart
