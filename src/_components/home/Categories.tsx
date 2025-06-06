"use client";

import React from "react";
import {
  GiMeat,
  GiMilkCarton,
  GiShoppingCart,
  GiFruitBowl,
  GiCarrot,
} from "react-icons/gi";
import { FaEgg } from "react-icons/fa";

// Define the type for each category
type Category = {
  icon: React.ElementType;
  label: string;
};

// Array of category data
const categories: Category[] = [
  { icon: GiCarrot, label: "Vegetables" },
  { icon: GiFruitBowl, label: "Fruits" },
  { icon: GiShoppingCart, label: "Shopping" },
  { icon: GiMilkCarton, label: "Milks" },
  { icon: FaEgg, label: "Eggs" },
  { icon: GiMeat, label: "Meats" },
];

const Categories: React.FC = () => {
  return (
    <div className="text-center py-10 dark:bg-gray-900">
      <h2 className="text-2xl font-bold dark:text-white">
        Discover our{" "}
        <span className="text-green-500 underline decoration-green-300 decoration-4">
          Categories
        </span>
      </h2>

      <div className="mt-10 flex flex-wrap justify-center gap-6">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <div
              key={index}
              className="w-40 h-40 border border-gray-200 dark:border-gray-700 dark:hover:shadow-gray-700 rounded-2xl flex flex-col items-center justify-center hover:shadow-lg transition duration-300 group bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900"
            >
              <Icon
                size={40}
                className="text-green-500 mb-2 transform transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110"
              />
              <p className="text-sm font-semibold text-center px-2 text-gray-700 dark:text-gray-200">
                {cat.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
