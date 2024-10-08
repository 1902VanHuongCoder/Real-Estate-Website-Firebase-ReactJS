import React from "react";
import Chart from "react-apexcharts";

const Test = () => {
 const options = {
   chart: {
     id: "basic-bar",
   },
   xaxis: {
     categories: ["Nguyễn Văn Bảy","Tô Văn Hưởng"],
   },
   title: {
    text: "Doanh thu của từng nhân viên",
    align: "center",
    margin: 10,
    offsetY: 10,
    style: {
      fontSize: "20px",
    },
    cssClass: 'chart-title',
  },
 };

 const series = [
   {
     name: "triệu",
     data: [30000, 40000],
     colors: ['#008FFB', '#ee4d2d'],
   },
 ];

 return (
   <div className="w-full">
     <div className="w-full">
       <div className="mixed-chart">
         <Chart options={options} series={series} type="bar" className="w-full" />
       </div>
     </div>
   </div>
 );
};

export default Test;