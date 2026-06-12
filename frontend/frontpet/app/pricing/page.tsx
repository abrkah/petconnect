import React from "react";
import { Card, Button } from "antd";

const pricingPlans = [
  {
    title: "Basic",
    price: "$19/month",
    features: [
      "Access to basic courses",
      "Community support",
      "Limited resources",
    ],
  },
  {
    title: "Pro",
    price: "$49/month",
    features: [
      "All basic features",
      "Access to premium courses",
      "Live Q&A sessions",
    ],
    recommended: true,
  },
  {
    title: "Enterprise",
    price: "$99/month",
    features: [
      "All pro features",
      "1-on-1 mentorship",
      "Certification & career support",
    ],
  },
];

const PricingComponent = () => {
  return (
    <section className="py-16 bg-gray-100 text-center">
      <h2 className="text-4xl font-bold text-gray-800">Choose Your Plan</h2>
      <p className="text-gray-600 mt-2 mb-8">
        Flexible pricing for every learner.
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        {pricingPlans.map((plan, index) => (
          <Card
            key={index}
            className={`w-80 rounded-lg shadow-lg  flex flex-col ${
              plan.recommended ? "border-2 border-indigo-600" : "border"
            }`}
          >
            <h3 className="text-2xl font-semibold">{plan.title}</h3>
            <p className="text-indigo-600 text-xl font-bold mt-2">
              {plan.price}
            </p>
            <ul className="mt-4 text-gray-600 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i}>✅ {feature}</li>
              ))}
            </ul>
            <Button
              type="primary"
              className="mt-6 bg-indigo-600 hover:bg-indigo-700"
            >
              Choose Plan
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default PricingComponent;
