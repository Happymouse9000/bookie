import { Bar } from "react-chartjs-2";

export default function BarChart({ figuresArray, label, color, colorHover }) {
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: label,
        backgroundColor: color,
        borderColor: "black",
        borderWidth: 1,
        hoverBackgroundColor: colorHover,
        hoverBorderColor: "black",
        data: figuresArray,
      },
    ],
  };

  return <Bar data={data} />;
}
