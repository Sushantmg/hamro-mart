"use client";

import Categories from "@/_components/home/Categories";
import Footer from "@/_components/home/Footer";
import Img from "@/_components/Img";
import Home from "@/_pages/Home";
import Products from "@/_pages/Products";


export default function HomePage() {
  return (
    <>
      <Home/>
      <Categories/>
      <Products/>
      <Img/>
      <Footer/>
    </>
  );
}
