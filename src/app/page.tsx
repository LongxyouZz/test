import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Film,
  Image as ImageIcon,
  Play,
  Sparkles,
  Video,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <Hero />

      {/* Featured Content Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              Featured Content
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore my latest creative works and popular content in both
              English and Khmer languages.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image:
                  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
                icon: <Video className="w-6 h-6" />,
                title: "Short Videos",
                description: "Engaging short-form video content",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1554941829-202a0b2403b8?w=600&q=80",
                icon: <ImageIcon className="w-6 h-6" />,
                title: "Photography",
                description: "High-quality image collections",
              },
              {
                image:
                  "https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=600&q=80",
                icon: <Sparkles className="w-6 h-6" />,
                title: "Creative Projects",
                description: "Unique multimedia collaborations",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                    <div>
                      <div className="text-white mb-2 flex items-center gap-2">
                        {item.icon}
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                      </div>
                      <p className="text-gray-200">{item.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline"
                  >
                    View Collection
                    <ArrowUpRight className="ml-1 w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Videos Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              Latest Videos
            </h2>
            <a
              href="/gallery?type=videos"
              className="text-blue-600 dark:text-blue-400 font-medium flex items-center hover:underline"
            >
              View All Videos
              <ArrowUpRight className="ml-1 w-4 h-4" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-video">
                  <Image
                    src={`https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80`}
                    alt={`Video thumbnail ${item}`}
                    width={400}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all">
                      <Play className="w-5 h-5 text-blue-600 ml-0.5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    Video Title {item}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    2 days ago • 3:45
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe for Updates</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Get notified when new content is published in your preferred
            language.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg flex-grow text-gray-900 dark:text-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
