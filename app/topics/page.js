"use client"
import Link from 'next/link';
import { IconBrain, IconGitBranch } from '@tabler/icons-react';

export default function TopicsPage() {
  const features = [
    {
      title: 'Knowledge Tracking',
      description: 'Track your knowledge level across different topics using a 1-5 star rating system. Monitor your progress and identify areas that need more focus.',
      icon: IconBrain,
      href: '/topics/knowledge',
      color: 'bg-pink'
    },
    {
      title: 'Topic Trees',
      description: 'Explore the relationships between different fields of study. Understand how topics are connected and build a comprehensive knowledge map.',
      icon: IconGitBranch,
      href: '/topics/trees',
      color: 'bg-blue-500'
    }
  ];

  return (
    <main className="min-h-screen p-10 xl:p-40">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Topics</h1>
        <p className="text-white/60">
          Manage and visualize your knowledge across different fields of study
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group"
          >
            <div className="bg-black-2 rounded-lg p-6 border border-acc-1 h-full transition-all duration-200 hover:border-pink">
              <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2 group-hover:text-pink transition-colors">
                {feature.title}
              </h2>
              <p className="text-white/60">
                {feature.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
} 