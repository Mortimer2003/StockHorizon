// import * as echarts from 'echarts';
// import style from "./index.module.css";
// import {makeStyle} from "../../../../../../../utils/CSSUtils";
// import React, {useState, useRef, useEffect} from "react";
//
// //TODO:rawData改为请求获取
// import rawData from "../../../../../../../assets/data/stock-DJI.json"
//
// const s = makeStyle(style);
//
// function splitData(rawDataRef: (number | string)[][]) {
//     let categoryData: string[] = [];
//     let values: number[][] = [];
//     let volumes: [number, number, number][] = [];
//
//     for (let i = 0; i < rawDataRef.length; i++) {
//         const [firstValue, ...remainingValues] = rawDataRef[i];
//         categoryData.push(firstValue.toString());
//         // @ts-ignore
//         values.push(remainingValues);
//         // @ts-ignore
//         volumes.push([i, remainingValues[4], remainingValues[0] > remainingValues[1] ? 1 : -1]);
//     }
//
//
//     return {
//         categoryData: categoryData,
//         values: values,
//         volumes: volumes,
//     };
// }
//
// function calculateMA(dayCount: number, data: { values: number[][] }) {
//     let result = [];
//     for (let i = 0, len = data.values.length; i < len; i++) {
//         if (i < dayCount) {
//             result.push('-');
//             continue;
//         }
//         let sum = 0;
//         for (let j = 0; j < dayCount; j++) {
//             sum += data.values[i - j][1];
//         }
//         result.push(+(sum / dayCount).toFixed(3));
//     }
//     return result;
// }
//
//
// export function KChart({rawData}) {
//     //let rawDataRef = rawData;
//     const [chartInstance, setChartInstance] = useState<echarts.ECharts>();
//     const [chartOptions, setChartOptions] = useState(null);
//     const chartRef = useRef<HTMLDivElement>();
//
//     let chart = <div ref={chartRef} id="chart" className={s("chart")}></div>;
//
//     useEffect(() => {
//         if (chartInstance && chartOptions) {
//             chartInstance.setOption(chartOptions);
//         }
//     }, [chartInstance, chartOptions]);
//
//     useEffect(() => {
//         let chart = echarts.getInstanceByDom(chartRef.current);
//         if (chart) {
//             // 如果存在之前的图表实例，则销毁它
//             chart.dispose();
//         }
//
//         chart = echarts.init(chartRef.current);   //echart初始化容器
//
//         const upColor = '#00da3c';
//         const downColor = '#ec0000';
//
//         let data = splitData(rawData.slice());
//         // if(data.categoryData==null||data.values==null||data.volumes==null)
//         // {
//         //     rawDataRef=rawData;
//         //     data = splitData(rawDataRef);
//         // }
//         //console.log(rawData)
//
//
//         let option = {  //配置项(数据都来自于props)
//             legend: {
//                 bottom: 10,
//                 left: 'center',
//                 data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30']
//             },
//             tooltip: {
//                 trigger: 'axis',
//                 axisPointer: {
//                     type: 'cross'
//                 },
//                 borderWidth: 1,
//                 borderColor: '#ccc',
//                 padding: 10,
//                 textStyle: {
//                     color: '#000'
//                 },
//                 position: function (pos, params, el, elRect, size) {
//                     const obj: Record<string, number> = {
//                         top: 10
//                     };
//                     obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
//                     return obj;
//                 }
//                 // extraCssText: 'width: 170px'
//             },
//             axisPointer: {
//                 link: [
//                     {
//                         xAxisIndex: 'all'
//                     }
//                 ],
//                 label: {
//                     backgroundColor: '#777'
//                 }
//             },
//             toolbox: {
//                 feature: {
//                     dataZoom: {
//                         yAxisIndex: false
//                     },
//                     brush: {
//                         type: ['lineX', 'clear']
//                     }
//                 }
//             },
//             brush: {
//                 xAxisIndex: 'all',
//                 brushLink: 'all',
//                 outOfBrush: {
//                     colorAlpha: 0.1
//                 }
//             },
//             visualMap: {
//                 show: false,
//                 seriesIndex: 5,
//                 dimension: 2,
//                 pieces: [
//                     {
//                         value: 1,
//                         color: downColor
//                     },
//                     {
//                         value: -1,
//                         color: upColor
//                     }
//                 ]
//             },
//             grid: [
//                 {
//                     left: '10%',
//                     right: '8%',
//                     height: '50%'
//                 },
//                 {
//                     left: '10%',
//                     right: '8%',
//                     top: '63%',
//                     height: '16%'
//                 }
//             ],
//             xAxis: [
//                 {
//                     type: 'category',
//                     data: data.categoryData,
//                     boundaryGap: false,
//                     axisLine: { onZero: false },
//                     splitLine: { show: false },
//                     min: 'dataMin',
//                     max: 'dataMax',
//                     axisPointer: {
//                         z: 100
//                     }
//                 },
//                 {
//                     type: 'category',
//                     gridIndex: 1,
//                     data: data.categoryData,
//                     boundaryGap: false,
//                     axisLine: { onZero: false },
//                     axisTick: { show: false },
//                     splitLine: { show: false },
//                     axisLabel: { show: false },
//                     min: 'dataMin',
//                     max: 'dataMax'
//                 }
//             ],
//             yAxis: [
//                 {
//                     scale: true,
//                     splitArea: {
//                         show: true
//                     }
//                 },
//                 {
//                     scale: true,
//                     gridIndex: 1,
//                     splitNumber: 2,
//                     axisLabel: { show: false },
//                     axisLine: { show: false },
//                     axisTick: { show: false },
//                     splitLine: { show: false }
//                 }
//             ],
//             dataZoom: [
//                 {
//                     type: 'inside',
//                     xAxisIndex: [0, 1],
//                     start: 98,
//                     end: 100
//                 },
//                 {
//                     show: true,
//                     xAxisIndex: [0, 1],
//                     type: 'slider',
//                     top: '85%',
//                     start: 98,
//                     end: 100
//                 }
//             ],
//             series: [
//                 {
//                     name: 'Dow-Jones index',
//                     type: 'candlestick',
//                     data: data.values,
//                     itemStyle: {
//                         color: upColor,
//                         color0: downColor,
//                         borderColor: undefined,
//                         borderColor0: undefined
//                     },
//                     tooltip: {
//                         formatter: function (param: any) {
//                             param = param[0];
//                             return [
//                                 '日期: ' + param.name + '<hr size=1 style="margin: 3px 0">',
//                                 '开盘: ' + param.data[0] + '<br/>',
//                                 '收盘: ' + param.data[1] + '<br/>',
//                                 '最低: ' + param.data[2] + '<br/>',
//                                 '最高: ' + param.data[3] + '<br/>'
//                             ].join('');
//                         }
//                     }
//                 },
//                 {
//                     name: 'MA5',
//                     type: 'line',
//                     data: calculateMA(5, data),
//                     smooth: true,
//                     lineStyle: {
//                         opacity: 0.5
//                     }
//                 },
//                 {
//                     name: 'MA10',
//                     type: 'line',
//                     data: calculateMA(10, data),
//                     smooth: true,
//                     lineStyle: {
//                         opacity: 0.5
//                     }
//                 },
//                 {
//                     name: 'MA20',
//                     type: 'line',
//                     data: calculateMA(20, data),
//                     smooth: true,
//                     lineStyle: {
//                         opacity: 0.5
//                     }
//                 },
//                 {
//                     name: 'MA30',
//                     type: 'line',
//                     data: calculateMA(30, data),
//                     smooth: true,
//                     lineStyle: {
//                         opacity: 0.5
//                     }
//                 },
//                 {
//                     name: '成交量',
//                     type: 'bar',
//                     xAxisIndex: 1,
//                     yAxisIndex: 1,
//                     data: data.volumes,
//                 }
//             ]
//         };
//
//         chart.setOption(option,true);
//         setChartInstance(chart);
//
//         chart.dispatchAction({
//             type: 'brush',
//             areas: [
//                 {
//                     brushType: 'lineX',
//                     coordRange: ['2022-01-01', '2023-01-01'], //TODO:这部分怎么改
//                     xAxisIndex: 0,
//                 },
//             ],
//         });
//
//         return () => {
//             chart.dispose();
//         };
//
//     }, [rawData]);
//
//
//     return <div ref={chartRef} className={s("chart")}></div>
// }
