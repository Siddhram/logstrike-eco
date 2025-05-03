export function Loader() {
  return (
    <div className="flex bg-[#111111] items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-[#8B5CF6]/20 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-[#8B5CF6] rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-[#8B5CF6] text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}