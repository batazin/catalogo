'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const images = [
  { src: '/img1.jpeg', alt: 'Momentos 1' },
  { src: '/img2.jpeg', alt: 'Momentos 2' },
  { src: '/img3.jpeg', alt: 'Momentos 3' },
];

export default function PhotoGallery() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="container" style={{ padding: isMobile ? '4rem 1rem' : '6rem 2rem', overflow: 'hidden' }}>
      <h2 className="serif" style={{ textAlign: 'center', fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: isMobile ? '2rem' : '4rem', color: 'var(--foreground)' }}>Nossa Jornada</h2>
      <div style={isMobile ? {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        perspective: '1000px'
      } : { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '3rem' 
      }}>
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={isMobile 
              ? { opacity: 0, rotateY: i % 2 === 0 ? -45 : 45, z: -100, y: 50 } 
              : { opacity: 0, scale: 0.9, rotate: i % 2 === 0 ? -2 : 2 }
            }
            whileInView={isMobile 
              ? { opacity: 1, rotateY: 0, z: 0, y: 0 } 
              : { opacity: 1, scale: 1, rotate: 0 }
            }
            viewport={{ once: true, margin: isMobile ? "-20px" : "-100px" }}
            transition={{ 
              duration: 1.2, 
              delay: isMobile ? i * 0.2 : i * 0.15, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            whileHover={!isMobile ? { y: -15, scale: 1.02 } : {}}
            style={{ 
              position: 'relative', 
              width: isMobile ? '85%' : '100%',
              maxWidth: isMobile ? '300px' : 'none',
              aspectRatio: '1 / 1', 
              borderRadius: isMobile ? '50%' : '24px', 
              overflow: 'hidden', 
              boxShadow: isMobile ? '0 10px 30px rgba(0,0,0,0.1)' : 'var(--shadow)',
              cursor: 'pointer',
              background: '#fff',
              border: isMobile ? '8px solid white' : 'none'
            }}
          >
            <motion.img 
              src={img.src} 
              alt={img.alt} 
              initial={{ filter: isMobile ? 'grayscale(0) contrast(1)' : 'grayscale(0.8) contrast(1.1)' }}
              whileHover={!isMobile ? { filter: 'grayscale(0) contrast(1)' } : {}}
              transition={{ duration: 0.6 }}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
            />
            
            <motion.div 
              initial={isMobile ? { opacity: 0.8, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={!isMobile ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                bottom: isMobile ? '0' : '20px',
                left: isMobile ? '0' : '20px',
                right: isMobile ? '0' : '20px',
                padding: isMobile ? '10px' : '20px',
                background: isMobile ? 'rgba(0,0,0,0.4)' : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: isMobile ? 'none' : 'blur(12px)',
                WebkitBackdropFilter: isMobile ? 'none' : 'blur(12px)',
                borderRadius: isMobile ? '0' : '16px',
                border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <p className="serif" style={{ fontSize: isMobile ? '0.9rem' : '1.2rem', fontWeight: '600', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                {img.alt}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileHover={!isMobile ? { opacity: 0.3 } : {}}
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