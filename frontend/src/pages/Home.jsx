import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-surface p-8 mb-6 transition transform hover:-translate-y-1">
        <h1 className="text-3xl font-bold text-cbelight-primary mb-2">Business Intelligence with Technology</h1>
        <p className="text-gray-700 mb-4">Welcome to <span className="font-semibold text-cbelight-primary">CBELight </span> — A new program which open new world of Technology in Business Education at CBE Mwanza Campus.</p>
        <p className="mb-4 font-bold">"We learn with purpose, grow with knowledge, and rise with competence."</p>
        <Link to="/signup" className="inline-block bg-cbelight-primary text-white px-4 py-2 rounded transition hover:opacity-95">Get started — Signup</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-surface p-4 animate-glow">
          <h3 className="font-semibold text-cbelight-primary">Digital Learning</h3>
          <p className="text-sm text-gray-600">We learn using smart tools and online platforms.
                  This helps us to organize studies  — study anytime, anywhere.
                  Technology makes learning faster, easier, and more fun.</p>
        </div>
        <div className="card-surface p-4">
          <h3 className="font-semibold text-cbelight-primary">Practical Understanding</h3>
          <p className="text-sm text-gray-600">We don’t just read — we do.
                  We work with real business data, solve problems, and build projects.
                  This helps us understand how business works in the real world.</p>
        </div>
        <div className="card-surface p-4">
          <h3 className="font-semibold text-cbelight-primary">High Performance</h3>
          <p className="text-sm text-gray-600">We aim to be the best.
                We track our progress, set goals, and push ourselves to grow.
                With the right tools and mindset, we become confident, skilled, and ready for success.</p>
        </div>
      </div>
    </div>
  )
}
