'use client';

import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import InteractivePreview from './InteractivePreview';

interface Block {
  id: number;
  block_type: string;
  block_order: number;
  content: any;
  styles: any;
}

const BLOCK_TYPES = [
  { value: 'hero', label: 'Hero Section', icon: '🎯', description: 'Large header with title, subtitle, and background' },
  { value: 'text', label: 'Text Block', icon: '📝', description: 'Rich text content with headings and buttons' },
  { value: 'image', label: 'Image Block', icon: '🖼️', description: 'Single image with caption and link' },
  { value: 'two-column', label: 'Two Column', icon: '📊', description: 'Side-by-side text and image layout' },
  { value: 'gallery', label: 'Gallery', icon: '🎨', description: 'Modular image gallery with custom layouts' },
  { value: 'video', label: 'Video Block', icon: '🎬', description: 'YouTube, Vimeo, or direct video embedding' },
  { value: 'contact', label: 'Contact Form', icon: '📧', description: 'Customizable contact form with validation' },
  { value: 'testimonials', label: 'Testimonials', icon: '💬', description: 'Customer testimonials with ratings and carousel' },
  { value: 'spacer', label: 'Spacer', icon: '📏', description: 'Add custom spacing between sections' },
];

export default function BlockEditor() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchBlocks();
  }, []);

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

  async function addBlock(blockType: string) {
    try {
      setSaving(true);
      
      const defaultContent = getDefaultContent(blockType);
      const defaultStyles = getDefaultStyles(blockType);
      
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          block_type: blockType,
          block_order: blocks.length,
          content: defaultContent,
          styles: defaultStyles,
        }),
      });

      if (response.ok) {
        await fetchBlocks();
        setShowAddModal(false);
      }
    } catch (error) {
      console.error('Error adding block:', error);
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlock(id: number) {
    if (!confirm('Are you sure you want to delete this block?')) return;

    try {
      const response = await fetch(`/api/blocks?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchBlocks();
        if (selectedBlock?.id === id) {
          setSelectedBlock(null);
        }
      }
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  }

  async function updateBlock(id: number, content: any, styles: any) {
    try {
      const response = await fetch('/api/blocks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, content, styles }),
      });

      if (response.ok) {
        await fetchBlocks();
      }
    } catch (error) {
      console.error('Error updating block:', error);
    }
  }

  async function moveBlock(index: number, direction: 'up' | 'down') {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];

    const reorderedBlocks = newBlocks.map((block, idx) => ({
      id: block.id,
      block_order: idx,
    }));

    try {
      const response = await fetch('/api/blocks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: reorderedBlocks }),
      });

      if (response.ok) {
        await fetchBlocks();
      }
    } catch (error) {
      console.error('Error reordering blocks:', error);
    }
  }

  // Drag and Drop Functions
  const handleDragStart = (e: React.DragEvent, block: Block) => {
    setDraggedBlock(block);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedBlock) return;

    const dragIndex = blocks.findIndex(block => block.id === draggedBlock.id);
    if (dragIndex === dropIndex) return;

    // Reorder blocks array
    const newBlocks = [...blocks];
    const [draggedItem] = newBlocks.splice(dragIndex, 1);
    newBlocks.splice(dropIndex, 0, draggedItem);

    // Update block orders
    const reorderedBlocks = newBlocks.map((block, idx) => ({
      id: block.id,
      block_order: idx,
    }));

    try {
      const response = await fetch('/api/blocks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: reorderedBlocks }),
      });

      if (response.ok) {
        await fetchBlocks();
      }
    } catch (error) {
      console.error('Error reordering blocks:', error);
    }

    setDraggedBlock(null);
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
    setDragOverIndex(null);
  };

  function getDefaultContent(blockType: string) {
    const defaults: Record<string, any> = {
      hero: {
        title: 'Welcome to Your Website',
        subtitle: 'Build Something Amazing',
        description: 'Start customizing this hero section',
        buttons: [
          { text: 'Get Started', link: '#', style: 'primary' },
        ],
      },
      text: {
        heading: 'New Text Block',
        text: '<p>Start writing your content here...</p>',
        alignment: 'left',
      },
      image: {
        imageUrl: '/placeholder-image.jpg',
        alt: 'Image description',
        caption: 'Image caption',
      },
      'two-column': {
        leftColumn: { type: 'text', content: '<p>Left column content</p>', heading: 'Left Column' },
        rightColumn: { type: 'text', content: '<p>Right column content</p>', heading: 'Right Column' },
      },
      gallery: {
        title: 'Image Gallery',
        images: [],
        expandable: true,
        initialVisibleCount: 6,
      },
      video: {
        title: 'Video Section',
        description: 'Add your video description here',
        videoUrl: '',
        videoType: 'youtube',
        autoplay: false,
        muted: false,
        controls: true,
        loop: false,
      },
      contact: {
        title: 'Contact Us',
        description: 'Get in touch with us using the form below',
        fields: [
          { id: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter your name', required: true },
          { id: 'email', type: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true },
          { id: 'message', type: 'textarea', label: 'Message', placeholder: 'Enter your message', required: true },
        ],
        submitButtonText: 'Send Message',
        successMessage: 'Thank you for your message! We\'ll get back to you soon.',
        emailTo: 'admin@example.com',
      },
      testimonials: {
        title: 'What Our Customers Say',
        description: 'Read testimonials from our satisfied customers',
        testimonials: [
          {
            id: '1',
            name: 'John Doe',
            role: 'CEO',
            company: 'Example Corp',
            testimonial: 'This service exceeded our expectations. Highly recommended!',
            rating: 5,
            avatar: '/placeholder-avatar.jpg',
          },
          {
            id: '2',
            name: 'Jane Smith',
            role: 'Marketing Director',
            company: 'Another Company',
            testimonial: 'Professional, reliable, and results-driven. Great experience!',
            rating: 5,
            avatar: '/placeholder-avatar.jpg',
          },
        ],
        autoplay: true,
        autoplaySpeed: 5000,
        showRatings: true,
        showAvatars: true,
      },
      spacer: {
        height: '80px',
        showDivider: false,
        dividerType: 'line',
        dividerWidth: '100px',
        dividerThickness: '2px',
      },
    };
    return defaults[blockType] || {};
  }

  function getDefaultStyles(blockType: string) {
    const defaults: Record<string, any> = {
      hero: {
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        minHeight: '600px',
        titleSize: '56px',
        textAlign: 'center',
      },
      text: {
        backgroundColor: '#f5f5f5',
        textColor: '#333333',
        headingColor: '#1a1a1a',
        fontSize: '16px',
        padding: '60px 20px',
      },
      image: {
        backgroundColor: '#ffffff',
        padding: '40px 20px',
        borderRadius: '8px',
        alignment: 'center',
      },
      'two-column': {
        backgroundColor: '#ffffff',
        textColor: '#333333',
        padding: '60px 20px',
        gap: '40px',
      },
      gallery: {
        backgroundColor: '#f9f9f9',
        padding: '60px 20px',
        gap: '15px',
        imageBorderRadius: '8px',
      },
      video: {
        backgroundColor: '#ffffff',
        padding: '80px 20px',
        textAlign: 'center',
        titleColor: '#1a1a1a',
        titleSize: '36px',
        descriptionColor: '#666666',
        descriptionSize: '18px',
        videoWidth: '100%',
        aspectRatio: '16:9',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      },
      contact: {
        backgroundColor: '#f8f9fa',
        padding: '80px 20px',
        textAlign: 'center',
        titleColor: '#1a1a1a',
        titleSize: '36px',
        descriptionColor: '#666666',
        descriptionSize: '18px',
        formBackgroundColor: '#ffffff',
        fieldBackgroundColor: '#ffffff',
        fieldBorderColor: '#e0e0e0',
        fieldTextColor: '#333333',
        buttonBackgroundColor: '#1a1a1a',
        buttonTextColor: '#ffffff',
        buttonBorderRadius: '8px',
        formBorderRadius: '12px',
        formShadow: '0 8px 32px rgba(0,0,0,0.1)',
        maxWidth: '600px',
      },
      testimonials: {
        backgroundColor: '#f8f9fa',
        padding: '80px 20px',
        textAlign: 'center',
        titleColor: '#1a1a1a',
        titleSize: '36px',
        descriptionColor: '#666666',
        descriptionSize: '18px',
        testimonialBackgroundColor: '#ffffff',
        testimonialTextColor: '#333333',
        testimonialBorderRadius: '12px',
        testimonialShadow: '0 8px 32px rgba(0,0,0,0.1)',
        nameColor: '#1a1a1a',
        nameSize: '18px',
        roleColor: '#666666',
        roleSize: '14px',
        ratingColor: '#ffc107',
        maxWidth: '800px',
        carouselDots: true,
        carouselArrows: true,
      },
      spacer: {
        backgroundColor: 'transparent',
        dividerColor: '#e0e0e0',
        dividerOpacity: 1,
        mobileHeight: '30px',
        tabletHeight: '50px',
      },
    };
    return defaults[blockType] || {};
  }

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading blocks...</div>;
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', gap: '20px' }}>
      {/* Left Panel - Block List */}
      <div style={{
        width: '350px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflowY: 'auto',
      }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Blocks</h2>
          <button
            onClick={() => setShowAddModal(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333333';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            style={{
              backgroundColor: '#1a1a1a',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            + Add Block
          </button>
        </div>

        {blocks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <p>No blocks yet. Click "Add Block" to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {blocks.map((block, index) => (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, block)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => setSelectedBlock(block)}
                onMouseEnter={(e) => {
                  if (selectedBlock?.id !== block.id) {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedBlock?.id !== block.id) {
                    e.currentTarget.style.backgroundColor = '#fafafa';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
                style={{
                  padding: '15px',
                  backgroundColor:
                    dragOverIndex === index ? '#e8f5e8' :
                    selectedBlock?.id === block.id ? '#f0f0f0' : '#fafafa',
                  borderRadius: '8px',
                  cursor: draggedBlock ? 'grabbing' : 'grab',
                  border:
                    dragOverIndex === index ? '2px dashed #4caf50' :
                    selectedBlock?.id === block.id ? '2px solid #1a1a1a' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedBlock?.id === block.id ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                  opacity: draggedBlock?.id === block.id ? 0.5 : 1,
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '16px',
                        cursor: 'grab',
                        color: '#666',
                        userSelect: 'none',
                      }}
                      title="Drag to reorder"
                    >
                      ⋮⋮
                    </span>
                    <span style={{ fontSize: '20px' }}>
                      {BLOCK_TYPES.find(t => t.value === block.block_type)?.icon || '📦'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }}
                      disabled={index === 0}
                      onMouseEnter={(e) => {
                        if (index !== 0) {
                          e.currentTarget.style.transform = 'scale(1.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        opacity: index === 0 ? 0.3 : 1,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      ▲
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }}
                      disabled={index === blocks.length - 1}
                      onMouseEnter={(e) => {
                        if (index !== blocks.length - 1) {
                          e.currentTarget.style.transform = 'scale(1.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: index === blocks.length - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        opacity: index === blocks.length - 1 ? 0.3 : 1,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      ▼
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.2)';
                        e.currentTarget.style.color = '#ff0000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.color = '#ff4444';
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: '#ff4444',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '5px' }}>
                  {BLOCK_TYPES.find(t => t.value === block.block_type)?.label || block.block_type}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Order: {block.block_order + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Panel - Interactive Preview */}
      <div style={{
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {selectedBlock ? (
          <>
            <div style={{
              padding: '20px 30px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f9f9f9',
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                Interactive Preview - {BLOCK_TYPES.find(t => t.value === selectedBlock.block_type)?.label}
              </h2>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Click elements to edit directly
              </div>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              <InteractivePreview
                block={selectedBlock}
                onUpdate={(content, styles) => updateBlock(selectedBlock.id, content, styles)}
              />
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 20px', color: '#999', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>👈</div>
            <p style={{ fontSize: '18px', fontWeight: '600' }}>Select a block from the left to edit it</p>
            <p style={{ fontSize: '14px', color: '#aaa', marginTop: '10px' }}>Click on any element in the preview to edit it directly</p>
          </div>
        )}
      </div>

      {/* Add Block Modal */}
      {showAddModal && (
        <AddBlockModal
          onClose={() => setShowAddModal(false)}
          onAdd={addBlock}
          saving={saving}
        />
      )}
    </div>
  );
}

function BlockEditorPanel({ block, onUpdate }: { block: Block; onUpdate: (id: number, content: any, styles: any) => void }) {
  const [content, setContent] = useState(block.content);
  const [styles, setStyles] = useState(block.styles);
  const [activeTab, setActiveTab] = useState<'content' | 'styles'>('content');

  useEffect(() => {
    setContent(block.content);
    setStyles(block.styles);
  }, [block]);

  function handleSave() {
    onUpdate(block.id, content, styles);
  }

  function updateContent(key: string, value: any) {
    setContent({ ...content, [key]: value });
  }

  function updateStyle(key: string, value: any) {
    setStyles({ ...styles, [key]: value });
  }

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Edit {BLOCK_TYPES.find(t => t.value === block.block_type)?.label}
        </h2>
        <button
          onClick={handleSave}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#333333';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1a1a1a';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
          }}
          style={{
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.2s ease',
          }}
        >
          Save Changes
        </button>
      </div>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', borderBottom: '2px solid #f0f0f0' }}>
        <button
          onClick={() => setActiveTab('content')}
          onMouseEnter={(e) => {
            if (activeTab !== 'content') {
              e.currentTarget.style.color = '#1a1a1a';
              e.currentTarget.style.backgroundColor = '#f9f9f9';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'content') {
              e.currentTarget.style.color = '#666';
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          style={{
            backgroundColor: activeTab === 'content' ? '#f9f9f9' : 'transparent',
            border: 'none',
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            borderBottom: activeTab === 'content' ? '3px solid #1a1a1a' : '3px solid transparent',
            color: activeTab === 'content' ? '#1a1a1a' : '#666',
            transition: 'all 0.2s ease',
            borderRadius: '6px 6px 0 0',
          }}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('styles')}
          onMouseEnter={(e) => {
            if (activeTab !== 'styles') {
              e.currentTarget.style.color = '#1a1a1a';
              e.currentTarget.style.backgroundColor = '#f9f9f9';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'styles') {
              e.currentTarget.style.color = '#666';
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
          style={{
            backgroundColor: activeTab === 'styles' ? '#f9f9f9' : 'transparent',
            border: 'none',
            padding: '12px 24px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            borderBottom: activeTab === 'styles' ? '3px solid #1a1a1a' : '3px solid transparent',
            color: activeTab === 'styles' ? '#1a1a1a' : '#666',
            transition: 'all 0.2s ease',
            borderRadius: '6px 6px 0 0',
          }}
        >
          Design
        </button>
      </div>

      {activeTab === 'content' ? (
        <ContentEditor
          blockType={block.block_type}
          content={content}
          updateContent={updateContent}
          setContent={setContent}
        />
      ) : (
        <StylesEditor
          blockType={block.block_type}
          styles={styles}
          updateStyle={updateStyle}
        />
      )}
    </div>
  );
}

function FormGroup({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#1a1a1a' }}>
        {label}
      </label>
      {description && (
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px', marginTop: '-4px' }}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

function HeroContentEditor({ content, updateContent, setContent }: {
  content: any;
  updateContent: (key: string, value: any) => void;
  setContent: (content: any) => void;
}) {
  function addButton() {
    const newButtons = [...(content.buttons || []), { text: 'New Button', link: '#', style: 'primary' }];
    updateContent('buttons', newButtons);
  }

  function updateButton(index: number, field: string, value: string) {
    const newButtons = [...(content.buttons || [])];
    newButtons[index] = { ...newButtons[index], [field]: value };
    updateContent('buttons', newButtons);
  }

  function removeButton(index: number) {
    const newButtons = (content.buttons || []).filter((_: any, i: number) => i !== index);
    updateContent('buttons', newButtons);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <FormGroup label="Title" description="Main heading text">
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => updateContent('title', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '16px',
          }}
          placeholder="Welcome to Your Website"
        />
      </FormGroup>

      <FormGroup label="Subtitle" description="Secondary heading (optional)">
        <input
          type="text"
          value={content.subtitle || ''}
          onChange={(e) => updateContent('subtitle', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
          }}
          placeholder="Build Something Amazing"
        />
      </FormGroup>

      <FormGroup label="Description" description="Additional text below the title">
        <textarea
          value={content.description || ''}
          onChange={(e) => updateContent('description', e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
          placeholder="Start customizing this hero section"
        />
      </FormGroup>

      <ImageUploader
        value={content.backgroundImage || ''}
        onChange={(url) => updateContent('backgroundImage', url)}
        label="Background Image"
        description="Upload or select a background image for the hero section"
      />

      <FormGroup label="Buttons" description="Call-to-action buttons">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {(content.buttons || []).map((button: any, index: number) => (
            <div key={index} style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Button {index + 1}</span>
                <button
                  onClick={() => removeButton(index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ff0000';
                    e.currentTarget.style.fontWeight = '700';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#ff4444';
                    e.currentTarget.style.fontWeight = '600';
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ff4444',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                value={button.text || ''}
                onChange={(e) => updateButton(index, 'text', e.target.value)}
                placeholder="Button Text"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginBottom: '10px',
                }}
              />
              <input
                type="text"
                value={button.link || ''}
                onChange={(e) => updateButton(index, 'link', e.target.value)}
                placeholder="Link URL"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginBottom: '10px',
                }}
              />
              <select
                value={button.style || 'primary'}
                onChange={(e) => updateButton(index, 'style', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="outline">Outline</option>
              </select>
            </div>
          ))}
          <button
            onClick={addButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e8e8e8';
              e.currentTarget.style.borderColor = '#999';
              e.currentTarget.style.color = '#333';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.borderColor = '#ccc';
              e.currentTarget.style.color = '#666';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            style={{
              padding: '12px',
              backgroundColor: '#f0f0f0',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#666',
              transition: 'all 0.2s ease',
            }}
          >
            + Add Button
          </button>
        </div>
      </FormGroup>
    </div>
  );
}

function TextContentEditor({ content, updateContent }: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <FormGroup label="Heading" description="Main heading for this text block (optional)">
        <input
          type="text"
          value={content.heading || ''}
          onChange={(e) => updateContent('heading', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '16px',
          }}
          placeholder="Section Heading"
        />
      </FormGroup>

      <FormGroup label="Text Content" description="Main text content (HTML supported)">
        <textarea
          value={content.text || ''}
          onChange={(e) => updateContent('text', e.target.value)}
          rows={8}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace',
            resize: 'vertical',
          }}
          placeholder="<p>Your content here...</p>"
        />
      </FormGroup>

      <FormGroup label="Text Alignment" description="How to align the text">
        <select
          value={content.alignment || 'left'}
          onChange={(e) => updateContent('alignment', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </FormGroup>
    </div>
  );
}

function ImageContentEditor({ content, updateContent }: {
  content: any;
  updateContent: (key: string, value: any) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <ImageUploader
        value={content.imageUrl || ''}
        onChange={(url) => updateContent('imageUrl', url)}
        label="Image"
        description="Upload or select an image"
      />

      <FormGroup label="Alt Text" description="Description for accessibility">
        <input
          type="text"
          value={content.alt || ''}
          onChange={(e) => updateContent('alt', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
          }}
          placeholder="Image description"
        />
      </FormGroup>

      <FormGroup label="Caption" description="Text below the image (optional)">
        <input
          type="text"
          value={content.caption || ''}
          onChange={(e) => updateContent('caption', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
          }}
          placeholder="Image caption"
        />
      </FormGroup>

      <FormGroup label="Link URL" description="Make image clickable (optional)">
        <input
          type="text"
          value={content.link || ''}
          onChange={(e) => updateContent('link', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
          }}
          placeholder="https://example.com"
        />
      </FormGroup>
    </div>
  );
}

function TwoColumnContentEditor({ content, updateContent, setContent }: {
  content: any;
  updateContent: (key: string, value: any) => void;
  setContent: (content: any) => void;
}) {
  function updateColumn(column: 'leftColumn' | 'rightColumn', field: string, value: any) {
    setContent({
      ...content,
      [column]: { ...content[column], [field]: value }
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>Left Column</h3>

        <FormGroup label="Column Type">
          <select
            value={content.leftColumn?.type || 'text'}
            onChange={(e) => updateColumn('leftColumn', 'type', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </FormGroup>

        {content.leftColumn?.type === 'text' ? (
          <>
            <FormGroup label="Heading">
              <input
                type="text"
                value={content.leftColumn?.heading || ''}
                onChange={(e) => updateColumn('leftColumn', 'heading', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
                placeholder="Column Heading"
              />
            </FormGroup>
            <FormGroup label="Content">
              <textarea
                value={content.leftColumn?.content || ''}
                onChange={(e) => updateColumn('leftColumn', 'content', e.target.value)}
                rows={5}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  resize: 'vertical',
                }}
                placeholder="<p>Column content...</p>"
              />
            </FormGroup>
          </>
        ) : (
          <ImageUploader
            value={content.leftColumn?.content || ''}
            onChange={(url) => updateColumn('leftColumn', 'content', url)}
            label="Image"
            description="Upload or select an image for the left column"
          />
        )}
      </div>

      <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px' }}>Right Column</h3>

        <FormGroup label="Column Type">
          <select
            value={content.rightColumn?.type || 'text'}
            onChange={(e) => updateColumn('rightColumn', 'type', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </FormGroup>

        {content.rightColumn?.type === 'text' ? (
          <>
            <FormGroup label="Heading">
              <input
                type="text"
                value={content.rightColumn?.heading || ''}
                onChange={(e) => updateColumn('rightColumn', 'heading', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
                placeholder="Column Heading"
              />
            </FormGroup>
            <FormGroup label="Content">
              <textarea
                value={content.rightColumn?.content || ''}
                onChange={(e) => updateColumn('rightColumn', 'content', e.target.value)}
                rows={5}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  resize: 'vertical',
                }}
                placeholder="<p>Column content...</p>"
              />
            </FormGroup>
          </>
        ) : (
          <ImageUploader
            value={content.rightColumn?.content || ''}
            onChange={(url) => updateColumn('rightColumn', 'content', url)}
            label="Image"
            description="Upload or select an image for the right column"
          />
        )}
      </div>
    </div>
  );
}

function GalleryContentEditor({ content, updateContent, setContent }: {
  content: any;
  updateContent: (key: string, value: any) => void;
  setContent: (content: any) => void;
}) {
  function addImage() {
    const newImages = [...(content.images || []), { url: '', alt: '', size: 'medium' }];
    updateContent('images', newImages);
  }

  function updateImage(index: number, field: string, value: string) {
    const newImages = [...(content.images || [])];
    newImages[index] = { ...newImages[index], [field]: value };
    updateContent('images', newImages);
  }

  function removeImage(index: number) {
    const newImages = (content.images || []).filter((_: any, i: number) => i !== index);
    updateContent('images', newImages);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <FormGroup label="Gallery Title" description="Title for the gallery (optional)">
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => updateContent('title', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '16px',
          }}
          placeholder="Image Gallery"
        />
      </FormGroup>

      <FormGroup label="Images" description="Add and manage gallery images">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {(content.images || []).map((image: any, index: number) => (
            <div key={index} style={{ padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>Image {index + 1}</span>
                <button
                  onClick={() => removeImage(index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ff0000';
                    e.currentTarget.style.fontWeight = '700';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#ff4444';
                    e.currentTarget.style.fontWeight = '600';
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ff4444',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Remove
                </button>
              </div>
              <ImageUploader
                value={image.url || ''}
                onChange={(url) => updateImage(index, 'url', url)}
              />
              <input
                type="text"
                value={image.alt || ''}
                onChange={(e) => updateImage(index, 'alt', e.target.value)}
                placeholder="Alt text"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginBottom: '10px',
                }}
              />
              <select
                value={image.size || 'medium'}
                onChange={(e) => updateImage(index, 'size', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
              </select>
            </div>
          ))}
          <button
            onClick={addImage}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e8e8e8';
              e.currentTarget.style.borderColor = '#999';
              e.currentTarget.style.color = '#333';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.borderColor = '#ccc';
              e.currentTarget.style.color = '#666';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            style={{
              padding: '12px',
              backgroundColor: '#f0f0f0',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              color: '#666',
              transition: 'all 0.2s ease',
            }}
          >
            + Add Image
          </button>
        </div>
      </FormGroup>

      <FormGroup label="Expandable Gallery" description="Show 'Show More' button">
        <select
          value={content.expandable ? 'true' : 'false'}
          onChange={(e) => updateContent('expandable', e.target.value === 'true')}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </FormGroup>

      {content.expandable && (
        <FormGroup label="Initial Visible Count" description="How many images to show initially">
          <input
            type="number"
            value={content.initialVisibleCount || 6}
            onChange={(e) => updateContent('initialVisibleCount', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
            }}
            min="1"
          />
        </FormGroup>
      )}
    </div>
  );
}

function ContentEditor({ blockType, content, updateContent, setContent }: {
  blockType: string;
  content: any;
  updateContent: (key: string, value: any) => void;
  setContent: (content: any) => void;
}) {
  if (blockType === 'hero') {
    return <HeroContentEditor content={content} updateContent={updateContent} setContent={setContent} />;
  } else if (blockType === 'text') {
    return <TextContentEditor content={content} updateContent={updateContent} />;
  } else if (blockType === 'image') {
    return <ImageContentEditor content={content} updateContent={updateContent} />;
  } else if (blockType === 'two-column') {
    return <TwoColumnContentEditor content={content} updateContent={updateContent} setContent={setContent} />;
  } else if (blockType === 'gallery') {
    return <GalleryContentEditor content={content} updateContent={updateContent} setContent={setContent} />;
  }
  return <div>Content editor for {blockType} not implemented yet</div>;
}

function StylesEditor({ blockType, styles, updateStyle }: {
  blockType: string;
  styles: any;
  updateStyle: (key: string, value: any) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
      <FormGroup label="Background Color" description="Choose the background color for this block">
        <input
          type="color"
          value={styles.backgroundColor || '#ffffff'}
          onChange={(e) => updateStyle('backgroundColor', e.target.value)}
          style={{ width: '100%', height: '50px', border: '2px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}
        />
      </FormGroup>

      <FormGroup label="Text Color" description="Choose the main text color">
        <input
          type="color"
          value={styles.textColor || '#333333'}
          onChange={(e) => updateStyle('textColor', e.target.value)}
          style={{ width: '100%', height: '50px', border: '2px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}
        />
      </FormGroup>

      {(blockType === 'text' || blockType === 'hero') && (
        <FormGroup label="Heading Color" description="Choose the heading text color">
          <input
            type="color"
            value={styles.headingColor || styles.textColor || '#1a1a1a'}
            onChange={(e) => updateStyle('headingColor', e.target.value)}
            style={{ width: '100%', height: '50px', border: '2px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}
          />
        </FormGroup>
      )}

      <FormGroup label="Padding" description="Space inside the block (e.g., 60px 20px)">
        <input
          type="text"
          value={styles.padding || '60px 20px'}
          onChange={(e) => updateStyle('padding', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
          }}
          placeholder="60px 20px"
        />
      </FormGroup>

      {blockType === 'hero' && (
        <>
          <FormGroup label="Minimum Height" description="Minimum height of the hero section">
            <input
              type="text"
              value={styles.minHeight || '600px'}
              onChange={(e) => updateStyle('minHeight', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              placeholder="600px"
            />
          </FormGroup>

          <FormGroup label="Title Size" description="Font size for the main title">
            <input
              type="text"
              value={styles.titleSize || '56px'}
              onChange={(e) => updateStyle('titleSize', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              placeholder="56px"
            />
          </FormGroup>

          <FormGroup label="Text Alignment" description="How to align the text">
            <select
              value={styles.textAlign || 'center'}
              onChange={(e) => updateStyle('textAlign', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </FormGroup>

          <FormGroup label="Overlay Color" description="Color overlay on background image">
            <input
              type="color"
              value={styles.overlayColor || '#000000'}
              onChange={(e) => updateStyle('overlayColor', e.target.value)}
              style={{ width: '100%', height: '50px', border: '2px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer' }}
            />
          </FormGroup>

          <FormGroup label="Overlay Opacity" description="Transparency of the overlay (0.0 to 1.0)">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={styles.overlayOpacity || '0.5'}
              onChange={(e) => updateStyle('overlayOpacity', e.target.value)}
              style={{ width: '100%' }}
            />
            <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px', color: '#666' }}>
              {styles.overlayOpacity || '0.5'}
            </div>
          </FormGroup>
        </>
      )}

      {(blockType === 'image' || blockType === 'gallery') && (
        <>
          <FormGroup label="Border Radius" description="Rounded corners for images">
            <input
              type="text"
              value={styles.imageBorderRadius || styles.borderRadius || '8px'}
              onChange={(e) => updateStyle(blockType === 'gallery' ? 'imageBorderRadius' : 'borderRadius', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              placeholder="8px"
            />
          </FormGroup>
        </>
      )}

      {blockType === 'text' && (
        <>
          <FormGroup label="Font Size" description="Size of the text">
            <input
              type="text"
              value={styles.fontSize || '16px'}
              onChange={(e) => updateStyle('fontSize', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
              }}
              placeholder="16px"
            />
          </FormGroup>
        </>
      )}
    </div>
  );
}

function AddBlockModal({ onClose, onAdd, saving }: { onClose: () => void; onAdd: (type: string) => void; saving: boolean }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>Add New Block</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Choose a block type to add to your page</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {BLOCK_TYPES.map((blockType) => (
            <button
              key={blockType.value}
              onClick={() => onAdd(blockType.value)}
              disabled={saving}
              style={{
                backgroundColor: '#fafafa',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                cursor: saving ? 'not-allowed' : 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                opacity: saving ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!saving) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#1a1a1a';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '32px' }}>{blockType.icon}</span>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>
                    {blockType.label}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {blockType.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          disabled={saving}
          onMouseEnter={(e) => {
            if (!saving) {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
              e.currentTarget.style.borderColor = '#999';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#e0e0e0';
          }}
          onMouseDown={(e) => {
            if (!saving) {
              e.currentTarget.style.transform = 'scale(0.98)';
            }
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          style={{
            marginTop: '30px',
            width: '100%',
            backgroundColor: 'transparent',
            border: '2px solid #e0e0e0',
            padding: '12px',
            borderRadius: '6px',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

