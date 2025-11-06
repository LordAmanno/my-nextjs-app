import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { formData, emailTo, fields } = await request.json();

    // Basic validation
    if (!formData || !fields) {
      return NextResponse.json(
        { error: 'Missing form data or fields configuration' },
        { status: 400 }
      );
    }

    // Validate required fields
    const errors: Record<string, string> = {};
    fields.forEach((field: any) => {
      if (field.required && !formData[field.id]?.trim()) {
        errors[field.id] = `${field.label} is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Send email using a service like SendGrid, Nodemailer, etc.
    // 2. Save to database
    // 3. Send to CRM system
    
    // For now, we'll just log the form submission
    console.log('📧 Contact Form Submission:', {
      timestamp: new Date().toISOString(),
      emailTo: emailTo || 'admin@example.com',
      formData,
      fields: fields.map((f: any) => ({ id: f.id, label: f.label, type: f.type }))
    });

    // Simulate email sending (replace with actual email service)
    const emailContent = generateEmailContent(formData, fields);
    console.log('📧 Email Content:', emailContent);

    // In a real implementation, you would send the email here:
    // await sendEmail({
    //   to: emailTo || 'admin@example.com',
    //   subject: 'New Contact Form Submission',
    //   html: emailContent
    // });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Form submitted successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateEmailContent(formData: Record<string, string>, fields: any[]) {
  const fieldRows = fields.map(field => {
    const value = formData[field.id] || 'Not provided';
    return `
      <tr>
        <td style="padding: 12px; border: 1px solid #e0e0e0; background-color: #f8f9fa; font-weight: bold;">
          ${field.label}
        </td>
        <td style="padding: 12px; border: 1px solid #e0e0e0;">
          ${field.type === 'textarea' ? value.replace(/\n/g, '<br>') : value}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Contact Form Submission</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 10px;">
          📧 New Contact Form Submission
        </h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">
          You have received a new message from your website contact form.
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          ${fieldRows}
        </table>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 20px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
            <strong>IP Address:</strong> [IP would be captured here]<br>
            <strong>User Agent:</strong> [Browser info would be captured here]
          </p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
        
        <p style="font-size: 12px; color: #999; text-align: center;">
          This email was automatically generated from your website contact form.
        </p>
      </div>
    </body>
    </html>
  `;
}
