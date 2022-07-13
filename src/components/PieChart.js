import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";

export default function PieChart({ figuresArray, label, namesArray }) {
  const [bgColors, setBgColors] = useState([]);
  const [bgHoverColors, setBgHoverColors] = useState([]);
  useEffect(() => {
    let bgColorsTemp = [];
    let bgHoverColorsTemp = [];
    for (let i = 0; i <= figuresArray.length; i++) {
      bgColorsTemp.push(`hsl(${i * 70}, 60%, 60%,0.8)`);
    }
    setBgColors(bgColorsTemp);
    for (let i = 0; i <= figuresArray.length; i++) {
      bgColorsTemp.push(`hsl(${i * 70}, 50%, 60%, 0.8)`);
    }
    setBgHoverColors(bgHoverColorsTemp);
  }, [figuresArray]);

  const data = {
    labels: namesArray,

    datasets: [
      {
        label: label,
        backgroundColor: bgColors,
        borderColor: "black",
        borderWidth: 1,
        hoverBackgroundColor: bgHoverColors,
        hoverBorderColor: "black",
        data: figuresArray,
      },
    ],
  };

  return <Pie data={data} />;
}
