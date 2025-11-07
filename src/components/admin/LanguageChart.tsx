
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface LanguageChartProps {
  english: number;
  swahili: number;
}

export function LanguageChart({ english, swahili }: LanguageChartProps) {
  const data = {
    labels: ["English", "Swahili"],
    datasets: [
      {
        data: [english, swahili],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(249, 115, 22, 0.8)"
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(249, 115, 22, 1)"
        ],
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    }
  };

  return <Doughnut data={data} options={options} />;
}
