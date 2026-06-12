import React from "react";

interface BasicPlanProps {
  planName: string;
  price: number;
  currency: string;
  billingPeriod: string;
  expiresInDays: number;
  features: string[];
  onUpdateUserQuota: () => void;
  onUpdateSubscriptionPeriod: () => void;
  onPayNextBill: () => void;
  color?: string; // optional color prop for theme accents
}

const BasicPlan: React.FC<BasicPlanProps> = ({
  planName,
  price,
  currency,
  billingPeriod,
  expiresInDays,
  features,
  onUpdateUserQuota,
  onUpdateSubscriptionPeriod,
  onPayNextBill,
  color = "#3B82F6", // default Tailwind blue-500
}) => {
  return (
    <div
      className="max-w-md p-8 rounded-xl shadow-lg border border-gray-200 bg-white transition-transform transform hover:scale-[1.02]"
      style={{ borderColor: color }}
    >
      <div className="flex justify-between items-center mb-5">
        <h2
          className="text-2xl font-extrabold tracking-tight"
          style={{ color }}
        >
          {planName}
        </h2>
        <span className="text-sm text-gray-500">
          Expires in{" "}
          <span className="font-semibold text-green-600">
            {expiresInDays} days
          </span>
        </span>
      </div>

      <div className="mb-6">
        <p className="text-5xl font-extrabold text-gray-900 flex items-baseline gap-1">
          <span>{currency}</span>
          <span>{price.toFixed(2)}</span>
        </p>
        <p className="text-sm text-gray-400 uppercase tracking-wide font-medium">
          per user billed {billingPeriod}
        </p>
      </div>

      <p className="font-semibold text-gray-700 mb-4" style={{ color }}>
        Get in depth with our system
      </p>

      <ul className="mb-8 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-gray-700">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          onClick={onUpdateUserQuota}
          className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold shadow-md text-white"
          style={{
            backgroundColor: color,
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#2563EB")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = color)
          }
        >
          Update User Quota
        </button>

        <button
          onClick={onUpdateSubscriptionPeriod}
          className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold shadow-md text-white"
          style={{
            backgroundColor: color,
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#2563EB")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = color)
          }
        >
          Update Subscription Period
        </button>

        <button
          onClick={onPayNextBill}
          className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold shadow-md text-white"
          style={{
            backgroundColor: color,
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#2563EB")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = color)
          }
        >
          Pay Next Bill
        </button>
      </div>
    </div>
  );
};

export default BasicPlan;
