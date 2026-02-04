/**
 * معلومات الشركة الصحيحة - Hawari Tours
 * Company Information Configuration
 * 
 * ⚠️ هام: استبدل المعلومات المؤقتة بالمعلومات الفعلية للشركة
 */

export const companyInfo = {
  // معلومات أساسية
  name: {
    ar: 'حواري للسياحة والسفر',
    en: 'Hawari Tours & Travel'
  },
  
  slogan: {
    ar: 'بوابتك لاكتشاف جزيرة سقطرى',
    en: 'Your Gateway to Discover Socotra Island'
  },
  
  // معلومات التواصل
  contact: {
    // العنوان الصحيح
    address: {
      ar: 'حديبو، جزيرة سقطرى، الجمهورية اليمنية',
      en: 'Hadibo, Socotra Island, Republic of Yemen'
    },
    
    // أرقام الهواتف
    phones: [
      {
        number: '+967 772 371 581',
        label: {
          ar: 'واتساب / اتصال',
          en: 'WhatsApp / Call'
        },
        primary: true,
        whatsapp: true
      },
      {
        number: '+967 777 XXX XXX', // استبدل بالرقم الثاني
        label: {
          ar: 'هاتف المكتب',
          en: 'Office Phone'
        },
        primary: false,
        whatsapp: false
      }
    ],
    
    // البريد الإلكتروني
    emails: [
      {
        address: 'info@hawari.tours',
        label: {
          ar: 'الاستفسارات العامة',
          en: 'General Inquiries'
        },
        primary: true
      },
      {
        address: 'bookings@hawari.tours',
        label: {
          ar: 'الحجوزات',
          en: 'Bookings'
        },
        primary: false
      }
    ],
    
    // ساعات العمل
    workingHours: {
      ar: {
        weekdays: 'السبت - الخميس: 8:00 صباحاً - 8:00 مساءً',
        friday: 'الجمعة: مغلق',
        notes: 'نستجيب للرسائل على مدار الساعة عبر واتساب'
      },
      en: {
        weekdays: 'Saturday - Thursday: 8:00 AM - 8:00 PM',
        friday: 'Friday: Closed',
        notes: 'We respond to WhatsApp messages 24/7'
      }
    }
  },
  
  // وسائل التواصل الاجتماعي
  social: {
    facebook: 'https://facebook.com/hawaritours',
    instagram: 'https://instagram.com/hawari.tours',
    youtube: 'https://youtube.com/@hawaritours',
    twitter: 'https://twitter.com/hawaritours',
    tiktok: 'https://tiktok.com/@hawaritours',
    tripadvisor: 'https://tripadvisor.com/hawaritours' // أضف الرابط الفعلي
  },
  
  // معلومات إضافية
  about: {
    established: '2015', // سنة التأسيس
    yearsOfExperience: 10,
    toursCompleted: '1000+',
    happyClients: '5000+',
    teamSize: 15,
    
    description: {
      ar: 'حواري للسياحة والسفر هي وكالة سياحية محلية متخصصة في تنظيم رحلات استكشافية إلى جزيرة سقطرى. مع أكثر من 10 سنوات من الخبرة، نقدم تجارب سياحية أصيلة وآمنة تجمع بين المغامرة والراحة.',
      en: 'Hawari Tours & Travel is a local tour operator specializing in organizing exploratory trips to Socotra Island. With over 10 years of experience, we provide authentic and safe tourism experiences that combine adventure and comfort.'
    }
  },
  
  // الترخيص والشهادات
  licenses: {
    tourismLicense: 'YE-TOUR-2015-XXX', // رقم الترخيص السياحي
    registrationNumber: 'XXX-XXXX-XXXX', // رقم السجل التجاري
    certifications: [
      {
        name: 'عضو جمعية وكلاء السفر اليمنية',
        year: '2016'
      }
    ]
  }
};

// دالة مساعدة للحصول على رقم واتساب الأساسي
export function getPrimaryWhatsApp() {
  const primaryPhone = companyInfo.contact.phones.find(p => p.primary && p.whatsapp);
  return primaryPhone ? primaryPhone.number.replace(/\s/g, '') : '';
}

// دالة للحصول على الإيميل الأساسي
export function getPrimaryEmail() {
  const primaryEmail = companyInfo.contact.emails.find(e => e.primary);
  return primaryEmail ? primaryEmail.address : '';
}