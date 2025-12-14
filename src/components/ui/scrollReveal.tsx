"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string; 
}

export default function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  return (
    <motion.div
      // 1. Estado inicial: Invisible y desplazado 50px hacia abajo
      initial={{ opacity: 0, y: 50 }}
      
      // 2. Estado final: Visible y en su posición original
      whileInView={{ opacity: 1, y: 0 }}
      
      // 3. Configuración del trigger:
      // once: true -> Solo se anima la primera vez que bajas (no desaparece al subir)
      // margin: "-100px" -> La animación empieza cuando el elemento ya entró un poco en pantalla
      viewport={{ once: true, margin: "-100px" }}
      
      // 4. Duración y suavidad
      transition={{ duration: 0.6, ease: "easeOut" }}
      
      className={className}
    >
      {children}
    </motion.div>
  );
}