import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ModalAlert({ titulo, mensagem, onClose, danger = false }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-[#1c1c1c] text-white p-6 rounded-2xl shadow-xl w-[90%] max-w-sm text-center"
        >
          <h2
            className={`text-lg font-bold mb-3 ${
              danger ? "text-red-500" : "text-green-400"
            }`}
          >
            {titulo}
          </h2>
          <p className="text-sm mb-6 opacity-80">{mensagem}</p>

          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-md font-semibold ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            OK
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
