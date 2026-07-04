export default function HeaderPage() {
  return (
    <header className="h-16 bg-[#2d1b5a] text-white flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold">
          S
        </div>
        <div>
          <h1 className="text-sm font-bold leading-tight">SimRecruiter</h1>
          <p className="text-[10px] opacity-70">AI Screening Platform</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-white/10 px-3 py-1 rounded-full text-xs flex items-center gap-2">
          <span>🕒 Jun 29, 2026</span>
        </div>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs text-black font-bold">
          HR
        </div>
      </div>
    </header>
  );
}
