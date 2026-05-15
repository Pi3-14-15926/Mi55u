import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ open, title, message, confirmText = '确定', cancelText = '取消', onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            style={{ border: '1px solid rgba(208,206,206,0.4)' }}
          >
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Noto Serif SC', serif", color: '#333' }}>{title}</h3>
            <p className="text-sm mb-5" style={{ color: '#777', fontFamily: "'Noto Serif SC', serif" }}>{message}</p>
            <div className="flex gap-2 justify-end">
              <button onClick={onCancel} className="btn-outline text-sm">{cancelText}</button>
              <button onClick={onConfirm} className="btn text-sm" style={{ background: '#fa5c7c' }}>{confirmText}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
