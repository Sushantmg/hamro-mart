"use client";

import React from "react";
import {
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

type Feature = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

const Features: React.FC = () => {
  const features: Feature[] = [
    {
      icon: TruckIcon,
      title: "Free shipping",
      description: "On all orders over $50.00",
    },
    {
      icon: ArrowPathIcon,
      title: "Return for free",
      description: "Returns are free 3 days",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure Payment",
      description: "Your payments 100% safe",
    },
    {
      icon: PhoneIcon,
      title: "24/7 Support",
      description: "Contact us anytime want",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] shadow-lg flex justify-center items-center gap-6 flex-wrap max-w-6xl mx-auto -mt-16 z-10 relative dark:shadow-gray-800">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex items-center gap-4 w-[250px] bg-white dark:bg-gray-800 rounded-xl p-4"
        >
          <div className="bg-green-100 dark:bg-green-800 p-4 rounded-full">
            <feature.icon className="h-8 w-8 text-green-500 dark:text-green-300" />
          </div>
          <div>
            <h4 className="text-lg font-semibold dark:text-white">
              {feature.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Features;
