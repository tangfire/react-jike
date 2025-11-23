import {useEffect, useRef} from "react";
import * as echarts from "echarts";
type EChartsOption = echarts.EChartsOption;
// 柱状图组件

// 定义组件的 Props 接口
interface BarChartProps {
    title: string;
}

const BarChart = ({title}:BarChartProps)=>{
    const chartRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
// 1. 获取渲染图表的dom节点
        const chartDom = chartRef.current;
// 2. 图表初始化生成图表实例对象
        const myChart = echarts.init(chartDom);

// 3. 准备图表参数
        const option: EChartsOption = {
            title:{
                text: title
            },
            xAxis: {
                type: 'category',
                data: ['vue', 'react', 'Angular']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [10,40,70],
                    type: 'bar'
                }
            ]
        };


// 4. 使用图表参数完成图表的渲染
        myChart.setOption(option);
    },[])

    return (<div ref={chartRef} style={{width:'500px',height:'400px'}}></div>)
}

export default BarChart;
