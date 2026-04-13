import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * API Route لمعالجة نموذج التواصل
 * Contact Form API Handler
 */

export async function POST(request) {
  try {
    // استخراج البيانات من الطلب
    const body = await request.json();
    const { name, email, phone, tourInterest, numberOfPeople, preferredDate, message, language } = body;
    
    // التحقق من البيانات المطلوبة
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      );
    }
    
    // إعداد Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // أو أي خدمة بريد أخرى
      auth: {
        user: process.env.EMAIL_USER, // إيميل المرسل
        pass: process.env.EMAIL_PASS  // كلمة مرور التطبيق
      }
    });
    
    // محتوى الإيميل
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info@hawari.tours', // الإيميل المستقبل
      subject: `استفسار جديد من ${name} - Hawari Tours`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00A86B 0%, #0066CC 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; }
            .field { margin-bottom: 20px; padding: 15px; background: white; border-right: 4px solid #00A86B; }
            .label { font-weight: bold; color: #00A86B; margin-bottom: 5px; }
            .value { color: #333; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 استفسار جديد!</h1>
              <p>تلقيت طلب جديد من موقع Hawari Tours</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">👤 الاسم:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <div class="label">📧 البريد الإلكتروني:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="field">
                <div class="label">📱 رقم الهاتف/واتساب:</div>
                <div class="value">
                  <a href="tel:${phone}">${phone}</a> | 
                  <a href="https://wa.me/${phone.replace(/\D/g, '')}" target="_blank">فتح واتساب</a>
                </div>
              </div>
              
              ${tourInterest ? `
              <div class="field">
                <div class="label">🎒 الرحلة المهتم بها:</div>
                <div class="value">${tourInterest}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">👥 عدد الأشخاص:</div>
                <div class="value">${numberOfPeople}</div>
              </div>
              
              ${preferredDate ? `
              <div class="field">
                <div class="label">📅 التاريخ المفضل:</div>
                <div class="value">${new Date(preferredDate).toLocaleDateString('ar-SA')}</div>
              </div>
              ` : ''}
              
              <div class="field">
                <div class="label">💬 الرسالة:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="field">
                <div class="label">🕐 وقت الإرسال:</div>
                <div class="value">${new Date().toLocaleString('ar-SA')}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>هذه الرسالة تم إرسالها تلقائياً من موقع Hawari Tours</p>
              <p>www.hawari.tours</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    // إرسال الإيميل
    await transporter.sendMail(mailOptions);
    
    // الرد بنجاح
    return NextResponse.json(
      { 
        success: true, 
        message: 'تم إرسال رسالتك بنجاح' 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إرسال الرسالة' },
      { status: 500 }
    );
  }
}
