import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TruckIcon, ShieldCheckIcon, HeartIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about HamroMart — our mission to deliver fresh, local produce to your doorstep.",
};

const values = [
  { icon: TruckIcon, title: "Fast Delivery", desc: "Same-day delivery on orders placed before noon. We get fresh produce to your door while it's still fresh." },
  { icon: ShieldCheckIcon, title: "Quality Guaranteed", desc: "Every item is inspected before shipping. Not satisfied? We'll replace it or refund you." },
  { icon: HeartIcon, title: "Community First", desc: "We partner with local farmers and producers to support sustainable agriculture in our region." },
];

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Products" },
  { value: "50+", label: "Local Farms" },
  { value: "4.8", label: "Average Rating" },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Freshness You Can Trust
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            We connect local farmers with your kitchen, delivering the freshest produce straight from the farm to your doorstep.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="card p-5 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              HamroMart started with a simple idea: everyone deserves access to fresh, locally-sourced food. What began as a small delivery service has grown into a full marketplace connecting local farmers, producers, and artisans with customers who care about quality.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We believe in transparent sourcing, fair pricing for farmers, and uncompromising freshness for our customers. Every product in our catalog is handpicked from trusted local suppliers who share our commitment to quality.
            </p>
          </div>
          <div className="relative w-full h-72 rounded-2xl overflow-hidden">
            <Image src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80" alt="Fresh produce" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Why Choose Us</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div key={v.title} className="card p-6 text-center group hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <v.icon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="card p-8 text-center bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-gray-900 border-emerald-100 dark:border-emerald-900/30">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ready to Taste the Difference?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Join thousands of happy customers who choose fresh, local produce every day.</p>
          <Link href="/products" className="btn-primary inline-flex">
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}
