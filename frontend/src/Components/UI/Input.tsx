interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
      <input
        {...props}
        className={`bg-white border ${error ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 text-slate-900 placeholder-slate-300 outline-none transition-all duration-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 text-sm`}
      />
      {error && (
        <span className="text-red-500 text-[11px] font-bold ml-1 flex items-center gap-1 whitespace-nowrap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4M12 16h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/></svg>
          {error}
        </span>
      )}
    </div>
  );
}
