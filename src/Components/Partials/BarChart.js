import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const BarChart = ({ data, columnName }) => {
  const [showDataLabels, setShowDataLabels] = useState(true);

  // 📝 Handle screen resize
  const handleResize = () => {
    if (window.innerWidth < 640) {
      setShowDataLabels(false);
    } else {
      setShowDataLabels(true);
    }
  };

  useEffect(() => {
    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: columnName,
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
              from: 0,
              to: Infinity,
              color: "#CC8C08",
            },
          ],
        },
      },
    },
    colors: ["#CC8C08"],
    dataLabels: {
      enabled: showDataLabels,
      formatter: (val) => {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      },
    },
  };

  const series = [
    {
      name: "triệu",
      data: data,
    },
  ];

  return (
    <div className="w-full overflow-x-scroll">
      <div className="w-[800px] sm:w-full">
        <div className="mixed-chart">
          <Chart
            options={options}
            series={series}
            type="bar"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
