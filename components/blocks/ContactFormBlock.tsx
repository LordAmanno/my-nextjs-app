import React, { useState } from 'react';

interface ContactFormBlockProps {
  content: {
    title?: string;
    description?: string;
    fields: Array<{
      id: string;
      type: 'text' | 'email' | 'phone' | 'textarea' | 'select';
      label: string;
      placeholder?: string;
      required?: boolean;
      options?: string[]; // For select fields
    }>;
    submitButtonText?: string;
    successMessage?: string;
    emailTo?: string;
  };
  styles: {
    backgroundColor?: string;
    padding?: string;
    textAlign?: 'left' | 'center' | 'right';
    titleColor?: string;
    titleSize?: string;
    descriptionColor?: string;
    descriptionSize?: string;
    formBackgroundColor?: string;
    fieldBackgroundColor?: string;
    fieldBorderColor?: string;
    fieldTextColor?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonBorderRadius?: string;
    formBorderRadius?: string;
    formShadow?: string;
    maxWidth?: string;
  };
}

export default function ContactFormBlock({ content, styles }: ContactFormBlockProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const defaultStyles = {
    backgroundColor: styles.backgroundColor || '#f8f9fa',
    padding: styles.padding || '80px 20px',
    textAlign: styles.textAlign || 'center',
    titleColor: styles.titleColor || '#1a1a1a',
    titleSize: styles.titleSize || '36px',
    descriptionColor: styles.descriptionColor || '#666666',
    descriptionSize: styles.descriptionSize || '18px',
    formBackgroundColor: styles.formBackgroundColor || '#ffffff',
    fieldBackgroundColor: styles.fieldBackgroundColor || '#ffffff',
    fieldBorderColor: styles.fieldBorderColor || '#e0e0e0',
    fieldTextColor: styles.fieldTextColor || '#333333',
    buttonBackgroundColor: styles.buttonBackgroundColor || '#1a1a1a',
    buttonTextColor: styles.buttonTextColor || '#ffffff',
    buttonBorderRadius: styles.buttonBorderRadius || '8px',
    formBorderRadius: styles.formBorderRadius || '12px',
    formShadow: styles.formShadow || '0 8px 32px rgba(0,0,0,0.1)',
    maxWidth: styles.maxWidth || '600px',
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    content.fields.forEach(field => {
      if (field.required && !formData[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      } else if (field.type === 'email' && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = 'Please enter a valid email address';
        }
      } else if (field.type === 'phone' && formData[field.id]) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(formData[field.id].replace(/[\s\-\(\)]/g, ''))) {
          newErrors[field.id] = 'Please enter a valid phone number';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData,
          emailTo: content.emailTo,
          fields: content.fields,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({});
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: any) => {
    const fieldStyle = {
      width: '100%',
      padding: '15px',
      backgroundColor: defaultStyles.fieldBackgroundColor,
      border: `2px solid ${errors[field.id] ? '#dc3545' : defaultStyles.fieldBorderColor}`,
      borderRadius: '8px',
      fontSize: '16px',
      color: defaultStyles.fieldTextColor,
      outline: 'none',
      transition: 'border-color 0.3s ease',
    };

    const focusStyle = {
      borderColor: '#007bff',
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={5}
            style={fieldStyle}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = errors[field.id] ? '#dc3545' : defaultStyles.fieldBorderColor}
          />
        );
      
      case 'select':
        return (
          <select
            key={field.id}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            style={fieldStyle}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = errors[field.id] ? '#dc3545' : defaultStyles.fieldBorderColor}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            key={field.id}
            type={field.type}
            value={formData[field.id] || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            style={fieldStyle}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = errors[field.id] ? '#dc3545' : defaultStyles.fieldBorderColor}
          />
        );
    }
  };

  if (isSubmitted) {
    return (
      <div
        style={{
          backgroundColor: defaultStyles.backgroundColor,
          padding: defaultStyles.padding,
          textAlign: defaultStyles.textAlign as any,
        }}
      >
        <div style={{ maxWidth: defaultStyles.maxWidth, margin: '0 auto' }}>
          <div
            style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '30px',
              borderRadius: defaultStyles.formBorderRadius,
              border: '2px solid #c3e6cb',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '24px', marginBottom: '15px', fontWeight: 'bold' }}>
              ✅ Thank You!
            </h3>
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
              {content.successMessage || 'Your message has been sent successfully. We\'ll get back to you soon!'}
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: defaultStyles.backgroundColor,
        padding: defaultStyles.padding,
        textAlign: defaultStyles.textAlign as any,
      }}
    >
      <div style={{ maxWidth: defaultStyles.maxWidth, margin: '0 auto' }}>
        {/* Title */}
        {content.title && (
          <h2
            style={{
              fontSize: defaultStyles.titleSize,
              color: defaultStyles.titleColor,
              marginBottom: '20px',
              fontWeight: 'bold',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
            }}
          >
            {content.title}
          </h2>
        )}

        {/* Description */}
        {content.description && (
          <p
            style={{
              fontSize: defaultStyles.descriptionSize,
              color: defaultStyles.descriptionColor,
              marginBottom: '40px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
            }}
          >
            {content.description}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: defaultStyles.formBackgroundColor,
            padding: '40px',
            borderRadius: defaultStyles.formBorderRadius,
            boxShadow: defaultStyles.formShadow,
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {content.fields.map(field => (
              <div key={field.id}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: defaultStyles.fieldTextColor,
                    marginBottom: '8px',
                  }}
                >
                  {field.label}
                  {field.required && <span style={{ color: '#dc3545' }}> *</span>}
                </label>
                {renderField(field)}
                {errors[field.id] && (
                  <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                    {errors[field.id]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: isSubmitting ? '#6c757d' : defaultStyles.buttonBackgroundColor,
              color: defaultStyles.buttonTextColor,
              border: 'none',
              borderRadius: defaultStyles.buttonBorderRadius,
              fontSize: '18px',
              fontWeight: '600',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginTop: '30px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {isSubmitting ? 'Sending...' : (content.submitButtonText || 'Send Message')}
          </button>
        </form>
      </div>
    </div>
  );
}
