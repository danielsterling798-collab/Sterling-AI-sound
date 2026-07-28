import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X, ShieldAlert, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DangerZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmationWord: string; // e.g., "RESET COHORT" or "CLEAR ALL DATA"
  actionLabel?: string;
}

export const DangerZoneModal: React.FC<DangerZoneModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Danger Zone: Destructive Action",
  description = "This action will permanently delete items. Accidental deletion may reset your active 14-day continuous closed testing streak as mandated by Google Play console standards.",
  confirmationWord,
  actionLabel = "Confirm Delete"
}) => {
  const [typedConfirmation, setTypedConfirmation] = useState('');
  const [errorText, setErrorText] = useState('');

  // Reset text on open state
  useEffect(() => {
    if (isOpen) {
      setTypedConfirmation('');
      setErrorText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleActionConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedConfirmation.trim().toUpperCase() !== confirmationWord.toUpperCase()) {
      setErrorText(`Mistype mismatch. Please enter exactly "${confirmationWord}" to authorize deletion.`);
      return;
    }
    setErrorText('');
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-zinc-950 border border-red-900/60 rounded-3xl w-full max-w-md shadow-2xl relative text-zinc-100 overflow-hidden"
        >
          {/* Subtle top red glow accent */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-550 text-rose-500">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h3 className="font-extrabold text-white text-base tracking-tight font-sans">
                {title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-900 text-zinc-500 hover:text-white rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleActionConfirm} className="p-6 space-y-4 text-left">
            {/* Warning block layout */}
            <div className="p-4 bg-red-950/25 border border-red-900/40 rounded-2xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-red-200 leading-relaxed">
                <strong>Irreversible Action Warning:</strong> {description}
              </div>
            </div>

            {/* Instruction context to verify typing */}
            <div className="space-y-2">
              <p className="text-[11px] text-zinc-440 text-zinc-400 font-sans leading-relaxed">
                To double-check you intent and defend your 14-day metrics, please type <span className="font-bold text-red-400 font-mono select-all bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800">
                  {confirmationWord}
                </span> below:
              </p>

              <input
                type="text"
                required
                value={typedConfirmation}
                onChange={(e) => {
                  setTypedConfirmation(e.target.value);
                  if (errorText) setErrorText('');
                }}
                className="w-full bg-zinc-900 border border-zinc-805 border-zinc-800 focus:border-red-600 rounded-xl p-3 text-xs text-white font-mono font-bold placeholder-zinc-650 outline-none transition-all"
                placeholder={confirmationWord}
                autoFocus
              />
            </div>

            {errorText && (
              <p className="text-[11px] text-red-450 text-red-400 leading-tight flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {errorText}
              </p>
            )}

            {/* Danger actions footer */}
            <div className="pt-4 border-t border-zinc-900 flex justify-end gap-3 font-sans">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-lg hover:shadow-red-600/10"
              >
                <Trash2 className="w-4 h-4" /> {actionLabel}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
  
