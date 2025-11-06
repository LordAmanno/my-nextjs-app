'use client';

import { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import VideoBlock from '../blocks/VideoBlock';
import ContactFormBlock from '../blocks/ContactFormBlock';
import TestimonialsBlock from '../blocks/TestimonialsBlock';
import SpacerBlock from '../blocks/SpacerBlock';

interface InteractivePreviewProps {
  block: any;
  onUpdate: (content: any, styles: any) => void;
}

export default function InteractivePreview({ block, onUpdate }: InteractivePreviewProps) {
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [showImageUploader, setShowImageUploader] = useState<string | null>(null);
  const [showButtonEditor, setShowButtonEditor] = useState<number | null>(null);
  const [showButtonManager, setShowButtonManager] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState<number | null>(null);
  const [showTextManager, setShowTextManager] = useState(false);
  const [showTextToolbar, setShowTextToolbar] = useState<string | null>(null);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });

  const [localContent, setLocalContent] = useState(block.content || {});
  const [localStyles, setLocalStyles] = useState(block.styles || {});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Text formatting functions
  const showTextFormattingToolbar = (elementId: string, event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const rect = event.target.getBoundingClientRect();
    setToolbarPosition({
      top: rect.top - 60,
      left: rect.left + (rect.width / 2) - 200, // Center the toolbar
    });
    setShowTextToolbar(elementId);
  };

  const hideTextFormattingToolbar = () => {
    setShowTextToolbar(null);
  };

  const applyTextFormatting = (elementId: string, property: string, value: string) => {
    // Apply formatting based on element type
    if (elementId.includes('textBox')) {
      // Handle text boxes in Hero and Text blocks
      const [blockType, boxIndex] = elementId.split('-');
      const index = parseInt(boxIndex);

      if (blockType === 'heroTextBox') {
        const newTextBoxes = [...(localContent.textBoxes || [])];
        if (newTextBoxes[index]) {
          newTextBoxes[index] = { ...newTextBoxes[index], [property]: value };
          updateContent('textBoxes', newTextBoxes);
        }
      }
    } else if (elementId.includes('Column')) {
      // Handle Two Column Block
      const [column, field] = elementId.split('-');
      if (field === 'heading') {
        updateNestedContent([column, 'headingStyle'], { ...localContent[column]?.headingStyle, [property]: value });
      } else {
        updateNestedContent([column, 'textStyle'], { ...localContent[column]?.textStyle, [property]: value });
      }
    }
  };

  useEffect(() => {
    setLocalContent(block.content || {});
    setLocalStyles(block.styles || {});
    setHasUnsavedChanges(false);
  }, [block.id]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (hasUnsavedChanges && !saving) {
          handleSaveChanges();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasUnsavedChanges, saving, localContent, localStyles]);

  function updateContent(key: string, value: any) {
    const newContent = { ...localContent, [key]: value };
    setLocalContent(newContent);
    setHasUnsavedChanges(true);
  }

  function updateStyles(key: string, value: any) {
    const newStyles = { ...localStyles, [key]: value };
    setLocalStyles(newStyles);
    setHasUnsavedChanges(true);
  }

  function updateNestedContent(path: string[], value: any) {
    const newContent = JSON.parse(JSON.stringify(localContent));
    let current: any = newContent;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setLocalContent(newContent);
    setHasUnsavedChanges(true);
  }

  async function handleSaveChanges() {
    setSaving(true);
    try {
      await onUpdate(localContent, localStyles);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setSaving(false);
    }
  }

  // Text Formatting Toolbar Component
  const TextFormattingToolbar = () => {
    if (!showTextToolbar) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: toolbarPosition.top,
          left: Math.max(10, Math.min(toolbarPosition.left, window.innerWidth - 410)),
          backgroundColor: '#ffffff',
          border: '2px solid #1a1a1a',
          borderRadius: '8px',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 4000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '14px',
        }}
      >
        {/* Bold, Italic, Underline */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => {
              // Toggle bold formatting
              const currentElement = document.querySelector(`[data-toolbar-id="${showTextToolbar}"]`) as HTMLTextAreaElement | HTMLInputElement;
              if (currentElement) {
                currentElement.style.fontWeight = currentElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
              }
            }}
            style={{
              padding: '6px 8px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '12px',
            }}
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => {
              const currentElement = document.querySelector(`[data-toolbar-id="${showTextToolbar}"]`) as HTMLTextAreaElement | HTMLInputElement;
              if (currentElement) {
                currentElement.style.fontStyle = currentElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
              }
            }}
            style={{
              padding: '6px 8px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontStyle: 'italic',
              fontSize: '12px',
            }}
            title="Italic"
          >
            I
          </button>
          <button
            onClick={() => {
              const currentElement = document.querySelector(`[data-toolbar-id="${showTextToolbar}"]`) as HTMLTextAreaElement | HTMLInputElement;
              if (currentElement) {
                currentElement.style.textDecoration = currentElement.style.textDecoration === 'underline' ? 'none' : 'underline';
              }
            }}
            style={{
              padding: '6px 8px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '12px',
            }}
            title="Underline"
          >
            U
          </button>
        </div>

        {/* Separator */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#ccc' }}></div>

        {/* Font Size */}
        <select
          onChange={(e) => {
            const currentElement = document.querySelector(`[data-toolbar-id="${showTextToolbar}"]`) as HTMLTextAreaElement | HTMLInputElement;
            if (currentElement) {
              currentElement.style.fontSize = e.target.value;
            }
          }}
          style={{
            padding: '4px 8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
          title="Font Size"
        >
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px" selected>16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
          <option value="36px">36px</option>
          <option value="48px">48px</option>
        </select>

        {/* Separator */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#ccc' }}></div>

        {/* Text Color */}
        <input
          type="color"
          onChange={(e) => {
            const currentElement = document.querySelector(`[data-toolbar-id="${showTextToolbar}"]`) as HTMLTextAreaElement | HTMLInputElement;
            if (currentElement) {
              currentElement.style.color = e.target.value;
            }
          }}
          style={{
            width: '32px',
            height: '24px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          title="Text Color"
        />

        {/* Separator */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#ccc' }}></div>

        {/* Text Alignment */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => {
              const currentElement = document.querySelector(`[data-toolbar-id="${showTextToolbar}"]`) as HTMLTextAreaElement | HTMLInputElement;
              if (currentElement) {
                currentElement.style.textAlign = 'left';
              }
            }}
            style={{
              padding: '6px 8px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Align Left"
          >
            ◀
          </button>
          <button
            onClick={() => {
              const currentElement = document.querySelector(`[data-toolbar-id="${showTextToolbar}"]`) as HTMLTextAreaElement | HTMLInputElement;
              if (currentElement) {
                currentElement.style.textAlign = 'center';
              }
            }}
            style={{
              padding: '6px 8px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Align Center"
          >
            ▣
          </button>
          <button
            onClick={() => {
              const currentElement = document.querySelector(`[data-toolbar-id="${showTextToolbar}"]`) as HTMLTextAreaElement | HTMLInputElement;
              if (currentElement) {
                currentElement.style.textAlign = 'right';
              }
            }}
            style={{
              padding: '6px 8px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Align Right"
          >
            ▶
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={hideTextFormattingToolbar}
          style={{
            padding: '4px 8px',
            backgroundColor: '#dc3545',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            marginLeft: '8px',
          }}
          title="Close Toolbar"
        >
          ✕
        </button>
      </div>
    );
  };

  function renderHeroBlock() {
    return (
      <div
        style={{
          position: 'relative',
          minHeight: localStyles.minHeight || '600px',
          backgroundImage: localContent.backgroundImage ? `url(${localContent.backgroundImage})` : 'none',
          backgroundColor: localStyles.backgroundColor || '#1a1a1a',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: localStyles.padding || '80px 20px',
          fontFamily: localStyles.fontFamily || 'inherit',
        }}
      >
        {showImageUploader === 'background' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowImageUploader(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Background Settings</h3>

              <ImageUploader
                value={localContent.backgroundImage || ''}
                onChange={(url) => {
                  updateContent('backgroundImage', url);
                }}
                label="Background Image"
              />

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Background Color
                </label>
                <input
                  type="color"
                  value={localStyles.backgroundColor || '#1a1a1a'}
                  onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                  style={{ width: '100%', height: '50px', cursor: 'pointer', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Overlay Color
                </label>
                <input
                  type="color"
                  value={localStyles.overlayColor || '#000000'}
                  onChange={(e) => updateStyles('overlayColor', e.target.value)}
                  style={{ width: '100%', height: '50px', cursor: 'pointer', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Overlay Opacity
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={parseFloat(localStyles.overlayOpacity || '0.5') * 100}
                  onChange={(e) => updateStyles('overlayOpacity', (parseInt(e.target.value) / 100).toString())}
                  style={{ width: '100%' }}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  {Math.round(parseFloat(localStyles.overlayOpacity || '0.5') * 100)}%
                </div>
              </div>

              <button
                onClick={() => setShowImageUploader(null)}
                style={{
                  marginTop: '20px',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Button Editor Modal */}
        {showButtonEditor !== null && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowButtonEditor(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                Button Settings
              </h3>

              {localContent.buttons && localContent.buttons[showButtonEditor] && (
                <>
                  {/* Button Text */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={localContent.buttons[showButtonEditor].text || ''}
                      onChange={(e) => {
                        const newButtons = [...(localContent.buttons || [])];
                        newButtons[showButtonEditor] = { ...newButtons[showButtonEditor], text: e.target.value };
                        updateContent('buttons', newButtons);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                      placeholder="Enter button text"
                    />
                  </div>

                  {/* Button Link */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={localContent.buttons[showButtonEditor].link || ''}
                      onChange={(e) => {
                        const newButtons = [...(localContent.buttons || [])];
                        newButtons[showButtonEditor] = { ...newButtons[showButtonEditor], link: e.target.value };
                        updateContent('buttons', newButtons);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                      placeholder="Enter URL (e.g., https://example.com)"
                    />
                  </div>

                  {/* Button Background Color */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Button Background Color
                    </label>
                    <input
                      type="color"
                      value={localContent.buttons[showButtonEditor].backgroundColor || '#ffffff'}
                      onChange={(e) => {
                        const newButtons = [...(localContent.buttons || [])];
                        newButtons[showButtonEditor] = { ...newButtons[showButtonEditor], backgroundColor: e.target.value };
                        updateContent('buttons', newButtons);
                      }}
                      style={{ width: '100%', height: '50px', cursor: 'pointer', borderRadius: '6px' }}
                    />
                  </div>

                  {/* Button Text Color */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Button Text Color
                    </label>
                    <input
                      type="color"
                      value={localContent.buttons[showButtonEditor].textColor || '#1a1a1a'}
                      onChange={(e) => {
                        const newButtons = [...(localContent.buttons || [])];
                        newButtons[showButtonEditor] = { ...newButtons[showButtonEditor], textColor: e.target.value };
                        updateContent('buttons', newButtons);
                      }}
                      style={{ width: '100%', height: '50px', cursor: 'pointer', borderRadius: '6px' }}
                    />
                  </div>

                  {/* Delete Button */}
                  <div style={{ marginBottom: '20px' }}>
                    <button
                      onClick={() => {
                        const newButtons = localContent.buttons.filter((_: any, i: number) => i !== showButtonEditor);
                        updateContent('buttons', newButtons);
                        setShowButtonEditor(null);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#dc3545',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      🗑️ Delete Button
                    </button>
                  </div>

                  {/* Done Button */}
                  <button
                    onClick={() => setShowButtonEditor(null)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1a1a1a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Text Editor Modal */}
        {showTextEditor !== null && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowTextEditor(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                Text Box Settings
              </h3>

              {localContent.textBoxes && localContent.textBoxes[showTextEditor] && (
                <>
                  {/* Text Content */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Text Content
                    </label>
                    {localContent.textBoxes[showTextEditor].type === 'textarea' ? (
                      <textarea
                        value={localContent.textBoxes[showTextEditor].text || ''}
                        onChange={(e) => {
                          const newTextBoxes = [...(localContent.textBoxes || [])];
                          newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], text: e.target.value };
                          updateContent('textBoxes', newTextBoxes);
                        }}
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0',
                          fontSize: '14px',
                          resize: 'vertical',
                        }}
                        placeholder="Enter your text content"
                      />
                    ) : (
                      <input
                        type="text"
                        value={localContent.textBoxes[showTextEditor].text || ''}
                        onChange={(e) => {
                          const newTextBoxes = [...(localContent.textBoxes || [])];
                          newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], text: e.target.value };
                          updateContent('textBoxes', newTextBoxes);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0',
                          fontSize: '14px',
                        }}
                        placeholder="Enter your text content"
                      />
                    )}
                  </div>

                  {/* Text Type */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Text Type
                    </label>
                    <select
                      value={localContent.textBoxes[showTextEditor].type || 'input'}
                      onChange={(e) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], type: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                    >
                      <option value="input">Single Line Text</option>
                      <option value="textarea">Multi-line Text</option>
                    </select>
                  </div>

                  {/* Font Size */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Font Size
                    </label>
                    <input
                      type="text"
                      value={localContent.textBoxes[showTextEditor].fontSize || '18px'}
                      onChange={(e) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], fontSize: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                      placeholder="e.g., 18px, 2rem, 24px"
                    />
                  </div>

                  {/* Font Weight */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Font Weight
                    </label>
                    <select
                      value={localContent.textBoxes[showTextEditor].fontWeight || 'normal'}
                      onChange={(e) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], fontWeight: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                    >
                      <option value="normal">Normal</option>
                      <option value="500">Medium</option>
                      <option value="600">Semi-Bold</option>
                      <option value="bold">Bold</option>
                      <option value="300">Light</option>
                    </select>
                  </div>

                  {/* Text Color */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={localContent.textBoxes[showTextEditor].color || '#ffffff'}
                      onChange={(e) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], color: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      style={{ width: '100%', height: '50px', cursor: 'pointer', borderRadius: '6px' }}
                    />
                  </div>

                  {/* Text Alignment */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Text Alignment
                    </label>
                    <select
                      value={localContent.textBoxes[showTextEditor].textAlign || 'center'}
                      onChange={(e) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], textAlign: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  {/* Delete Text Box */}
                  <div style={{ marginBottom: '20px' }}>
                    <button
                      onClick={() => {
                        const newTextBoxes = localContent.textBoxes.filter((_: any, i: number) => i !== showTextEditor);
                        updateContent('textBoxes', newTextBoxes);
                        setShowTextEditor(null);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#dc3545',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      🗑️ Delete Text Box
                    </button>
                  </div>

                  {/* Done Button */}
                  <button
                    onClick={() => setShowTextEditor(null)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1a1a1a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Text Editor Modal */}
        {showTextEditor !== null && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowTextEditor(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                Text Box Settings
              </h3>

              {localContent.textBoxes && localContent.textBoxes[showTextEditor] && (
                <>
                  {/* Text Content */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Text Content
                    </label>
                    {localContent.textBoxes[showTextEditor].type === 'textarea' ? (
                      <textarea
                        value={localContent.textBoxes[showTextEditor].text || ''}
                        onChange={(e) => {
                          const newTextBoxes = [...(localContent.textBoxes || [])];
                          newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], text: e.target.value };
                          updateContent('textBoxes', newTextBoxes);
                        }}
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0',
                          fontSize: '14px',
                          resize: 'vertical',
                        }}
                        placeholder="Enter your text content"
                      />
                    ) : (
                      <input
                        type="text"
                        value={localContent.textBoxes[showTextEditor].text || ''}
                        onChange={(e) => {
                          const newTextBoxes = [...(localContent.textBoxes || [])];
                          newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], text: e.target.value };
                          updateContent('textBoxes', newTextBoxes);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0',
                          fontSize: '14px',
                        }}
                        placeholder="Enter your text content"
                      />
                    )}
                  </div>

                  {/* Text Type */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Text Type
                    </label>
                    <select
                      value={localContent.textBoxes[showTextEditor].type || 'input'}
                      onChange={(e) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], type: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                    >
                      <option value="input">Single Line Text</option>
                      <option value="textarea">Multi-line Text</option>
                    </select>
                  </div>

                  {/* Font Size */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Font Size
                    </label>
                    <input
                      type="text"
                      value={localContent.textBoxes[showTextEditor].fontSize || '18px'}
                      onChange={(e) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], fontSize: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                      placeholder="e.g., 18px, 2rem, 24px"
                    />
                  </div>

                  {/* Font Weight */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Font Weight
                    </label>
                    <select
                      value={localContent.textBoxes[showTextEditor].fontWeight || 'normal'}
                      onChange={(e) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], fontWeight: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                    >
                      <option value="normal">Normal</option>
                      <option value="500">Medium</option>
                      <option value="600">Semi-Bold</option>
                      <option value="bold">Bold</option>
                      <option value="300">Light</option>
                    </select>
                  </div>

                  {/* Text Color */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={localContent.textBoxes[showTextEditor].color || '#ffffff'}
                      onChange={(e) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], color: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      style={{ width: '100%', height: '50px', cursor: 'pointer', borderRadius: '6px' }}
                    />
                  </div>

                  {/* Text Alignment */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Text Alignment
                    </label>
                    <select
                      value={localContent.textBoxes[showTextEditor].textAlign || 'center'}
                      onChange={(e) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], textAlign: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  {/* Delete Text Box */}
                  <div style={{ marginBottom: '20px' }}>
                    <button
                      onClick={() => {
                        const newTextBoxes = localContent.textBoxes.filter((_: any, i: number) => i !== showTextEditor);
                        updateContent('textBoxes', newTextBoxes);
                        setShowTextEditor(null);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#dc3545',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      🗑️ Delete Text Box
                    </button>
                  </div>

                  {/* Done Button */}
                  <button
                    onClick={() => setShowTextEditor(null)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1a1a1a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Text Manager Modal */}
        {showTextManager && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowTextManager(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                Manage Text Boxes
              </h3>

              {/* Current Text Boxes */}
              {localContent.textBoxes && localContent.textBoxes.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Current Text Boxes:</h4>
                  {localContent.textBoxes.map((textBox: any, index: number) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '6px',
                      marginBottom: '8px',
                    }}>
                      <span style={{ fontSize: '14px' }}>
                        {textBox.text ? (textBox.text.length > 30 ? textBox.text.substring(0, 30) + '...' : textBox.text) : 'Empty Text Box'}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setShowTextManager(false);
                            setShowTextEditor(index);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#007bff',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            const newTextBoxes = localContent.textBoxes.filter((_: any, i: number) => i !== index);
                            updateContent('textBoxes', newTextBoxes);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Text Box */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => {
                    const newTextBoxes = [...(localContent.textBoxes || []), {
                      id: `textbox-${Date.now()}`,
                      type: 'input',
                      text: 'New Text',
                      fontSize: '18px',
                      fontWeight: 'normal',
                      color: '#ffffff',
                      textAlign: 'center',
                      marginBottom: '20px',
                    }];
                    updateContent('textBoxes', newTextBoxes);
                  }}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#28a745',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📝</span>
                  Add New Text Box
                </button>
              </div>

              {/* Remove All Text Boxes */}
              {localContent.textBoxes && localContent.textBoxes.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <button
                    onClick={() => {
                      updateContent('textBoxes', []);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#dc3545',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    🗑️ Remove All Text Boxes
                  </button>
                </div>
              )}

              {/* Done Button */}
              <button
                onClick={() => setShowTextManager(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Button Manager Modal */}
        {showButtonManager && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowButtonManager(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                Manage Buttons
              </h3>

              {/* Current Buttons */}
              {localContent.buttons && localContent.buttons.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Current Buttons:</h4>
                  {localContent.buttons.map((button: any, index: number) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '6px',
                      marginBottom: '8px',
                    }}>
                      <span style={{ fontSize: '14px' }}>
                        {button.text || 'Untitled Button'}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setShowButtonManager(false);
                            setShowButtonEditor(index);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#007bff',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            const newButtons = localContent.buttons.filter((_: any, i: number) => i !== index);
                            updateContent('buttons', newButtons);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Button */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => {
                    const newButtons = [...(localContent.buttons || []), {
                      text: 'New Button',
                      link: '#',
                      backgroundColor: '#ffffff',
                      textColor: '#1a1a1a',
                    }];
                    updateContent('buttons', newButtons);
                  }}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#28a745',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>➕</span>
                  Add New Button
                </button>
              </div>

              {/* Remove All Buttons */}
              {localContent.buttons && localContent.buttons.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <button
                    onClick={() => {
                      updateContent('buttons', []);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#dc3545',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    🗑️ Remove All Buttons
                  </button>
                </div>
              )}

              {/* Done Button */}
              <button
                onClick={() => setShowButtonManager(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Text Manager Modal */}
        {showTextManager && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowTextManager(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                Manage Text Boxes
              </h3>

              {/* Current Text Boxes */}
              {localContent.textBoxes && localContent.textBoxes.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Current Text Boxes:</h4>
                  {localContent.textBoxes.map((textBox: any, index: number) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '6px',
                      marginBottom: '8px',
                    }}>
                      <div>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>
                          {textBox.type === 'textarea' ? '📝' : '📄'} {textBox.text ? textBox.text.substring(0, 30) + (textBox.text.length > 30 ? '...' : '') : 'Empty Text Box'}
                        </span>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                          {textBox.type === 'textarea' ? 'Multi-line' : 'Single line'} • {textBox.fontSize || '18px'} • {textBox.color || '#ffffff'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setShowTextManager(false);
                            setShowTextEditor(index);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#007bff',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            const newTextBoxes = localContent.textBoxes.filter((_: any, i: number) => i !== index);
                            updateContent('textBoxes', newTextBoxes);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Text Box Options */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Add New Text Box:</h4>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <button
                    onClick={() => {
                      const newTextBoxes = [...(localContent.textBoxes || []), {
                        id: `text-${Date.now()}`,
                        type: 'input',
                        text: 'New Heading',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: '#ffffff',
                        textAlign: 'center',
                        marginBottom: '20px',
                      }];
                      updateContent('textBoxes', newTextBoxes);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#28a745',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    📄 Add Heading
                  </button>

                  <button
                    onClick={() => {
                      const newTextBoxes = [...(localContent.textBoxes || []), {
                        id: `text-${Date.now()}`,
                        type: 'textarea',
                        text: 'New paragraph text...',
                        fontSize: '18px',
                        fontWeight: 'normal',
                        color: '#e0e0e0',
                        textAlign: 'center',
                        marginBottom: '20px',
                        lineHeight: '1.6',
                        maxWidth: '800px',
                      }];
                      updateContent('textBoxes', newTextBoxes);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#17a2b8',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    📝 Add Paragraph
                  </button>
                </div>

                <button
                  onClick={() => {
                    const newTextBoxes = [...(localContent.textBoxes || []), {
                      id: `text-${Date.now()}`,
                      type: 'input',
                      text: 'Custom Text',
                      fontSize: '20px',
                      fontWeight: 'normal',
                      color: '#ffffff',
                      textAlign: 'center',
                      marginBottom: '15px',
                    }];
                    updateContent('textBoxes', newTextBoxes);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#6f42c1',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  ✨ Add Custom Text
                </button>
              </div>

              {/* Remove All Text Boxes */}
              {localContent.textBoxes && localContent.textBoxes.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <button
                    onClick={() => {
                      updateContent('textBoxes', []);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#dc3545',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    🗑️ Remove All Text Boxes
                  </button>
                </div>
              )}

              {/* Done Button */}
              <button
                onClick={() => setShowTextManager(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {localContent.backgroundImage && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: localStyles.overlayColor || '#000000',
              opacity: localStyles.overlayOpacity || '0.5',
            }}
          />
        )}

        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          width: '100%',
          textAlign: localStyles.textAlign || 'center',
          color: localStyles.textColor || '#ffffff',
        }}>
          {/* Dynamic Text Boxes */}
          <div style={{ position: 'relative', marginBottom: '40px' }}>
            {/* Initialize default text boxes if none exist */}
            {(() => {
              if (!localContent.textBoxes || localContent.textBoxes.length === 0) {
                // Initialize with default text boxes based on existing content
                const defaultTextBoxes = [];

                if (localContent.subtitle || localContent.title || localContent.description) {
                  // Migrate existing content to new system
                  if (localContent.subtitle) {
                    defaultTextBoxes.push({
                      id: 'subtitle',
                      type: 'input',
                      text: localContent.subtitle,
                      fontSize: '24px',
                      fontWeight: '500',
                      color: localStyles.textColor || '#e0e0e0',
                      textAlign: 'center',
                      marginBottom: '15px',
                      opacity: '0.9',
                    });
                  }

                  if (localContent.title) {
                    defaultTextBoxes.push({
                      id: 'title',
                      type: 'input',
                      text: localContent.title,
                      fontSize: '56px',
                      fontWeight: 'bold',
                      color: localStyles.headingColor || '#ffffff',
                      textAlign: 'center',
                      marginBottom: '20px',
                      lineHeight: '1.2',
                    });
                  }

                  if (localContent.description) {
                    defaultTextBoxes.push({
                      id: 'description',
                      type: 'textarea',
                      text: localContent.description,
                      fontSize: '18px',
                      fontWeight: 'normal',
                      color: localStyles.textColor || '#e0e0e0',
                      textAlign: 'center',
                      marginBottom: '40px',
                      opacity: '0.9',
                      lineHeight: '1.6',
                      maxWidth: '800px',
                    });
                  }

                  // Update content with new text boxes structure
                  updateContent('textBoxes', defaultTextBoxes);
                }

                return null;
              }

              return localContent.textBoxes.map((textBox: any, index: number) => {
                const TextComponent = textBox.type === 'textarea' ? 'textarea' : 'input';

                return (
                  <div key={index} style={{ position: 'relative', marginBottom: textBox.marginBottom || '20px' }}>
                    <TextComponent
                      value={textBox.text || ''}
                      onChange={(e: any) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[index] = { ...textBox, text: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      onClick={(e: any) => e.stopPropagation()}
                      onFocus={(e: any) => {
                        setEditingElement(`textBox-${index}`);
                        showTextFormattingToolbar(`heroTextBox-${index}`, e);
                      }}
                      onBlur={() => {
                        setEditingElement(null);
                        hideTextFormattingToolbar();
                      }}
                      data-toolbar-id={`heroTextBox-${index}`}
                      placeholder={textBox.placeholder || `Click to edit ${textBox.type}`}
                      rows={textBox.type === 'textarea' ? (textBox.rows || 3) : undefined}
                      style={{
                        fontSize: textBox.fontSize || '18px',
                        fontWeight: textBox.fontWeight || 'normal',
                        color: textBox.color || '#ffffff',
                        backgroundColor: textBox.backgroundColor || 'transparent',
                        border: editingElement === `textBox-${index}` ? '2px dashed #ffffff' : '2px dashed transparent',
                        padding: '10px',
                        width: '100%',
                        maxWidth: textBox.maxWidth || 'none',
                        textAlign: textBox.textAlign || 'center',
                        outline: 'none',
                        resize: textBox.type === 'textarea' ? 'none' : undefined,
                        fontFamily: 'inherit',
                        opacity: textBox.opacity || '1',
                        lineHeight: textBox.lineHeight || 'normal',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'block',
                      }}
                      onFocus={() => setEditingElement(`textBox-${index}`)}
                      onBlur={() => setEditingElement(null)}
                    />

                    {/* Text Settings Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTextEditor(index);
                      }}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: textBox.maxWidth ? `calc((100% - ${textBox.maxWidth}) / 2 - 8px)` : '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                      }}
                      title="Edit text settings"
                    >
                      ✏️
                    </button>
                  </div>
                );
              });
            })()}

            {/* Add/Manage Text Boxes */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTextManager(true);
              }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                border: '2px dashed rgba(255,255,255,0.5)',
                borderRadius: '8px',
                padding: '15px 30px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto',
              }}
            >
              <span style={{ fontSize: '16px' }}>📝</span>
              Manage Text Boxes
            </button>
          </div>

          {/* Buttons Section */}
          <div style={{ position: 'relative' }}>
            {(localContent.buttons && localContent.buttons.length > 0) && (
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: (localStyles.textAlign || 'center') === 'center' ? 'center' : (localStyles.textAlign === 'right' ? 'flex-end' : 'flex-start'),
                flexWrap: 'wrap',
                marginBottom: '20px',
              }}>
                {localContent.buttons.map((button: any, index: number) => {
                  // Use custom colors if available, otherwise fall back to predefined styles
                  const customStyle = button.backgroundColor || button.textColor ? {
                    backgroundColor: button.backgroundColor || '#ffffff',
                    color: button.textColor || '#1a1a1a',
                    border: button.borderColor ? `2px solid ${button.borderColor}` : 'none',
                  } : null;

                  const predefinedStyles = {
                    primary: {
                      backgroundColor: '#ffffff',
                      color: localStyles.backgroundColor || '#1a1a1a',
                      border: 'none',
                    },
                    secondary: {
                      backgroundColor: localStyles.textColor || '#ffffff',
                      color: localStyles.backgroundColor || '#1a1a1a',
                      border: 'none',
                    },
                    outline: {
                      backgroundColor: 'transparent',
                      color: localStyles.textColor || '#ffffff',
                      border: `2px solid ${localStyles.textColor || '#ffffff'}`,
                    },
                  };

                  const currentStyle = customStyle || predefinedStyles[button.style as keyof typeof predefinedStyles] || predefinedStyles.primary;

                  return (
                    <div key={index} style={{ position: 'relative' }}>
                      <input
                        value={button.text || ''}
                        onChange={(e) => {
                          const newButtons = [...(localContent.buttons || [])];
                          newButtons[index] = { ...button, text: e.target.value };
                          updateContent('buttons', newButtons);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Button text"
                        style={{
                          ...currentStyle,
                          padding: '15px 40px',
                          borderRadius: '8px',
                          fontSize: '18px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          outline: 'none',
                          minWidth: '150px',
                          textAlign: 'center',
                        }}
                      />

                      {/* Button Settings Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowButtonEditor(index);
                        }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                        }}
                        title="Edit button settings"
                      >
                        ⚙️
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add/Manage Buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowButtonManager(true);
              }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: '#ffffff',
                border: '2px dashed rgba(255,255,255,0.5)',
                borderRadius: '8px',
                padding: '15px 30px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto',
              }}
            >
              <span style={{ fontSize: '16px' }}>➕</span>
              Manage Buttons
            </button>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowImageUploader('background');
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#1a1a1a';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#ffffff',
            zIndex: 100,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '16px' }}>🎨</span>
          Background Settings
        </button>
      </div>
    );
  }

  function renderTextBlock() {
    return (
      <div
        style={{
          padding: localStyles.padding || '60px 20px',
          backgroundColor: localStyles.backgroundColor || '#f5f5f5',
          position: 'relative',
        }}
      >
        {showColorPicker === 'background' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowColorPicker(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Background Color</h3>
              <input
                type="color"
                value={localStyles.backgroundColor || '#f5f5f5'}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                style={{ width: '100%', height: '100px', cursor: 'pointer', borderRadius: '6px', border: 'none' }}
              />
              <button
                onClick={() => setShowColorPicker(null)}
                style={{
                  marginTop: '20px',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Text Editor Modal */}
        {showTextEditor !== null && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowTextEditor(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Text Box Settings</h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Text Content
                </label>
                {localContent.textBoxes[showTextEditor].type === 'textarea' ? (
                  <textarea
                    value={localContent.textBoxes[showTextEditor].text || ''}
                    onChange={(e) => {
                      const newTextBoxes = [...(localContent.textBoxes || [])];
                      newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], text: e.target.value };
                      updateContent('textBoxes', newTextBoxes);
                    }}
                    rows={4}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '14px' }}
                  />
                ) : (
                  <input
                    type="text"
                    value={localContent.textBoxes[showTextEditor].text || ''}
                    onChange={(e) => {
                      const newTextBoxes = [...(localContent.textBoxes || [])];
                      newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], text: e.target.value };
                      updateContent('textBoxes', newTextBoxes);
                    }}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '14px' }}
                  />
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Text Type
                </label>
                <select
                  value={localContent.textBoxes[showTextEditor].type || 'input'}
                  onChange={(e) => {
                    const newTextBoxes = [...(localContent.textBoxes || [])];
                    newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], type: e.target.value as 'input' | 'textarea' };
                    updateContent('textBoxes', newTextBoxes);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '14px' }}
                >
                  <option value="input">Single Line (Heading)</option>
                  <option value="textarea">Multi-line (Paragraph)</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Font Size
                </label>
                <input
                  type="text"
                  value={localContent.textBoxes[showTextEditor].fontSize || '16px'}
                  onChange={(e) => {
                    const newTextBoxes = [...(localContent.textBoxes || [])];
                    newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], fontSize: e.target.value };
                    updateContent('textBoxes', newTextBoxes);
                  }}
                  placeholder="e.g., 18px, 1.5rem, 24px"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Font Weight
                </label>
                <select
                  value={localContent.textBoxes[showTextEditor].fontWeight || 'normal'}
                  onChange={(e) => {
                    const newTextBoxes = [...(localContent.textBoxes || [])];
                    newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], fontWeight: e.target.value };
                    updateContent('textBoxes', newTextBoxes);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '14px' }}
                >
                  <option value="300">Light</option>
                  <option value="normal">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi-Bold</option>
                  <option value="bold">Bold</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Text Color
                </label>
                <input
                  type="color"
                  value={localContent.textBoxes[showTextEditor].color || '#333333'}
                  onChange={(e) => {
                    const newTextBoxes = [...(localContent.textBoxes || [])];
                    newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], color: e.target.value };
                    updateContent('textBoxes', newTextBoxes);
                  }}
                  style={{ width: '100%', height: '50px', cursor: 'pointer', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Background Color
                </label>
                <input
                  type="color"
                  value={localContent.textBoxes[showTextEditor].backgroundColor || '#transparent'}
                  onChange={(e) => {
                    const newTextBoxes = [...(localContent.textBoxes || [])];
                    newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], backgroundColor: e.target.value };
                    updateContent('textBoxes', newTextBoxes);
                  }}
                  style={{ width: '100%', height: '50px', cursor: 'pointer', borderRadius: '6px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Text Alignment
                </label>
                <select
                  value={localContent.textBoxes[showTextEditor].textAlign || 'left'}
                  onChange={(e) => {
                    const newTextBoxes = [...(localContent.textBoxes || [])];
                    newTextBoxes[showTextEditor] = { ...newTextBoxes[showTextEditor], textAlign: e.target.value as 'left' | 'center' | 'right' };
                    updateContent('textBoxes', newTextBoxes);
                  }}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e0e0e0', fontSize: '14px' }}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    const newTextBoxes = [...(localContent.textBoxes || [])];
                    newTextBoxes.splice(showTextEditor, 1);
                    updateContent('textBoxes', newTextBoxes);
                    setShowTextEditor(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#dc3545',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Delete Text Box
                </button>
                <button
                  onClick={() => setShowTextEditor(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Text Manager Modal */}
        {showTextManager && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowTextManager(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Manage Text Boxes</h3>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Current Text Boxes:</h4>
                {localContent.textBoxes && localContent.textBoxes.length > 0 ? (
                  localContent.textBoxes.map((textBox: any, index: number) => (
                    <div key={index} style={{
                      padding: '10px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      marginBottom: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600' }}>
                          {textBox.type === 'input' ? '📝 Heading' : '📄 Paragraph'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                          {textBox.text ? textBox.text.substring(0, 50) + (textBox.text.length > 50 ? '...' : '') : 'Empty text box'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                          onClick={() => {
                            setShowTextManager(false);
                            setShowTextEditor(index);
                          }}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#007bff',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            const newTextBoxes = [...(localContent.textBoxes || [])];
                            newTextBoxes.splice(index, 1);
                            updateContent('textBoxes', newTextBoxes);
                          }}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#dc3545',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#666', fontSize: '14px' }}>No text boxes yet. Add one below!</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                  onClick={() => {
                    const newTextBoxes = [...(localContent.textBoxes || [])];
                    newTextBoxes.push({
                      id: `textbox-${Date.now()}`,
                      type: 'input',
                      text: 'New Heading',
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: localStyles.headingColor || '#1a1a1a',
                      textAlign: 'left',
                      marginBottom: '20px',
                    });
                    updateContent('textBoxes', newTextBoxes);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#28a745',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  + Add Heading
                </button>
                <button
                  onClick={() => {
                    const newTextBoxes = [...(localContent.textBoxes || [])];
                    newTextBoxes.push({
                      id: `textbox-${Date.now()}`,
                      type: 'textarea',
                      text: 'New paragraph text...',
                      fontSize: localStyles.fontSize || '16px',
                      fontWeight: 'normal',
                      color: localStyles.textColor || '#333333',
                      textAlign: 'left',
                      marginBottom: '20px',
                      lineHeight: '1.8',
                    });
                    updateContent('textBoxes', newTextBoxes);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#17a2b8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  + Add Paragraph
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    updateContent('textBoxes', []);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#dc3545',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Remove All Text Boxes
                </button>
                <button
                  onClick={() => setShowTextManager(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Button Editor Modal for Text Block */}
        {showButtonEditor !== null && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowButtonEditor(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>
                Button Settings
              </h3>

              {localContent.buttons && localContent.buttons[showButtonEditor] && (
                <>
                  {/* Button Text */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={localContent.buttons[showButtonEditor].text || ''}
                      onChange={(e) => {
                        const newButtons = [...(localContent.buttons || [])];
                        newButtons[showButtonEditor] = { ...newButtons[showButtonEditor], text: e.target.value };
                        updateContent('buttons', newButtons);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                    />
                  </div>

                  {/* Button Link */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Button Link
                    </label>
                    <input
                      type="text"
                      value={localContent.buttons[showButtonEditor].link || ''}
                      onChange={(e) => {
                        const newButtons = [...(localContent.buttons || [])];
                        newButtons[showButtonEditor] = { ...newButtons[showButtonEditor], link: e.target.value };
                        updateContent('buttons', newButtons);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e0e0e0',
                        fontSize: '14px',
                      }}
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* Background Color */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={localContent.buttons[showButtonEditor].backgroundColor || '#ffffff'}
                      onChange={(e) => {
                        const newButtons = [...(localContent.buttons || [])];
                        newButtons[showButtonEditor] = { ...newButtons[showButtonEditor], backgroundColor: e.target.value };
                        updateContent('buttons', newButtons);
                      }}
                      style={{ width: '100%', height: '50px', cursor: 'pointer', borderRadius: '6px' }}
                    />
                  </div>

                  {/* Text Color */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={localContent.buttons[showButtonEditor].textColor || '#1a1a1a'}
                      onChange={(e) => {
                        const newButtons = [...(localContent.buttons || [])];
                        newButtons[showButtonEditor] = { ...newButtons[showButtonEditor], textColor: e.target.value };
                        updateContent('buttons', newButtons);
                      }}
                      style={{ width: '100%', height: '50px', cursor: 'pointer', borderRadius: '6px' }}
                    />
                  </div>

                  {/* Border Color */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Border Color
                    </label>
                    <input
                      type="color"
                      value={localContent.buttons[showButtonEditor].borderColor || '#1a1a1a'}
                      onChange={(e) => {
                        const newButtons = [...(localContent.buttons || [])];
                        newButtons[showButtonEditor] = { ...newButtons[showButtonEditor], borderColor: e.target.value };
                        updateContent('buttons', newButtons);
                      }}
                      style={{ width: '100%', height: '50px', cursor: 'pointer', borderRadius: '6px' }}
                    />
                  </div>

                  {/* Delete Button */}
                  <div style={{ marginBottom: '20px' }}>
                    <button
                      onClick={() => {
                        const newButtons = localContent.buttons.filter((_: any, i: number) => i !== showButtonEditor);
                        updateContent('buttons', newButtons);
                        setShowButtonEditor(null);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#dc3545',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      Delete Button
                    </button>
                  </div>

                  {/* Done Button */}
                  <button
                    onClick={() => setShowButtonEditor(null)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1a1a1a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Done
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Button Manager Modal for Text Block */}
        {showButtonManager && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowButtonManager(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Manage Buttons</h3>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Current Buttons:</h4>
                {localContent.buttons && localContent.buttons.length > 0 ? (
                  localContent.buttons.map((button: any, index: number) => (
                    <div key={index} style={{
                      padding: '15px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                          {button.text || 'Unnamed Button'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Link: {button.link || 'No link set'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                          Colors: {button.backgroundColor || 'Default'} / {button.textColor || 'Default'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setShowButtonManager(false);
                            setShowButtonEditor(index);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#007bff',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            const newButtons = localContent.buttons.filter((_: any, i: number) => i !== index);
                            updateContent('buttons', newButtons);
                          }}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: '#666', fontSize: '14px' }}>No buttons yet. Add one below!</p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <button
                  onClick={() => {
                    const newButtons = [...(localContent.buttons || [])];
                    newButtons.push({
                      text: 'New Button',
                      link: '#',
                      style: 'primary',
                      backgroundColor: localStyles.headingColor || '#1a1a1a',
                      textColor: '#ffffff',
                      borderColor: localStyles.headingColor || '#1a1a1a',
                    });
                    updateContent('buttons', newButtons);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#28a745',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  + Add Primary Button
                </button>
                <button
                  onClick={() => {
                    const newButtons = [...(localContent.buttons || [])];
                    newButtons.push({
                      text: 'New Button',
                      link: '#',
                      style: 'outline',
                      backgroundColor: 'transparent',
                      textColor: localStyles.headingColor || '#1a1a1a',
                      borderColor: localStyles.headingColor || '#1a1a1a',
                    });
                    updateContent('buttons', newButtons);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#17a2b8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  + Add Outline Button
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    updateContent('buttons', []);
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#dc3545',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Remove All Buttons
                </button>
                <button
                  onClick={() => setShowButtonManager(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={{
          maxWidth: localStyles.maxWidth || '1200px',
          margin: '0 auto',
          fontFamily: localStyles.fontFamily || 'inherit',
        }}>
          {/* Dynamic Text Boxes */}
          <div style={{ position: 'relative', marginBottom: '40px' }}>
            {/* Initialize default text boxes if none exist */}
            {(() => {
              if (!localContent.textBoxes || localContent.textBoxes.length === 0) {
                // Migrate existing content to new system
                const defaultTextBoxes = [];

                if (localContent.heading) {
                  defaultTextBoxes.push({
                    id: 'heading',
                    type: 'input',
                    text: localContent.heading,
                    fontSize: `calc(${localStyles.fontSize || '16px'} * 2)`,
                    fontWeight: 'bold',
                    color: localStyles.headingColor || '#1a1a1a',
                    textAlign: localContent.alignment || 'left',
                    marginBottom: '20px',
                  });
                }

                if (localContent.text) {
                  defaultTextBoxes.push({
                    id: 'text',
                    type: 'textarea',
                    text: localContent.text,
                    fontSize: localStyles.fontSize || '16px',
                    fontWeight: 'normal',
                    color: localStyles.textColor || '#333333',
                    textAlign: localContent.alignment || 'left',
                    marginBottom: '30px',
                    lineHeight: '1.8',
                  });
                }

                if (defaultTextBoxes.length > 0) {
                  updateContent('textBoxes', defaultTextBoxes);
                }
              }

              return localContent.textBoxes?.map((textBox: any, index: number) => {
                const TextComponent = textBox.type === 'textarea' ? 'textarea' : 'input';

                return (
                  <div key={index} style={{ position: 'relative', marginBottom: textBox.marginBottom || '20px' }}>
                    <TextComponent
                      value={textBox.text || ''}
                      onChange={(e: any) => {
                        const newTextBoxes = [...(localContent.textBoxes || [])];
                        newTextBoxes[index] = { ...textBox, text: e.target.value };
                        updateContent('textBoxes', newTextBoxes);
                      }}
                      onClick={(e: any) => e.stopPropagation()}
                      onFocus={(e: any) => {
                        setEditingElement(`textBox-${index}`);
                        showTextFormattingToolbar(`textBlockTextBox-${index}`, e);
                      }}
                      onBlur={() => {
                        setEditingElement(null);
                        hideTextFormattingToolbar();
                      }}
                      data-toolbar-id={`textBlockTextBox-${index}`}
                      placeholder={textBox.type === 'textarea' ? 'Click to edit paragraph' : 'Click to edit heading'}
                      rows={textBox.type === 'textarea' ? 6 : undefined}
                      style={{
                        fontSize: textBox.fontSize || '16px',
                        fontWeight: textBox.fontWeight || 'normal',
                        color: textBox.color || '#333333',
                        backgroundColor: textBox.backgroundColor && textBox.backgroundColor !== 'transparent' ? textBox.backgroundColor : 'transparent',
                        border: editingElement === `textBox-${index}` ? '2px dashed #1a1a1a' : '2px dashed transparent',
                        padding: textBox.backgroundColor && textBox.backgroundColor !== 'transparent' ? '15px' : '10px',
                        width: '100%',
                        maxWidth: textBox.maxWidth || 'none',
                        textAlign: textBox.textAlign || 'left',
                        outline: 'none',
                        resize: textBox.type === 'textarea' ? 'vertical' : undefined,
                        fontFamily: 'inherit',
                        opacity: textBox.opacity || '1',
                        lineHeight: textBox.lineHeight || 'normal',
                        marginLeft: textBox.textAlign === 'center' ? 'auto' : '0',
                        marginRight: textBox.textAlign === 'center' ? 'auto' : '0',
                        display: 'block',
                        borderRadius: textBox.backgroundColor && textBox.backgroundColor !== 'transparent' ? '6px' : '0',
                      }}
                      onFocus={() => setEditingElement(`textBox-${index}`)}
                      onBlur={() => setEditingElement(null)}
                    />

                    {/* Text Settings Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTextEditor(index);
                      }}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: textBox.maxWidth && textBox.textAlign === 'center' ? `calc((100% - ${textBox.maxWidth}) / 2 - 8px)` : '-8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                      }}
                      title="Edit text settings"
                    >
                      ✏️
                    </button>
                  </div>
                );
              });
            })()}

            {/* Manage Text Boxes Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTextManager(true);
              }}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: 'transparent',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: '#666',
                marginBottom: '20px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1a1a1a';
                e.currentTarget.style.color = '#1a1a1a';
                e.currentTarget.style.backgroundColor = 'rgba(26,26,26,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ccc';
                e.currentTarget.style.color = '#666';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              📝 Manage Text Boxes
            </button>
          </div>
          {/* Buttons Section */}
          <div style={{ position: 'relative' }}>
            {(localContent.buttons && localContent.buttons.length > 0) && (
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: (localContent.alignment || 'left') === 'center' ? 'center' : ((localContent.alignment === 'right') ? 'flex-end' : 'flex-start'),
                flexWrap: 'wrap',
                marginBottom: '20px',
              }}>
                {localContent.buttons.map((button: any, index: number) => {
                  // Use custom colors if available, otherwise fall back to predefined styles
                  const customStyle = button.backgroundColor || button.textColor ? {
                    backgroundColor: button.backgroundColor || '#ffffff',
                    color: button.textColor || '#1a1a1a',
                    border: button.borderColor ? `2px solid ${button.borderColor}` : 'none',
                  } : null;

                  const predefinedStyles = {
                    primary: {
                      backgroundColor: localStyles.headingColor || '#1a1a1a',
                      color: '#ffffff',
                      border: 'none',
                    },
                    secondary: {
                      backgroundColor: localStyles.textColor || '#333333',
                      color: '#ffffff',
                      border: 'none',
                    },
                    outline: {
                      backgroundColor: 'transparent',
                      color: localStyles.headingColor || '#1a1a1a',
                      border: `2px solid ${localStyles.headingColor || '#1a1a1a'}`,
                    },
                  };

                  const currentStyle = customStyle || predefinedStyles[button.style as keyof typeof predefinedStyles] || predefinedStyles.primary;

                  return (
                    <div key={index} style={{ position: 'relative' }}>
                      <input
                        value={button.text || ''}
                        onChange={(e) => {
                          const newButtons = [...(localContent.buttons || [])];
                          newButtons[index] = { ...button, text: e.target.value };
                          updateContent('buttons', newButtons);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Button text"
                        style={{
                          ...currentStyle,
                          padding: '12px 30px',
                          borderRadius: '6px',
                          fontSize: localStyles.fontSize || '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          outline: 'none',
                          minWidth: '120px',
                          textAlign: 'center',
                        }}
                      />

                      {/* Button Settings Icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowButtonEditor(index);
                        }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                        }}
                        title="Edit button settings"
                      >
                        ⚙️
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Manage Buttons Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowButtonManager(true);
              }}
              style={{
                width: '100%',
                padding: '15px',
                backgroundColor: 'transparent',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: '#666',
                marginBottom: '20px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1a1a1a';
                e.currentTarget.style.color = '#1a1a1a';
                e.currentTarget.style.backgroundColor = 'rgba(26,26,26,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ccc';
                e.currentTarget.style.color = '#666';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              🔘 Manage Buttons
            </button>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker('background');
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#1a1a1a';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '16px' }}>🎨</span>
          Background Color
        </button>
      </div>
    );
  }

  function renderImageBlock() {
    return (
      <div
        style={{
          padding: localStyles.padding || '60px 20px',
          backgroundColor: localStyles.backgroundColor || '#ffffff',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {showColorPicker === 'background' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowColorPicker(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Background Color</h3>
              <input
                type="color"
                value={localStyles.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                style={{ width: '100%', height: '100px', cursor: 'pointer', borderRadius: '6px', border: 'none' }}
              />
              <button
                onClick={() => setShowColorPicker(null)}
                style={{
                  marginTop: '20px',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Text Position Selector */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
              Text Position:
            </label>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateContent('textPosition', 'left');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: (localContent.textPosition || 'left') === 'left' ? '#1a1a1a' : '#f0f0f0',
                  color: (localContent.textPosition || 'left') === 'left' ? '#ffffff' : '#333333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Text on Right
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateContent('textPosition', 'right');
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: localContent.textPosition === 'right' ? '#1a1a1a' : '#f0f0f0',
                  color: localContent.textPosition === 'right' ? '#ffffff' : '#333333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Text on Left
              </button>
            </div>
          </div>

          {/* Image and Text Layout */}
          <div style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'center',
            flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          }}>
            {/* Image Section */}
            {(localContent.textPosition !== 'right') && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageUploader('main');
                }}
                style={{
                  cursor: 'pointer',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '20px',
                  flex: '0 0 auto',
                  maxWidth: '50%',
                  width: '100%',
                }}
              >
                {localContent.imageUrl ? (
                  <img
                    src={localContent.imageUrl}
                    alt={localContent.alt || ''}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: localStyles.borderRadius || '8px',
                      border: localStyles.border || 'none',
                    }}
                  />
                ) : (
                  <div style={{ padding: '60px', color: '#999', fontSize: '16px', textAlign: 'center' }}>
                    Click to upload image
                  </div>
                )}
              </div>
            )}

            {/* Text Section */}
            <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <textarea
                value={localContent.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Click to add text content..."
                rows={8}
                style={{
                  fontSize: localStyles.textSize || '16px',
                  lineHeight: '1.6',
                  color: localStyles.textColor || '#333333',
                  backgroundColor: 'transparent',
                  border: editingElement === 'text' ? '2px dashed #1a1a1a' : '2px dashed transparent',
                  padding: '15px',
                  width: '100%',
                  textAlign: localStyles.textAlign || 'left',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  borderRadius: '6px',
                }}
                onFocus={() => setEditingElement('text')}
                onBlur={() => setEditingElement(null)}
              />
            </div>

            {/* Image Section (when text is on left) */}
            {localContent.textPosition === 'right' && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageUploader('main');
                }}
                style={{
                  cursor: 'pointer',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  padding: '20px',
                  flex: '0 0 auto',
                  maxWidth: '50%',
                  width: '100%',
                }}
              >
                {localContent.imageUrl ? (
                  <img
                    src={localContent.imageUrl}
                    alt={localContent.alt || ''}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: localStyles.borderRadius || '8px',
                      border: localStyles.border || 'none',
                    }}
                  />
                ) : (
                  <div style={{ padding: '60px', color: '#999', fontSize: '16px', textAlign: 'center' }}>
                    Click to upload image
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

          {showImageUploader === 'main' && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3000,
              }}
              onClick={() => setShowImageUploader(null)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '30px',
                  maxWidth: '600px',
                  width: '90%',
                }}
              >
                <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Image Settings</h3>

                <ImageUploader
                  value={localContent.imageUrl || ''}
                  onChange={(url) => {
                    updateContent('imageUrl', url);
                    setShowImageUploader(null);
                  }}
                  label="Image"
                />

                <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Alt Text (for accessibility)
                  </label>
                  <input
                    type="text"
                    value={localContent.alt || ''}
                    onChange={(e) => updateContent('alt', e.target.value)}
                    placeholder="Describe the image..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Link (optional)
                  </label>
                  <input
                    type="text"
                    value={localContent.link || ''}
                    onChange={(e) => updateContent('link', e.target.value)}
                    placeholder="https://example.com"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #e0e0e0',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <button
                  onClick={() => setShowImageUploader(null)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker('background');
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#1a1a1a';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '16px' }}>🎨</span>
          Background Color
        </button>
      </div>
    );
  }

  function renderTwoColumnBlock() {
    return (
      <div
        style={{
          padding: localStyles.padding || '60px 20px',
          backgroundColor: localStyles.backgroundColor || '#ffffff',
          position: 'relative',
        }}
      >
        {showColorPicker === 'background' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowColorPicker(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Background Color</h3>
              <input
                type="color"
                value={localStyles.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                style={{ width: '100%', height: '100px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #e0e0e0' }}
              />
              <button
                onClick={() => setShowColorPicker(null)}
                style={{
                  marginTop: '20px',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Layout Controls */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Column Ratio Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Column Ratio:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['1fr 1fr', '1fr 2fr', '2fr 1fr'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStyles('columnRatio', ratio);
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: (localStyles.columnRatio || '1fr 1fr') === ratio ? '#1a1a1a' : '#f0f0f0',
                      color: (localStyles.columnRatio || '1fr 1fr') === ratio ? '#ffffff' : '#333333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {ratio === '1fr 1fr' ? '50/50' : ratio === '1fr 2fr' ? '33/67' : '67/33'}
                  </button>
                ))}
              </div>
            </div>

            {/* Vertical Alignment */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600' }}>Alignment:</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { value: 'top', label: 'Top', icon: '⬆️' },
                  { value: 'center', label: 'Center', icon: '↔️' },
                  { value: 'bottom', label: 'Bottom', icon: '⬇️' }
                ].map((align) => (
                  <button
                    key={align.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStyles('verticalAlign', align.value);
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: (localStyles.verticalAlign || 'center') === align.value ? '#1a1a1a' : '#f0f0f0',
                      color: (localStyles.verticalAlign || 'center') === align.value ? '#ffffff' : '#333333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{align.icon}</span>
                    {align.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: localStyles.columnRatio || '1fr 1fr',
          gap: localStyles.gap || '40px',
          alignItems: localStyles.verticalAlign === 'top' ? 'flex-start' : localStyles.verticalAlign === 'bottom' ? 'flex-end' : 'center'
        }}>
          {/* Left Column */}
          <div style={{ position: 'relative' }}>
            {/* Column Type Selector */}
            <div style={{ marginBottom: '15px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateNestedContent(['leftColumn', 'type'], 'text');
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: (localContent.leftColumn?.type || 'text') === 'text' ? '#1a1a1a' : '#f0f0f0',
                  color: (localContent.leftColumn?.type || 'text') === 'text' ? '#ffffff' : '#333333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                📝 Text
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateNestedContent(['leftColumn', 'type'], 'image');
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: localContent.leftColumn?.type === 'image' ? '#1a1a1a' : '#f0f0f0',
                  color: localContent.leftColumn?.type === 'image' ? '#ffffff' : '#333333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                🖼️ Image
              </button>
            </div>

            {/* Column Heading */}
            <input
              value={localContent.leftColumn?.heading || ''}
              onChange={(e) => updateNestedContent(['leftColumn', 'heading'], e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Column heading (optional)"
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: localStyles.headingColor || '#1a1a1a',
                backgroundColor: 'transparent',
                border: editingElement === 'leftHeading' ? '2px dashed #1a1a1a' : '2px dashed transparent',
                padding: '10px',
                width: '100%',
                outline: 'none',
                marginBottom: '15px',
              }}
              onFocus={(e) => {
                setEditingElement('leftHeading');
                showTextFormattingToolbar('leftColumn-heading', e);
              }}
              onBlur={() => {
                setEditingElement(null);
                hideTextFormattingToolbar();
              }}
              data-toolbar-id="leftColumn-heading"
            />

            {/* Column Content */}
            {(localContent.leftColumn?.type || 'text') === 'text' ? (
              <textarea
                value={localContent.leftColumn?.content || ''}
                onChange={(e) => updateNestedContent(['leftColumn', 'content'], e.target.value)}
                placeholder="Click to edit left column text"
                rows={10}
                style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: localStyles.textColor || '#333',
                  backgroundColor: 'transparent',
                  border: editingElement === 'leftColumn' ? '2px dashed #1a1a1a' : '2px dashed transparent',
                  padding: '15px',
                  width: '100%',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  borderRadius: '6px',
                }}
                onFocus={(e) => {
                  setEditingElement('leftColumn');
                  showTextFormattingToolbar('leftColumn-content', e);
                }}
                onBlur={() => {
                  setEditingElement(null);
                  hideTextFormattingToolbar();
                }}
                data-toolbar-id="leftColumn-content"
              />
            ) : (
              <div
                onClick={() => setShowImageUploader('leftColumn')}
                style={{
                  cursor: 'pointer',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  minHeight: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {localContent.leftColumn?.content ? (
                  <img
                    src={localContent.leftColumn.content}
                    alt="Left column"
                    style={{ width: '100%', height: 'auto' }}
                  />
                ) : (
                  <div style={{ color: '#999', fontSize: '16px' }}>Click to upload image</div>
                )}
              </div>
            )}

            {showImageUploader === 'leftColumn' && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3000,
                }}
                onClick={() => setShowImageUploader(null)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '30px',
                    maxWidth: '600px',
                    width: '90%',
                  }}
                >
                  <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Left Column Image</h3>

                  <ImageUploader
                    value={localContent.leftColumn?.content || ''}
                    onChange={(url) => {
                      updateNestedContent(['leftColumn', 'content'], url);
                      setShowImageUploader(null);
                    }}
                    label="Image"
                  />

                  <button
                    onClick={() => setShowImageUploader(null)}
                    style={{
                      marginTop: '20px',
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1a1a1a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ position: 'relative' }}>
            {/* Column Type Selector */}
            <div style={{ marginBottom: '15px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateNestedContent(['rightColumn', 'type'], 'text');
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: (localContent.rightColumn?.type || 'text') === 'text' ? '#1a1a1a' : '#f0f0f0',
                  color: (localContent.rightColumn?.type || 'text') === 'text' ? '#ffffff' : '#333333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                📝 Text
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateNestedContent(['rightColumn', 'type'], 'image');
                }}
                style={{
                  padding: '6px 12px',
                  backgroundColor: localContent.rightColumn?.type === 'image' ? '#1a1a1a' : '#f0f0f0',
                  color: localContent.rightColumn?.type === 'image' ? '#ffffff' : '#333333',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                🖼️ Image
              </button>
            </div>

            {/* Column Heading */}
            <input
              value={localContent.rightColumn?.heading || ''}
              onChange={(e) => updateNestedContent(['rightColumn', 'heading'], e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Column heading (optional)"
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: localStyles.headingColor || '#1a1a1a',
                backgroundColor: 'transparent',
                border: editingElement === 'rightHeading' ? '2px dashed #1a1a1a' : '2px dashed transparent',
                padding: '10px',
                width: '100%',
                outline: 'none',
                marginBottom: '15px',
              }}
              onFocus={(e) => {
                setEditingElement('rightHeading');
                showTextFormattingToolbar('rightColumn-heading', e);
              }}
              onBlur={() => {
                setEditingElement(null);
                hideTextFormattingToolbar();
              }}
              data-toolbar-id="rightColumn-heading"
            />

            {/* Column Content */}
            {(localContent.rightColumn?.type || 'text') === 'text' ? (
              <textarea
                value={localContent.rightColumn?.content || ''}
                onChange={(e) => updateNestedContent(['rightColumn', 'content'], e.target.value)}
                placeholder="Click to edit right column text"
                rows={10}
                style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: localStyles.textColor || '#333',
                  backgroundColor: 'transparent',
                  border: editingElement === 'rightColumn' ? '2px dashed #1a1a1a' : '2px dashed transparent',
                  padding: '15px',
                  width: '100%',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  borderRadius: '6px',
                }}
                onFocus={(e) => {
                  setEditingElement('rightColumn');
                  showTextFormattingToolbar('rightColumn-content', e);
                }}
                onBlur={() => {
                  setEditingElement(null);
                  hideTextFormattingToolbar();
                }}
                data-toolbar-id="rightColumn-content"
              />
            ) : (
              <div
                onClick={() => setShowImageUploader('rightColumn')}
                style={{
                  cursor: 'pointer',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  minHeight: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {localContent.rightColumn?.content ? (
                  <img
                    src={localContent.rightColumn.content}
                    alt="Right column"
                    style={{ width: '100%', height: 'auto' }}
                  />
                ) : (
                  <div style={{ color: '#999', fontSize: '16px' }}>Click to upload image</div>
                )}
              </div>
            )}

            {showImageUploader === 'rightColumn' && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3000,
                }}
                onClick={() => setShowImageUploader(null)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '30px',
                    maxWidth: '600px',
                    width: '90%',
                  }}
                >
                  <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Right Column Image</h3>

                  <ImageUploader
                    value={localContent.rightColumn?.content || ''}
                    onChange={(url) => {
                      updateNestedContent(['rightColumn', 'content'], url);
                      setShowImageUploader(null);
                    }}
                    label="Image"
                  />

                  <button
                    onClick={() => setShowImageUploader(null)}
                    style={{
                      marginTop: '20px',
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#1a1a1a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Right Column Buttons */}
            {(localContent.rightColumn?.type || 'text') === 'text' && (
              <div style={{ marginTop: '20px' }}>
                {/* Display existing buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                  {(localContent.buttons || [])
                    .filter((btn: any) => btn.column === 'right')
                    .map((button: any, index: number) => {
                      const globalIndex = (localContent.buttons || []).findIndex((b: any) => b === button);
                      return (
                        <div key={globalIndex} style={{ position: 'relative', display: 'inline-block' }}>
                          <button
                            style={{
                              padding: '8px 16px',
                              backgroundColor: button.backgroundColor || '#1a1a1a',
                              color: button.textColor || '#ffffff',
                              border: button.borderColor ? `2px solid ${button.borderColor}` : 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            {button.text}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowButtonEditor(globalIndex);
                            }}
                            style={{
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: '#1a1a1a',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            title="Edit button"
                          >
                            ⚙️
                          </button>
                        </div>
                      );
                    })}
                </div>

                {/* Manage Buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowButtonManager(true);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f0f0f0',
                    color: '#333333',
                    border: '2px dashed #cccccc',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    width: '100%',
                  }}
                >
                  🔘 Manage Right Column Buttons
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Left Column Buttons Section */}
        <div style={{ maxWidth: '1200px', margin: '20px auto 0', display: 'grid', gridTemplateColumns: localStyles.columnRatio || '1fr 1fr', gap: localStyles.gap || '40px' }}>
          <div>
            {(localContent.leftColumn?.type || 'text') === 'text' && (
              <div>
                {/* Display existing buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                  {(localContent.buttons || [])
                    .filter((btn: any) => btn.column === 'left')
                    .map((button: any, index: number) => {
                      const globalIndex = (localContent.buttons || []).findIndex((b: any) => b === button);
                      return (
                        <div key={globalIndex} style={{ position: 'relative', display: 'inline-block' }}>
                          <button
                            style={{
                              padding: '8px 16px',
                              backgroundColor: button.backgroundColor || '#1a1a1a',
                              color: button.textColor || '#ffffff',
                              border: button.borderColor ? `2px solid ${button.borderColor}` : 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            {button.text}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowButtonEditor(globalIndex);
                            }}
                            style={{
                              position: 'absolute',
                              top: '-8px',
                              right: '-8px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: '#1a1a1a',
                              color: '#ffffff',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            title="Edit button"
                          >
                            ⚙️
                          </button>
                        </div>
                      );
                    })}
                </div>

                {/* Manage Buttons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowButtonManager(true);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f0f0f0',
                    color: '#333333',
                    border: '2px dashed #cccccc',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    width: '100%',
                  }}
                >
                  🔘 Manage Left Column Buttons
                </button>
              </div>
            )}
          </div>
          <div></div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker('background');
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#1a1a1a';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '16px' }}>🎨</span>
          Background Color
        </button>

        {/* Button Editor Modal for Two Column */}
        {showButtonEditor !== null && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowButtonEditor(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Edit Button</h3>

              {(() => {
                const button = (localContent.buttons || [])[showButtonEditor];
                if (!button) return null;

                return (
                  <>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={button.text || ''}
                        onChange={(e) => {
                          const newButtons = [...(localContent.buttons || [])];
                          newButtons[showButtonEditor] = { ...button, text: e.target.value };
                          updateContent('buttons', newButtons);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0',
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={button.link || ''}
                        onChange={(e) => {
                          const newButtons = [...(localContent.buttons || [])];
                          newButtons[showButtonEditor] = { ...button, link: e.target.value };
                          updateContent('buttons', newButtons);
                        }}
                        placeholder="https://example.com"
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0',
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                        Column
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {['left', 'right'].map((column) => (
                          <button
                            key={column}
                            onClick={() => {
                              const newButtons = [...(localContent.buttons || [])];
                              newButtons[showButtonEditor] = { ...button, column };
                              updateContent('buttons', newButtons);
                            }}
                            style={{
                              flex: 1,
                              padding: '10px',
                              backgroundColor: button.column === column ? '#1a1a1a' : '#f0f0f0',
                              color: button.column === column ? '#ffffff' : '#333333',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: '600',
                              textTransform: 'capitalize',
                            }}
                          >
                            {column} Column
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                          Background Color
                        </label>
                        <input
                          type="color"
                          value={button.backgroundColor || '#1a1a1a'}
                          onChange={(e) => {
                            const newButtons = [...(localContent.buttons || [])];
                            newButtons[showButtonEditor] = { ...button, backgroundColor: e.target.value };
                            updateContent('buttons', newButtons);
                          }}
                          style={{
                            width: '100%',
                            height: '40px',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={button.textColor || '#ffffff'}
                          onChange={(e) => {
                            const newButtons = [...(localContent.buttons || [])];
                            newButtons[showButtonEditor] = { ...button, textColor: e.target.value };
                            updateContent('buttons', newButtons);
                          }}
                          style={{
                            width: '100%',
                            height: '40px',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                          Border Color
                        </label>
                        <input
                          type="color"
                          value={button.borderColor || '#1a1a1a'}
                          onChange={(e) => {
                            const newButtons = [...(localContent.buttons || [])];
                            newButtons[showButtonEditor] = { ...button, borderColor: e.target.value };
                            updateContent('buttons', newButtons);
                          }}
                          style={{
                            width: '100%',
                            height: '40px',
                            cursor: 'pointer',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => {
                          const newButtons = localContent.buttons.filter((_: any, i: number) => i !== showButtonEditor);
                          updateContent('buttons', newButtons);
                          setShowButtonEditor(null);
                        }}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: '#dc3545',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Delete Button
                      </button>
                      <button
                        onClick={() => setShowButtonEditor(null)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: '#1a1a1a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Done
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Button Manager Modal for Two Column */}
        {showButtonManager && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowButtonManager(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Manage Buttons</h3>

              {/* Current Buttons */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>Current Buttons:</h4>
                {(localContent.buttons || []).length === 0 ? (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No buttons added yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(localContent.buttons || []).map((button: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600' }}>{button.text}</span>
                          <span style={{ fontSize: '12px', color: '#666', textTransform: 'capitalize' }}>
                            ({button.column} Column)
                          </span>
                        </div>
                        <button
                          onClick={() => setShowButtonEditor(index)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          ⚙️ Edit
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Button */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600' }}>Add New Button:</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['left', 'right'].map((column) => (
                    <button
                      key={column}
                      onClick={() => {
                        const newButton = {
                          text: `New ${column} Button`,
                          link: '#',
                          style: 'primary',
                          column: column,
                          backgroundColor: '#1a1a1a',
                          textColor: '#ffffff',
                          borderColor: '#1a1a1a',
                        };
                        const newButtons = [...(localContent.buttons || []), newButton];
                        updateContent('buttons', newButtons);
                      }}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: '#28a745',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      + Add {column} Button
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {(localContent.buttons || []).length > 0 && (
                  <button
                    onClick={() => {
                      updateContent('buttons', []);
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#dc3545',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Remove All Buttons
                  </button>
                )}
                <button
                  onClick={() => setShowButtonManager(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#1a1a1a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderGalleryBlock() {
    return (
      <div
        style={{
          padding: localStyles.padding || '60px 20px',
          backgroundColor: localStyles.backgroundColor || '#f5f5f5',
          position: 'relative',
        }}
      >
        {showColorPicker === 'background' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowColorPicker(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Background Color</h3>
              <input
                type="color"
                value={localStyles.backgroundColor || '#f5f5f5'}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                style={{ width: '100%', height: '100px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #e0e0e0' }}
              />
              <button
                onClick={() => setShowColorPicker(null)}
                style={{
                  marginTop: '20px',
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <input
            value={localContent.title || ''}
            onChange={(e) => updateContent('title', e.target.value)}
            placeholder="Click to edit gallery title"
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: localStyles.headingColor || '#1a1a1a',
              backgroundColor: 'transparent',
              border: editingElement === 'title' ? '2px dashed #1a1a1a' : '2px dashed transparent',
              padding: '10px',
              width: '100%',
              textAlign: 'center',
              outline: 'none',
              marginBottom: '40px',
            }}
            onFocus={() => setEditingElement('title')}
            onBlur={() => setEditingElement(null)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {(localContent.images || []).map((image: any, index: number) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  border: '2px dashed #ccc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  aspectRatio: '1',
                }}
              >
                <div
                  onClick={() => setShowImageUploader(`image-${index}`)}
                  style={{ width: '100%', height: '100%' }}
                >
                  {image.url ? (
                    <img
                      src={image.url}
                      alt={image.alt || ''}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                      Click to upload
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newImages = localContent.images.filter((_: any, i: number) => i !== index);
                    updateContent('images', newImages);
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(220, 53, 69, 0.9)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 1)';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.9)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title="Delete image"
                >
                  ×
                </button>

                {showImageUploader === `image-${index}` && (
                  <div
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 3000,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowImageUploader(null);
                    }}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        padding: '30px',
                        maxWidth: '600px',
                        width: '90%',
                      }}
                    >
                      <h3 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Gallery Image {index + 1}</h3>

                      <ImageUploader
                        value={image.url || ''}
                        onChange={(url) => {
                          const newImages = [...(localContent.images || [])];
                          newImages[index] = { ...image, url };
                          updateContent('images', newImages);
                          setShowImageUploader(null);
                        }}
                        label="Image"
                      />

                      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                          Alt Text (for accessibility)
                        </label>
                        <input
                          type="text"
                          value={image.alt || ''}
                          onChange={(e) => {
                            const newImages = [...(localContent.images || [])];
                            newImages[index] = { ...image, alt: e.target.value };
                            updateContent('images', newImages);
                          }}
                          placeholder="Describe the image..."
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0',
                            fontSize: '14px',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => {
                            const newImages = localContent.images.filter((_: any, i: number) => i !== index);
                            updateContent('images', newImages);
                            setShowImageUploader(null);
                          }}
                          style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#dc3545',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Delete Image
                        </button>
                        <button
                          onClick={() => setShowImageUploader(null)}
                          style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#1a1a1a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div
              onClick={() => {
                const newImages = [...(localContent.images || []), { url: '', alt: '', size: 'medium' }];
                updateContent('images', newImages);
              }}
              style={{
                cursor: 'pointer',
                border: '2px dashed #1a1a1a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1',
                fontSize: '48px',
                color: '#1a1a1a',
                backgroundColor: '#f9f9f9',
              }}
            >
              +
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker('background');
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#1a1a1a';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '16px' }}>🎨</span>
          Background Color
        </button>
      </div>
    );
  }

  function renderVideoBlock() {
    return (
      <div
        style={{
          padding: localStyles.padding || '60px 20px',
          backgroundColor: localStyles.backgroundColor || '#ffffff',
          position: 'relative',
        }}
      >
        {/* Background Color Picker */}
        {showColorPicker === 'background' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowColorPicker(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Background Color</h3>
              <input
                type="color"
                value={localStyles.backgroundColor || '#ffffff'}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  marginBottom: '20px',
                }}
              />
              <button
                onClick={() => setShowColorPicker(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: localStyles.textAlign || 'center' }}>
          {/* Title */}
          <input
            value={localContent.title || ''}
            onChange={(e) => updateContent('title', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => {
              setEditingElement('title');
              showTextFormattingToolbar('video-title', e);
            }}
            onBlur={() => {
              setEditingElement(null);
              hideTextFormattingToolbar();
            }}
            data-toolbar-id="video-title"
            placeholder="Video title (optional)"
            style={{
              fontSize: localStyles.titleSize || '32px',
              fontWeight: 'bold',
              color: localStyles.titleColor || '#1a1a1a',
              backgroundColor: 'transparent',
              border: editingElement === 'title' ? '2px dashed #1a1a1a' : '2px dashed transparent',
              padding: '10px',
              width: '100%',
              outline: 'none',
              marginBottom: '20px',
              textAlign: localStyles.textAlign || 'center',
            }}
          />

          {/* Description */}
          <textarea
            value={localContent.description || ''}
            onChange={(e) => updateContent('description', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => {
              setEditingElement('description');
              showTextFormattingToolbar('video-description', e);
            }}
            onBlur={() => {
              setEditingElement(null);
              hideTextFormattingToolbar();
            }}
            data-toolbar-id="video-description"
            placeholder="Video description (optional)"
            rows={3}
            style={{
              fontSize: localStyles.descriptionSize || '16px',
              color: localStyles.descriptionColor || '#666666',
              backgroundColor: 'transparent',
              border: editingElement === 'description' ? '2px dashed #1a1a1a' : '2px dashed transparent',
              padding: '15px',
              width: '100%',
              outline: 'none',
              resize: 'vertical',
              marginBottom: '30px',
              textAlign: localStyles.textAlign || 'center',
              fontFamily: 'inherit',
              lineHeight: '1.6',
            }}
          />

          {/* Video URL Input */}
          <div style={{ marginBottom: '20px' }}>
            <input
              value={localContent.videoUrl || ''}
              onChange={(e) => updateContent('videoUrl', e.target.value)}
              onClick={(e) => e.stopPropagation()}
              placeholder="Enter YouTube, Vimeo, or direct video URL"
              style={{
                fontSize: '16px',
                color: '#333333',
                backgroundColor: '#f8f9fa',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                padding: '15px',
                width: '100%',
                outline: 'none',
                marginBottom: '15px',
              }}
            />

            {/* Video Type Selector */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
              {['youtube', 'vimeo', 'direct'].map((type) => (
                <button
                  key={type}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateContent('videoType', type);
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: (localContent.videoType || 'youtube') === type ? '#1a1a1a' : '#f0f0f0',
                    color: (localContent.videoType || 'youtube') === type ? '#ffffff' : '#333333',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}
                >
                  {type === 'direct' ? 'Direct Video' : type}
                </button>
              ))}
            </div>
          </div>

          {/* Video Preview */}
          {localContent.videoUrl && (
            <div style={{ marginBottom: '30px' }}>
              <VideoBlock
                content={{
                  videoUrl: localContent.videoUrl,
                  videoType: localContent.videoType || 'youtube',
                  title: localContent.title,
                  description: localContent.description,
                  autoplay: localContent.autoplay || false,
                  muted: localContent.muted || false,
                  controls: localContent.controls !== false,
                  loop: localContent.loop || false,
                }}
                styles={{
                  backgroundColor: 'transparent',
                  padding: '0',
                  textAlign: localStyles.textAlign || 'center',
                  titleColor: localStyles.titleColor || '#1a1a1a',
                  titleSize: localStyles.titleSize || '32px',
                  descriptionColor: localStyles.descriptionColor || '#666666',
                  descriptionSize: localStyles.descriptionSize || '16px',
                  videoWidth: localStyles.videoWidth || '100%',
                  aspectRatio: localStyles.aspectRatio || '16:9',
                  borderRadius: localStyles.borderRadius || '12px',
                  boxShadow: localStyles.boxShadow || '0 8px 32px rgba(0,0,0,0.1)',
                }}
              />
            </div>
          )}

          {/* Video Settings */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {/* Aspect Ratio */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Aspect Ratio
              </label>
              <select
                value={localStyles.aspectRatio || '16:9'}
                onChange={(e) => updateStyles('aspectRatio', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="4:3">4:3 (Standard)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Video Width */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Video Width
              </label>
              <input
                type="text"
                value={localStyles.videoWidth || '100%'}
                onChange={(e) => updateStyles('videoWidth', e.target.value)}
                placeholder="100%, 800px, etc."
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {/* Video Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            {[
              { key: 'autoplay', label: 'Autoplay' },
              { key: 'muted', label: 'Muted' },
              { key: 'controls', label: 'Show Controls', defaultValue: true },
              { key: 'loop', label: 'Loop' },
            ].map((option) => (
              <label key={option.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={localContent[option.key] ?? option.defaultValue ?? false}
                  onChange={(e) => updateContent(option.key, e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Background Color Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker('background');
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#1a1a1a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(26,26,26,0.8)';
            e.currentTarget.style.color = '#ffffff';
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '8px 12px',
            backgroundColor: 'rgba(26,26,26,0.8)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '16px' }}>🎨</span>
          Background Color
        </button>
      </div>
    );
  }

  function renderContactBlock() {
    return (
      <div
        style={{
          padding: localStyles.padding || '80px 20px',
          backgroundColor: localStyles.backgroundColor || '#f8f9fa',
          position: 'relative',
        }}
      >
        {/* Background Color Picker */}
        {showColorPicker === 'background' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowColorPicker(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Background Color</h3>
              <input
                type="color"
                value={localStyles.backgroundColor || '#f8f9fa'}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  marginBottom: '20px',
                }}
              />
              <button
                onClick={() => setShowColorPicker(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        <div style={{ maxWidth: localStyles.maxWidth || '600px', margin: '0 auto', textAlign: localStyles.textAlign || 'center' }}>
          {/* Title */}
          <input
            value={localContent.title || ''}
            onChange={(e) => updateContent('title', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => {
              setEditingElement('title');
              showTextFormattingToolbar('contact-title', e);
            }}
            onBlur={() => {
              setEditingElement(null);
              hideTextFormattingToolbar();
            }}
            data-toolbar-id="contact-title"
            placeholder="Contact form title"
            style={{
              fontSize: localStyles.titleSize || '36px',
              fontWeight: 'bold',
              color: localStyles.titleColor || '#1a1a1a',
              backgroundColor: 'transparent',
              border: editingElement === 'title' ? '2px dashed #1a1a1a' : '2px dashed transparent',
              padding: '10px',
              width: '100%',
              outline: 'none',
              marginBottom: '20px',
              textAlign: localStyles.textAlign || 'center',
            }}
          />

          {/* Description */}
          <textarea
            value={localContent.description || ''}
            onChange={(e) => updateContent('description', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => {
              setEditingElement('description');
              showTextFormattingToolbar('contact-description', e);
            }}
            onBlur={() => {
              setEditingElement(null);
              hideTextFormattingToolbar();
            }}
            data-toolbar-id="contact-description"
            placeholder="Contact form description"
            rows={3}
            style={{
              fontSize: localStyles.descriptionSize || '18px',
              color: localStyles.descriptionColor || '#666666',
              backgroundColor: 'transparent',
              border: editingElement === 'description' ? '2px dashed #1a1a1a' : '2px dashed transparent',
              padding: '15px',
              width: '100%',
              outline: 'none',
              resize: 'vertical',
              marginBottom: '40px',
              textAlign: localStyles.textAlign || 'center',
              fontFamily: 'inherit',
              lineHeight: '1.6',
            }}
          />

          {/* Form Preview */}
          <ContactFormBlock
            content={{
              title: localContent.title,
              description: localContent.description,
              fields: localContent.fields || [
                { id: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter your name', required: true },
                { id: 'email', type: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true },
                { id: 'message', type: 'textarea', label: 'Message', placeholder: 'Enter your message', required: true },
              ],
              submitButtonText: localContent.submitButtonText || 'Send Message',
              successMessage: localContent.successMessage || 'Thank you for your message! We\'ll get back to you soon.',
              emailTo: localContent.emailTo || 'admin@example.com',
            }}
            styles={{
              backgroundColor: 'transparent',
              padding: '0',
              textAlign: localStyles.textAlign || 'center',
              titleColor: localStyles.titleColor || '#1a1a1a',
              titleSize: localStyles.titleSize || '36px',
              descriptionColor: localStyles.descriptionColor || '#666666',
              descriptionSize: localStyles.descriptionSize || '18px',
              formBackgroundColor: localStyles.formBackgroundColor || '#ffffff',
              fieldBackgroundColor: localStyles.fieldBackgroundColor || '#ffffff',
              fieldBorderColor: localStyles.fieldBorderColor || '#e0e0e0',
              fieldTextColor: localStyles.fieldTextColor || '#333333',
              buttonBackgroundColor: localStyles.buttonBackgroundColor || '#1a1a1a',
              buttonTextColor: localStyles.buttonTextColor || '#ffffff',
              buttonBorderRadius: localStyles.buttonBorderRadius || '8px',
              formBorderRadius: localStyles.formBorderRadius || '12px',
              formShadow: localStyles.formShadow || '0 8px 32px rgba(0,0,0,0.1)',
              maxWidth: localStyles.maxWidth || '600px',
            }}
          />
        </div>

        {/* Background Color Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker('background');
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#1a1a1a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(26,26,26,0.8)';
            e.currentTarget.style.color = '#ffffff';
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '8px 12px',
            backgroundColor: 'rgba(26,26,26,0.8)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '16px' }}>🎨</span>
          Background Color
        </button>
      </div>
    );
  }

  function renderTestimonialsBlock() {
    return (
      <div
        style={{
          padding: localStyles.padding || '80px 20px',
          backgroundColor: localStyles.backgroundColor || '#f8f9fa',
          position: 'relative',
        }}
      >
        {/* Background Color Picker */}
        {showColorPicker === 'background' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowColorPicker(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Background Color</h3>
              <input
                type="color"
                value={localStyles.backgroundColor || '#f8f9fa'}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  marginBottom: '20px',
                }}
              />
              <button
                onClick={() => setShowColorPicker(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        <div style={{ maxWidth: localStyles.maxWidth || '800px', margin: '0 auto', textAlign: localStyles.textAlign || 'center' }}>
          {/* Title */}
          <input
            value={localContent.title || ''}
            onChange={(e) => updateContent('title', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => {
              setEditingElement('title');
              showTextFormattingToolbar('testimonials-title', e);
            }}
            onBlur={() => {
              setEditingElement(null);
              hideTextFormattingToolbar();
            }}
            data-toolbar-id="testimonials-title"
            placeholder="Testimonials title"
            style={{
              fontSize: localStyles.titleSize || '36px',
              fontWeight: 'bold',
              color: localStyles.titleColor || '#1a1a1a',
              backgroundColor: 'transparent',
              border: editingElement === 'title' ? '2px dashed #1a1a1a' : '2px dashed transparent',
              padding: '10px',
              width: '100%',
              outline: 'none',
              marginBottom: '20px',
              textAlign: localStyles.textAlign || 'center',
            }}
          />

          {/* Description */}
          <textarea
            value={localContent.description || ''}
            onChange={(e) => updateContent('description', e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => {
              setEditingElement('description');
              showTextFormattingToolbar('testimonials-description', e);
            }}
            onBlur={() => {
              setEditingElement(null);
              hideTextFormattingToolbar();
            }}
            data-toolbar-id="testimonials-description"
            placeholder="Testimonials description"
            rows={3}
            style={{
              fontSize: localStyles.descriptionSize || '18px',
              color: localStyles.descriptionColor || '#666666',
              backgroundColor: 'transparent',
              border: editingElement === 'description' ? '2px dashed #1a1a1a' : '2px dashed transparent',
              padding: '15px',
              width: '100%',
              outline: 'none',
              resize: 'vertical',
              marginBottom: '40px',
              textAlign: localStyles.textAlign || 'center',
              fontFamily: 'inherit',
              lineHeight: '1.6',
            }}
          />

          {/* Testimonials Preview */}
          <TestimonialsBlock
            content={{
              title: localContent.title,
              description: localContent.description,
              testimonials: localContent.testimonials || [
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
              autoplay: localContent.autoplay || true,
              autoplaySpeed: localContent.autoplaySpeed || 5000,
              showRatings: localContent.showRatings !== false,
              showAvatars: localContent.showAvatars !== false,
            }}
            styles={{
              backgroundColor: 'transparent',
              padding: '0',
              textAlign: localStyles.textAlign || 'center',
              titleColor: localStyles.titleColor || '#1a1a1a',
              titleSize: localStyles.titleSize || '36px',
              descriptionColor: localStyles.descriptionColor || '#666666',
              descriptionSize: localStyles.descriptionSize || '18px',
              testimonialBackgroundColor: localStyles.testimonialBackgroundColor || '#ffffff',
              testimonialTextColor: localStyles.testimonialTextColor || '#333333',
              testimonialBorderRadius: localStyles.testimonialBorderRadius || '12px',
              testimonialShadow: localStyles.testimonialShadow || '0 8px 32px rgba(0,0,0,0.1)',
              nameColor: localStyles.nameColor || '#1a1a1a',
              nameSize: localStyles.nameSize || '18px',
              roleColor: localStyles.roleColor || '#666666',
              roleSize: localStyles.roleSize || '14px',
              ratingColor: localStyles.ratingColor || '#ffc107',
              maxWidth: localStyles.maxWidth || '800px',
              carouselDots: localStyles.carouselDots !== false,
              carouselArrows: localStyles.carouselArrows !== false,
            }}
          />
        </div>

        {/* Background Color Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker('background');
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#1a1a1a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(26,26,26,0.8)';
            e.currentTarget.style.color = '#ffffff';
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '8px 12px',
            backgroundColor: 'rgba(26,26,26,0.8)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '16px' }}>🎨</span>
          Background Color
        </button>
      </div>
    );
  }

  function renderSpacerBlock() {
    return (
      <div
        style={{
          position: 'relative',
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: localStyles.backgroundColor || 'transparent',
        }}
      >
        {/* Background Color Picker */}
        {showColorPicker === 'background' && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
            }}
            onClick={() => setShowColorPicker(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '30px',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>Background Color</h3>
              <input
                type="color"
                value={localStyles.backgroundColor || 'transparent'}
                onChange={(e) => updateStyles('backgroundColor', e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  border: '1px solid #e0e0e0',
                  marginBottom: '20px',
                }}
              />
              <button
                onClick={() => setShowColorPicker(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1a1a1a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Spacer Settings */}
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#666' }}>📏 Spacer Block</h3>

          {/* Height Input */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              Height
            </label>
            <input
              type="text"
              value={localContent.height || '80px'}
              onChange={(e) => updateContent('height', e.target.value)}
              placeholder="80px, 100px, 5rem, etc."
              style={{
                padding: '8px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px',
                width: '150px',
              }}
            />
          </div>

          {/* Show Divider Toggle */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', justifyContent: 'center' }}>
              <input
                type="checkbox"
                checked={localContent.showDivider || false}
                onChange={(e) => updateContent('showDivider', e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Show Divider</span>
            </label>
          </div>

          {/* Divider Type */}
          {localContent.showDivider && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                Divider Type
              </label>
              <select
                value={localContent.dividerType || 'line'}
                onChange={(e) => updateContent('dividerType', e.target.value)}
                style={{
                  padding: '8px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  width: '150px',
                }}
              >
                <option value="line">Line</option>
                <option value="dots">Dots</option>
                <option value="wave">Wave</option>
                <option value="zigzag">Zigzag</option>
              </select>
            </div>
          )}
        </div>

        {/* Spacer Preview */}
        <SpacerBlock
          content={{
            height: localContent.height || '80px',
            showDivider: localContent.showDivider || false,
            dividerType: localContent.dividerType || 'line',
            dividerWidth: localContent.dividerWidth || '100px',
            dividerThickness: localContent.dividerThickness || '2px',
          }}
          styles={{
            backgroundColor: localStyles.backgroundColor || 'transparent',
            dividerColor: localStyles.dividerColor || '#e0e0e0',
            dividerOpacity: localStyles.dividerOpacity || 1,
            mobileHeight: localStyles.mobileHeight || '30px',
            tabletHeight: localStyles.tabletHeight || '50px',
          }}
        />

        {/* Background Color Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker('background');
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';
            e.currentTarget.style.color = '#1a1a1a';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(26,26,26,0.8)';
            e.currentTarget.style.color = '#ffffff';
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '8px 12px',
            backgroundColor: 'rgba(26,26,26,0.8)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: '16px' }}>🎨</span>
          Background Color
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Text Formatting Toolbar */}
      <TextFormattingToolbar />

      {hasUnsavedChanges && (
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: '#fff3cd',
          borderBottom: '2px solid #ffc107',
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#856404' }}>
                You have unsaved changes
              </span>
              <span style={{ fontSize: '11px', color: '#856404', opacity: 0.8 }}>
                Press Ctrl+S (Cmd+S on Mac) to save
              </span>
            </div>
          </div>
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            style={{
              padding: '10px 30px',
              backgroundColor: saving ? '#6c757d' : '#28a745',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: saving ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#218838';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving) {
                e.currentTarget.style.backgroundColor = '#28a745';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'auto' }}>
        {block.block_type === 'hero' && renderHeroBlock()}
        {block.block_type === 'text' && renderTextBlock()}
        {block.block_type === 'image' && renderImageBlock()}
        {block.block_type === 'two-column' && renderTwoColumnBlock()}
        {block.block_type === 'gallery' && renderGalleryBlock()}
        {block.block_type === 'video' && renderVideoBlock()}
        {block.block_type === 'contact' && renderContactBlock()}
        {block.block_type === 'testimonials' && renderTestimonialsBlock()}
        {block.block_type === 'spacer' && renderSpacerBlock()}
        {!['hero', 'text', 'image', 'two-column', 'gallery', 'video', 'contact', 'testimonials', 'spacer'].includes(block.block_type) && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Interactive preview for {block.block_type} block coming soon...
          </div>
        )}
      </div>
    </div>
  );
}

