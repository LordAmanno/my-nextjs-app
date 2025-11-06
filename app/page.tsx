'use client';

import { useEffect, useState } from 'react';
import TextBlock from '@/components/blocks/TextBlock';
import HeroBlock from '@/components/blocks/HeroBlock';
import ImageBlock from '@/components/blocks/ImageBlock';
import GalleryBlock from '@/components/blocks/GalleryBlock';
import TwoColumnBlock from '@/components/blocks/TwoColumnBlock';
import VideoBlock from '@/components/blocks/VideoBlock';
import ContactFormBlock from '@/components/blocks/ContactFormBlock';
import TestimonialsBlock from '@/components/blocks/TestimonialsBlock';
import SpacerBlock from '@/components/blocks/SpacerBlock';

interface Block {
  id: number;
  block_type: string;
  block_order: number;
  content: any;
  styles: any;
}

const blockComponents: Record<string, any> = {
  text: TextBlock,
  hero: HeroBlock,
  image: ImageBlock,
  gallery: GalleryBlock,
  'two-column': TwoColumnBlock,
  video: VideoBlock,
  contact: ContactFormBlock,
  testimonials: TestimonialsBlock,
  spacer: SpacerBlock,
};

export default function Home() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlocks() {
      try {
        const response = await fetch('/api/blocks');
        if (response.ok) {
          const data = await response.json();
          setBlocks(data);
        }
      } catch (error) {
        console.error('Error fetching blocks:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlocks();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}>
        <div style={{
          fontSize: '24px',
          color: '#666',
          fontWeight: '500',
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '40px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '48px',
          color: '#333',
          marginBottom: '20px',
          fontWeight: 'bold',
        }}>
          Welcome to Your Website
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#666',
          marginBottom: '30px',
          maxWidth: '600px',
        }}>
          Your website is empty. Go to the admin dashboard to start building your page with blocks.
        </p>
        <a
          href="/admin/dashboard"
          style={{
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            padding: '15px 40px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: '600',
            display: 'inline-block',
          }}
        >
          Go to Admin Dashboard
        </a>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh' }}>
      {blocks.map((block) => {
        const BlockComponent = blockComponents[block.block_type];

        if (!BlockComponent) {
          return null;
        }

        return (
          <BlockComponent
            key={block.id}
            content={block.content}
            styles={block.styles}
          />
        );
      })}
    </main>
  );
}
