import React from 'react';
import { Loader2, Check, X, Trash2 } from 'lucide-react';

export const Loader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-400">
    <Loader2 className="w-6 h-6 animate-spin" />
    <span className="text-xs font-mono uppercase tracking-widest">{text}</span>
  </div>
);

export const EmptyState = ({ text }) => (
  <div className="py-16 text-center font-mono text-xs uppercase tracking-widest text-neutral-400 border border-dashed border-neutral-200 rounded">
    [ {text} ]
  </div>
);

export const AdminInput = ({ label, id: customId, ...props }) => {
  const generatedId = React.useId();
  const id = customId || generatedId;
  return (
    <div className="flex flex-col gap-1.5 group">
      {label && (
        <label htmlFor={id} className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-neutral-400 group-focus-within:text-black transition-colors">
          {label}
        </label>
      )}
      <input
        id={id}
        name={id}
        className="border-2 border-neutral-200 focus:border-black focus:outline-none px-4 py-3 text-sm font-medium transition-all bg-white shadow-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-0.5 focus:-translate-y-0.5"
        {...props}
      />
    </div>
  );
};

export const AdminTextarea = ({ label, id: customId, ...props }) => {
  const generatedId = React.useId();
  const id = customId || generatedId;
  return (
    <div className="flex flex-col gap-1.5 group">
      {label && (
        <label htmlFor={id} className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-neutral-400 group-focus-within:text-black transition-colors">
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={id}
        className="border-2 border-neutral-200 focus:border-black focus:outline-none px-4 py-3 text-sm font-medium transition-all bg-white shadow-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-0.5 focus:-translate-y-0.5 resize-none"
        {...props}
      />
    </div>
  );
};

export const AdminSelect = ({ label, options, id: customId, ...props }) => {
  const generatedId = React.useId();
  const id = customId || generatedId;
  return (
    <div className="flex flex-col gap-1.5 group">
      {label && (
        <label htmlFor={id} className="text-[10px] font-mono uppercase tracking-[0.2em] font-black text-neutral-400 group-focus-within:text-black transition-colors">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={id}
          className="w-full border-2 border-neutral-200 focus:border-black focus:outline-none px-4 py-3 text-sm font-medium transition-all bg-white shadow-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-0.5 focus:-translate-y-0.5 appearance-none cursor-pointer"
          {...props}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
        </div>
      </div>
    </div>
  );
};

export const Badge = ({ children, variant = 'default' }) => {
  const v = {
    default: 'bg-neutral-100 text-neutral-500 border-neutral-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };
  return (
    <span className={`text-[9px] font-mono font-black uppercase tracking-[0.2em] px-2.5 py-1 border ${v[variant]}`}>
      {children}
    </span>
  );
};

export const ConfirmBtn = ({ onConfirm, loading }) => {
  const [asking, setAsking] = React.useState(false);
  if (asking) return (
    <div className="flex items-center gap-1">
      <button onClick={() => { onConfirm(); setAsking(false); }} className="p-1 bg-red-600 text-white hover:bg-red-700 shadow-brutal-sm">
        <Check className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => setAsking(false)} className="p-1 bg-neutral-200 hover:bg-neutral-300">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
  return (
    <button onClick={() => setAsking(true)} disabled={loading} className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  );
};
