import React, {useEffect, useRef} from 'react'
import Chart from 'chart.js'
import 'chartjs-plugin-colorschemes'

import {StatItem} from '../interfaces/StatItem'

export function LineChart(
  {
    titles,
    cols,
  }: {
    titles: string[],
    cols: StatItem[][],
  },
) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const chart = useRef<Chart|null>(null)

  useEffect(() => {
    if (!canvas.current) {
      console.log(canvas)
      return
    }

    if (!chart.current) {
      chart.current = new Chart(
        canvas.current,
        {
          type: 'line',
          options: {
            responsive: true,
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  unit: 'day',
                },
              }],
            },
            plugins: {
              colorschemes: {
                // https://nagix.github.io/chartjs-plugin-colorschemes/
                scheme: 'office.Genesis6',
              },
            },
          },
        },
      )
    }

    const datasets: Chart.ChartDataSets[] = []
    cols.forEach((rows, i) => {
      datasets.push({
        data: rows.map(item => {
          return {
            x: new Date(item.ymd),
            y: item.value,
          }
        }),
        label: titles[i],
      })
    })

    chart.current.data = {
      datasets,
    }
    chart.current.update()

  }, [titles, cols])

  return (
    <div>
      <canvas ref={canvas}/>
    </div>
  )
}
