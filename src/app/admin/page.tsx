'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { Gift } from "@prisma/client";
import { showAlert, showConfirm, showToast } from "@/lib/swal";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      fetchGifts();
    }
  }, [status]);

  const fetchGifts = async () => {
    try {
      const response = await fetch('/api/gifts');
      if (!response.ok) throw new Error('Failed to fetch gifts');
      const data = await response.json();
      setGifts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const response = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price, image }),
      });
      
      if (!response.ok) throw new Error('Failed to create gift');

      setName('');
      setDescription('');
      setPrice('');
      setImage('');
      // Reset file input
      const fileInput = document.getElementById('image-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      setFileName('');
      
      fetchGifts();
      showToast('Presente adicionado com sucesso!');
    } catch (error) {
      showAlert('Erro', 'Não foi possível adicionar o presente', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirm('Tem certeza?', 'Essa ação não pode ser desfeita.', 'Excluir', 'Cancelar');
    if (!result.isConfirmed) return;
    
    try {
      const response = await fetch(`/api/gifts?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete gift');
      fetchGifts();
      showToast('Removido com sucesso!');
    } catch (error) {
      showAlert('Erro', 'Não foi possível excluir o item', 'error');
    }
  };

  if (status === "loading" || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
      </div>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="container" style={{ padding: '4rem 2rem' }}>
        <h1 className="serif" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Gestão de Presentes</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
          {/* Add Gift Form */}
          <div className="glass" style={{ padding: '2rem', height: 'fit-content' }}>
            <h2 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Plus size={20} /> Novo Item
            </h2>
            <form onSubmit={handleAddGift} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                placeholder="Nome do presente" 
                required 
                value={name || ''}
                onChange={e => setName(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
              />
              <textarea 
                placeholder="Descrição" 
                rows={3}
                value={description || ''}
                onChange={e => setDescription(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'inherit' }}
              />
              <input 
                placeholder="Valor (Ex: 150.00)" 
                type="number" 
                step="0.01" 
                required 
                value={price || ''}
                onChange={e => setPrice(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }}
              />
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    setFileName(file.name);
                    const reader = new FileReader();
                    reader.onloadend = () => setImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ 
                  position: 'relative',
                  border: `2px dashed ${isDragging ? 'var(--primary)' : '#ddd'}`,
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: isDragging ? 'var(--primary-light)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <input 
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFileName(file.name);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImage(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />
                
                {image ? (
                  <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                      <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fileName || 'Imagem selecionada'}
                    </span>
                    <button 
                      type="button" 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setImage(''); setFileName(''); }}
                      style={{ fontSize: '0.7rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '50%', color: 'var(--primary)' }}>
                      <ImageIcon size={24} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: 'var(--foreground)' }}>Clique para fazer upload</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>ou arraste e solte a imagem aqui</p>
                    </div>
                  </>
                )}
              </div>
              <button disabled={adding} type="submit" className="btn btn-primary">
                {adding ? <Loader2 className="animate-spin" /> : 'Cadastrar Presente'}
              </button>
            </form>
          </div>

          {/* Gifts List */}
          <div className="glass" style={{ padding: '2rem' }}>
            <h2 className="serif" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Itens Cadastrados</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {gifts.map(gift => (
                <div key={gift.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem', 
                  borderBottom: '1px solid #eee',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: '#eee' }}>
                      {gift.image ? <img src={gift.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={20} style={{ margin: '15px' }} />}
                    </div>
                    <div>
                      <h4 style={{ margin: '0' }}>{gift.name}</h4>
                      <p style={{ margin: '0', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '600' }}>
                        R$ {gift.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      padding: '4px 8px', 
                      borderRadius: '10px',
                      background: gift.status === 'BOUGHT' ? '#dcfce7' : '#f3f4f6',
                      color: gift.status === 'BOUGHT' ? '#166534' : '#666'
                    }}>
                      {gift.status}
                    </span>
                    <button onClick={() => handleDelete(gift.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {gifts.length === 0 && <p>Nenhum presente cadastrado.</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
