// ═══════════════════════════════════════════════════════════════════════
// 📄 ملف: app/api/send-email/route.js
// الوصف: API لإرسال الإيميلات - استخدام Resend (مجاني وسهل)
// ═══════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, phone, message, tourTitle, tourPrice } = body
    
    // التحقق من البيانات
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { success: false, message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      )
    }
    
    // ═══════════════════════════════════════════════════════════════
    // الطريقة 1: استخدام Resend (موصى بها)
    // ═══════════════════════════════════════════════════════════════
    
    // تحتاج لتثبيت: npm install resend
    // وإضافة RESEND_API_KEY في .env.local
    
    // يمكن استبدال هذا بـ EmailJS أو أي خدمة أخرى
    
    // للتطوير: نرسل إلى console
    console.log('📧 رسالة جديدة:', {
      name,
      email,
      phone,
      message,
      tourTitle,
      tourPrice
    })
    
    // ═══════════════════════════════════════════════════════════════
    // استخدام Resend (بعد إعداد API Key)
    // ═══════════════════════════════════════════════════════════════
    /*
    const { Resend } = require('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'Hawari Tours <noreply@hawari.tours>',
      to: 'info@hawari.tours', // الإيميل الذي سيستقبل الرسائل
      replyTo: email,
      subject: `استفسار جديد من ${name} - ${tourTitle || 'رحلة سياحية'}`,
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-right: 4px solid #10b981; }
            .label { font-weight: bold; color: #059669; }
            .value { margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📧 استفسار جديد من موقع Hawari Tours</h1>
            </div>
            <div class="content">
              ${tourTitle ? `
                <div class="info-box" style="background: #dcfce7; border-color: #10b981;">
                  <div class="label">الرحلة المختارة:</div>
                  <div class="value" style="font-size: 18px; font-weight: bold;">${tourTitle}</div>
                  ${tourPrice ? `<div class="value" style="color: #059669; font-size: 20px; font-weight: bold; margin-top: 5px;">السعر: $${tourPrice}</div>` : ''}
                </div>
              ` : ''}
              
              <div class="info-box">
                <div class="label">الاسم:</div>
                <div class="value">${name}</div>
              </div>
              
              <div class="info-box">
                <div class="label">البريد الإلكتروني:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="info-box">
                <div class="label">رقم الهاتف:</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              
              <div class="info-box">
                <div class="label">الرسالة:</div>
                <div class="value" style="white-space: pre-wrap;">${message}</div>
              </div>
              
              <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #6b7280;">للرد على العميل:</p>
                <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">رد عبر الإيميل</a>
                <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background: #25d366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">رد عبر واتساب</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    })
    */
    
    // ═══════════════════════════════════════════════════════════════
    // للتطوير: نرجع success مباشرة
    // في الإنتاج: استبدل هذا بالكود الحقيقي أعلاه
    // ═══════════════════════════════════════════════════════════════
    
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return NextResponse.json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.'
    })
    
  } catch (error) {
    console.error('❌ خطأ في إرسال الإيميل:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في الإرسال. حاول مرة أخرى لاحقاً.' 
      },
      { status: 500 }
    )
  }
}