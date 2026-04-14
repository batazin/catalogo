'use client';

import { motion } from 'framer-motion';

const images = [
  { src: '/img1.jpeg', alt: 'Momentos 1' },
  { src: '/img2.jpeg', alt: 'Momentos 2' },
  { src: '/img3.jpeg', alt: 'Momentos 3' },
];

export default function PhotoGallery() {
  return (
    <section className="container" style={{ padding: '6rem 2rem', overflow: 'hidden' }}>
      <h2 className="serif" style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem', color: 'var(--foreground)' }}>Nossa Jornada</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '3rem' 
      }}>
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9, rotate: i % 2 === 0 ? -2 : 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -15, scale: 1.02 }}
            style={{ 
              position: 'relative', 
              aspectRatio: '4 / 5', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: 'var(--shadow)',
              cursor: 'pointer',
              background: '#fff'
            }}
          >
            {/* Imagem com transição de cor */}
            <motion.img 
              src={img.src} 
              alt={img.alt} 
              initial={{ filter: 'grayscale(0.8) contrast(1.1)' }}
              whileHover={{ filter: 'grayscale(0) contrast(1)' }}
              transition={{ duration: 0.6 }}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
            />

            {/* Overlay de Glassmorphism */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '20px',
                padding: '20px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <p className="serif" style={{ fontSize: '1.2rem', fontWeight: '600', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                {img.alt}
              </p>
            </motion.div>

            {/* Brilho dinâmico no hover */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 0.3 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent)',
                pointerEvents: 'none'
              }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
