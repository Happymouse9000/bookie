import { Line } from "react-chartjs-2";

export default function LineGraph({ figuresArray, label }) {
  const data = {
    labels: figuresArray,
    datasets: [
      {
        label: label,
        borderColor: "turquoise",
        borderWidth: 3,
        hoverBorderColor: "darkturquoise",
        data: figuresArray,
        lineTension: 0,
      },
    ],
  };

  return <Line data={data} />;
}
