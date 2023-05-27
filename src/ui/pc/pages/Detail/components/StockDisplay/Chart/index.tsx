import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import {TimeToTimestamp} from "../../../../../../../modules/stock/StockSlice";

function CandlestickChart({rawData}) {
    // 模拟K线数据
    // const data = [
    //     [1577836800000, 117.72, 118.68, 116.47, 117.94],
    //     [1577923200000, 116.57, 118.57, 116.39, 118.62],
    //     [1578009600000, 118.19, 119.91, 118.04, 119.52],
    //     // 更多数据...
    // ];
    // 转换数据格式为Highcharts所需的格式
    const seriesData = rawData.map(item => ({
        x: TimeToTimestamp(item[0]),
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4]
    }));

    const options = {
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
                '开盘: {point.open}<br/>' +
                '最高: {point.high}<br/>' +
                '最低: {point.low}<br/>' +
                '收盘: {point.close}<br/>'
        },

        title: {
            text: 'K线图'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: '价格'
            }
        },
        series: [{
            type: 'candlestick',
            name: 'K线图',
            data: seriesData,
            // 控制走势为跌的蜡烛颜色
            color: 'rgba(0,253,49,0.5)',
            lineColor: 'rgb(0,253,49)',

            // 控制走势为涨的蜡烛颜色
            upColor: 'rgba(231,27,27,0.5)',
            upLineColor: 'rgb(231,27,27)',

        }]
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />
        </div>
    );
}

export default CandlestickChart;