'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import GiftCard from '@/components/GiftCard';
import HeroCarousel from '@/components/HeroCarousel';
import PhotoGallery from '@/components/PhotoGallery';
import { Gift } from '@prisma/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Home() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGifts = async () => {
    try {
      const response = await fetch('/api/gifts');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setGifts(data);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGifts();
    
    // Polling every 5 seconds to update gift status (Real-time update)
    const interval = setInterval(() => {
      fetchGifts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero animate-fade">
        <HeroCarousel />
        
        <div className="container">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Heart size={48} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
            <h1 className="serif">Nossa Casa Nova</h1>
            <p>
              Estamos muito felizes em compartilhar esse momento com você! 
              Se desejar nos presentear, escolha um item abaixo. 
              Todas as contribuições nos ajudarão a construir nosso novo lar.
            </p>
          </motion.div>
        </div>
      </section>

      <PhotoGallery />

      {/* Gifts Gallery */}
      <section className="container" style={{ paddingBottom: '8rem' }}>
        <h2 className="serif" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Lista de Presentes</h2>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Carregando presentes...</div>
        ) : (
          <div className="gifts-grid">
            <AnimatePresence>
              {gifts.map((gift) => (
                <GiftCard 
                  key={gift.id} 
                  gift={gift} 
                  onSuccess={fetchGifts} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {gifts.length === 0 && !loading && (
          <div className="glass" style={{ textAlign: 'center', padding: '4rem', maxWidth: '600px', margin: '0 auto' }}>
            <p className="serif" style={{ fontSize: '1.2rem' }}>Ainda estamos preparando os itens. Volte em breve!</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ 
        textAlign: 'center', 
        padding: '4rem 0', 
        background: 'var(--primary-light)', 
        color: 'var(--primary)',
        marginTop: '4rem'
      }}>
        <p className="serif" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Com carinho,</p>
        <p style={{ marginTop: '0.5rem' }}>Obrigado por fazer parte desse sonho!</p>
      </footer>
    </main>
  );
}
