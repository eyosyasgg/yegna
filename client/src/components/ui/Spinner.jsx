export default function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-10 h-10 border-[3px] border-border border-t-amber rounded-full animate-spin" />
    </div>
  );
}
