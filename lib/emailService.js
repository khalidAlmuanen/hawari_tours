// ═══════════════════════════════════════════════════════════════
// 📧 EMAIL SERVICE - Professional Email System
// خدمة البريد الإلكتروني - نظام احترافي
// ═══════════════════════════════════════════════════════════════

import nodemailer from 'nodemailer'

/**
 * Get Email Settings from localStorage or environment
 */
function getEmailSettings() {
  // In server-side, use environment variables
  if (typeof window === 'undefined') {
    return {
      enabled: process.env.EMAIL_ENABLED === 'true',
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      user: process.env.EMAIL_USER || '',
      password: process.env.EMAIL_PASSWORD || '',
      from: process.env.EMAIL_FROM || 'Hawari Tours <noreply@hawaritours.com>'
    }
  }
  
  // In client-side, use localStorage
  try {
    const settings = JSON.parse(localStorage.getItem('admin-settings'))
    return {
      enabled: settings?.emailEnabled || false,
      host: settings?.emailHost || 'smtp.gmail.com',
      port: settings?.emailPort || 587,
      user: settings?.emailUser || '',
      password: settings?.emailPassword || '',
      from: `Hawari Tours <${settings?.emailUser || 'noreply@hawaritours.com'}>`
    }
  } catch (err) {
    return {
      enabled: false,
      host: 'smtp.gmail.com',
      port: 587,
      user: '',
      password: '',
      from: 'Hawari Tours <noreply@hawaritours.com>'
    }
  }
}

/**
 * Create Email Transporter
 */
function createTransporter() {
  const settings = getEmailSettings()
  
  if (!settings.enabled || !settings.user || !settings.password) {
    throw new Error('Email service is not configured')
  }

  return nodemailer.createTransport({
    host: settings.host,
    port: settings.port,
    secure: settings.port === 465, // true for 465, false for other ports
    auth: {
      user: settings.user,
      pass: settings.password
    },
    tls: {
      rejectUnauthorized: false // For development
    }
  })
}

/**
 * Send Email
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    const settings = getEmailSettings()
    
    if (!settings.enabled) {
      console.log('📧 [Email] Service is disabled')
      return { success: false, error: 'Email service is disabled' }
    }

    const transporter = createTransporter()
    
    const info = await transporter.sendMail({
      from: settings.from,
      to,
      subject,
      text,
      html
    })

    console.log('✅ [Email] Sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
    
  } catch (error) {
    console.error('❌ [Email] Failed to send:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send Booking Notification
 */
export async function sendBookingNotification(booking, tour) {
  const subject = `New Booking: ${tour.title}`
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">🎉 New Booking Received!</h1>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Booking Details</h2>
        <p><strong>Tour:</strong> ${tour.title}</p>
        <p><strong>Customer:</strong> ${booking.guestName || booking.user?.name}</p>
        <p><strong>Email:</strong> ${booking.guestEmail || booking.user?.email}</p>
        <p><strong>Phone:</strong> ${booking.guestPhone || booking.user?.phone}</p>
        <p><strong>Date:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
        <p><strong>People:</strong> ${booking.numberOfPeople}</p>
        <p><strong>Total:</strong> $${booking.totalPrice}</p>
        <p><strong>Status:</strong> ${booking.status}</p>
      </div>
      
      <p style="color: #666;">
        Please check your admin panel for more details.
      </p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">
          Hawari Tours - Socotra Island Adventures
        </p>
      </div>
    </div>
  `
  
  const text = `
    New Booking Received!
    
    Tour: ${tour.title}
    Customer: ${booking.guestName || booking.user?.name}
    Email: ${booking.guestEmail || booking.user?.email}
    Phone: ${booking.guestPhone || booking.user?.phone}
    Date: ${new Date(booking.startDate).toLocaleDateString()}
    People: ${booking.numberOfPeople}
    Total: $${booking.totalPrice}
    Status: ${booking.status}
  `

  const settings = getEmailSettings()
  return await sendEmail({
    to: settings.user, // Send to admin email
    subject,
    html,
    text
  })
}

/**
 * Send Message Notification
 */
export async function sendMessageNotification(message) {
  const subject = `New Message from ${message.name}`
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">💬 New Message Received!</h1>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Message Details</h2>
        <p><strong>From:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Phone:</strong> ${message.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
          ${message.message}
        </div>
      </div>
      
      <p style="color: #666;">
        Please reply to this message from your admin panel.
      </p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">
          Hawari Tours - Socotra Island Adventures
        </p>
      </div>
    </div>
  `
  
  const text = `
    New Message Received!
    
    From: ${message.name}
    Email: ${message.email}
    Phone: ${message.phone || 'Not provided'}
    Subject: ${message.subject}
    
    Message:
    ${message.message}
  `

  const settings = getEmailSettings()
  return await sendEmail({
    to: settings.user, // Send to admin email
    subject,
    html,
    text
  })
}

/**
 * Send Review Notification
 */
export async function sendReviewNotification(review, tour) {
  const subject = `New Review: ${tour.title}`
  
  const stars = '⭐'.repeat(review.rating)
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">⭐ New Review Received!</h1>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h2 style="margin-top: 0;">Review Details</h2>
        <p><strong>Tour:</strong> ${tour.title}</p>
        <p><strong>Rating:</strong> ${stars} (${review.rating}/5)</p>
        <p><strong>From:</strong> ${review.user?.name || 'Anonymous'}</p>
        <p><strong>Comment:</strong></p>
        <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
          ${review.comment || 'No comment provided'}
        </div>
      </div>
      
      <p style="color: #666;">
        Check your admin panel to approve or manage this review.
      </p>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">
          Hawari Tours - Socotra Island Adventures
        </p>
      </div>
    </div>
  `
  
  const text = `
    New Review Received!
    
    Tour: ${tour.title}
    Rating: ${stars} (${review.rating}/5)
    From: ${review.user?.name || 'Anonymous'}
    
    Comment:
    ${review.comment || 'No comment provided'}
  `

  const settings = getEmailSettings()
  return await sendEmail({
    to: settings.user, // Send to admin email
    subject,
    html,
    text
  })
}
