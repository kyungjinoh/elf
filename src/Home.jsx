import { useState } from 'react'

function Home() {
  const [linkCopied, setLinkCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText('NGL.LINK/KINGEBERE_/TBH')
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  // Generate snowflakes
  const snowflakes = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
    size: (Math.random() * 4 + 2) * 5,
  }))

  return (
    <div className="h-screen overflow-hidden flex flex-col relative" style={{ background: 'linear-gradient(to bottom, #ffcccb, #ff6b6b)' }}>
      {/* Snow Effect */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {snowflakes.map((snowflake) => (
          <div
            key={snowflake.id}
            className="absolute text-white opacity-70 snowflake"
            style={{
              left: `${snowflake.left}%`,
              top: '-10px',
              animationDelay: `${snowflake.delay}s`,
              animationDuration: `${snowflake.duration}s`,
              fontSize: `${snowflake.size}px`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* ELF Header */}
      <div className="text-center py-2 border-b border-gray-300 flex-shrink-0 bg-white">
        <img 
          src="/ELF-removebg-preview.png" 
          alt="ELF" 
          className="h-12 mx-auto object-contain"
        />
      </div>
      
      {/* Top Navigation */}
      <nav className="flex items-center justify-between px-6 pt-4 pb-2 flex-shrink-0 border-b border-gray-300 bg-white">
        <div className="flex-1"></div>
        <div className="flex items-center gap-8 flex-1 justify-center">
          <button className="text-2xl font-bold text-black">PLAY</button>
          <button className="text-2xl font-medium text-gray-400">INBOX</button>
        </div>
        <div className="flex-1 flex justify-end">
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          </button>
        </div>
      </nav>

      {/* Main Card Carousel */}
      <div className="px-4 flex-1 flex flex-col justify-center min-h-0">
        <div className="relative">
          {/* Card Container */}
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-1">
            {/* Left card (partial) */}
            <div className="flex-shrink-0 w-16"></div>
            
            {/* Main Card */}
            <div className="flex-shrink-0 w-[calc(100%-4rem)] mx-2 rounded-3xl shadow-xl overflow-hidden snap-center flex flex-col">
              {/* Orange Top Section */}
              <div className="pt-12 pb-10 flex flex-col items-center" style={{ backgroundColor: '#be2616' }}>
                {/* Profile Image */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <img
                      src="/profile.png"
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-lg"
                      onError={(e) => {
                        // Fallback to placeholder if image doesn't exist
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect width="96" height="96" fill="%23ddd" rx="48"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3EUser%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* White Bottom Section */}
              <div className="bg-white pt-10 pb-12 px-4">
                <p className="text-center text-black text-lg font-bold leading-tight">
                  send a name for a friendship tbh
                </p>
              </div>
            </div>

            {/* Right card (partial) */}
            <div className="flex-shrink-0 w-16"></div>
          </div>
        </div>
      </div>

      {/* Link & Share Section */}
      <div className="px-4 -mt-6 space-y-3 pb-4 flex-shrink-0">
        {/* Step 1: Copy Link */}
        <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-100">
          <h3 className="text-lg font-bold text-black mb-5 text-center">
            Step 1: Copy your link
          </h3>
          <div className="text-gray-500 text-base mb-6 font-mono tracking-wide text-center">
            NGL.LINK/KINGEBERE_/TBH
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full py-4 px-4 rounded-xl border-2 bg-white font-semibold transition-colors text-base"
            style={{
              borderColor: '#be2616',
              color: '#be2616',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e6e4'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            onMouseDown={(e) => e.target.style.backgroundColor = '#e8d4d1'}
            onMouseUp={(e) => e.target.style.backgroundColor = '#f5e6e4'}
          >
            {linkCopied ? 'Copied!' : 'copy link'}
          </button>
        </div>

        {/* Step 2: Share Link */}
        <div className="bg-red-50 rounded-2xl p-6 shadow-sm border border-red-100">
          <h3 className="text-lg font-bold text-black mb-4 text-center">
            Step 2: Share link on your Instagram Story
          </h3>
          <button className="w-full py-5 px-4 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl active:shadow-md transition-all flex items-center justify-center gap-2 text-base" style={{ background: 'linear-gradient(to right, #be2616, #dc2626, #ef4444)' }}>
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span>Share!</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home

