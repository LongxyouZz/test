import Link from "next/link";
import { ArrowUpRight, Check, Play } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-gray-900 dark:to-purple-950 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
                Creative
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  {" "}
                  Content{" "}
                </span>
                Creator
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Explore my collection of short videos and images showcasing
                creative content in both English and Khmer languages.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link
                  href="/gallery"
                  className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
                >
                  View Gallery
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center px-8 py-4 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-lg font-medium"
                >
                  About Me
                </Link>
              </div>

              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Short Videos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>High Quality Images</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Multilingual Content</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80"
                  alt="Content Creator Showcase"
                  width={800}
                  height={450}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                    <Play className="w-6 h-6 text-blue-600 ml-1" />
                  </button>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-lg overflow-hidden shadow-lg hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80"
                  alt="Content Preview"
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
