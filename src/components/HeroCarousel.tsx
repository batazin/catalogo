'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const images = [
  '/IMG_1577.jpeg',
  '/IMG_1580.jpeg',
  '/IMG_1594.jpeg',
];

export default function HeroCarousel() {
  const container = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const cards = cardsRef.current.filter(Boolean);
    
    // Animação de flutuação independente para cada card
    cards.forEach((card, i) => {
      // Flutuação Vertical Infinita
      gsap.to(card, {
        y: i % 2 === 0 ? -15 : 15,
        duration: 3 + i,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.4
      });

      // Rotação Infinita Suave
      gsap.to(card, {
        rotation: i % 2 === 0 ? 3 : -3,
        duration: 4 + i,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.5,
        transformOrigin: "50% 0%"
      });
    });

    // Parallax Total (X e Y) - Reação sutil ao movimento do mouse na seção
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (clientX - centerX) / 50;
      const moveY = (clientY - centerY) / 50;

      cards.forEach((card, i) => {
        gsap.to(card, {
          x: moveX * (i + 1) * 0.4,
          y: moveY * (i + 1) * 0.4,
          duration: 1.2,
          ease: "power2.out",
          overwrite: 'auto'
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: container });

  // Efeito de Inclinação (Tilt) Individual
  const handleCardTilt = (e: React.MouseEvent<HTMLDivElement>, card: HTMLDivElement) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const centerX = width / 2;
    const centerY = height / 2;
    const rotateX = (centerY - y) / 10;
    const rotateY = (x - centerX) / 10;

    gsap.to(card, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.05,
      zIndex: 50,
      duration: 0.5,
      ease: "power2.out",
      overwrite: 'auto'
    });
  };

  const resetCardTilt = (card: HTMLDivElement) => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      zIndex: 5,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)"
    });
  };

  return (
    <div ref={container} style={{ 
      height: '600px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem',
      overflow: 'hidden',
      width: '100%',
      position: 'relative',
      background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 80%)'
    }}>
      {/* Cordinha Realista - Tela Inteira - Alinhamento Milimétrico */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 1440 600" 
          preserveAspectRatio="none"
          style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.15))' }}
        >
          {/* Path alinhado matematicamente com o topo dos prendedores (95px nas pontas, 155px no centro) */}
          <path 
            d="M-100,95 C350,95 500,155 720,155 C940,155 1090,95 1540,95" 
            fill="none" 
            stroke="#dcc499" 
            strokeWidth="4" 
            strokeLinecap="round"
            strokeDasharray="1, 2" 
          />
          {/* Sombra da corda */}
          <path 
            d="M-100,100 C350,100 500,160 720,160 C940,160 1090,100 1540,100" 
            fill="none" 
            stroke="rgba(0,0,0,0.05)" 
            strokeWidth="3.5" 
          />
        </svg>
      </div>

      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '1200px', 
        height: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 2rem',
        perspective: '1000px'
      }}>
        {images.map((img, i) => (
          <div
            key={i}
            ref={(el) => { cardsRef.current[i] = el; }}
            onMouseMove={(e) => handleCardTilt(e, e.currentTarget)}
            onMouseLeave={(e) => resetCardTilt(e.currentTarget)}
            style={{
              width: 'min(320px, 28vw)',
              position: 'relative',
              zIndex: 5,
              marginTop: i === 1 ? '60px' : '0',
              transformStyle: 'preserve-3d',
              cursor: 'pointer',
              transition: 'z-index 0.3s'
            }}
          >
            {/* O Prendedor */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              translate: '-50% 0',
              width: '12px',
              height: '32px',
              background: '#d4a373',
              borderRadius: '2px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 100,
              transform: 'translateZ(20px)'
            }}>
              <div style={{ position: 'absolute', top: '25%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.1)' }} />
            </div>

            {/* A Foto Polaroid */}
            <div style={{
              backgroundColor: 'white',
              padding: '12px 12px 45px 12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(0,0,0,0.05)',
              borderRadius: '2px',
              transformStyle: 'preserve-3d'
            }}>
              <div style={{ 
                width: '100%', 
                aspectRatio: '1', 
                overflow: 'hidden', 
                borderRadius: '2px',
                transform: 'translateZ(10px)'
              }}>
                <img
                  src={img}
                  alt={`Foto ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
