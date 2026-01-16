'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        appName: 'OmniPDF',
        tagline: 'All-in-One PDF Converter & Editor',
        description: 'Convert, merge, split, compress, and edit PDFs with AI-powered features. Free, fast, and secure.',
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        download: 'Download',
        upload: 'Upload',
        search: 'Search',
        settings: 'Settings',
        help: 'Help',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
        submit: 'Submit',
        skip: 'Skip',
        done: 'Done',
        clear: 'Clear',
        retry: 'Retry',
        showMore: 'Show more',
        showLess: 'Show less',
        required: 'Required',
        optional: 'Optional',
      },
      nav: {
        home: 'Home',
        tools: 'All Tools',
        convert: 'Convert',
        pricing: 'Pricing',
        dashboard: 'Dashboard',
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
      },
      hero: {
        title: 'All-in-One PDF',
        subtitle: 'Converter & Editor',
        ctaPrimary: 'Convert PDF Now',
        ctaSecondary: 'View Pricing',
        stats: {
          fast: 'Lightning Fast',
          secure: 'Secure Encryption',
          languages: '50+ Languages',
          formats: '25+ Formats',
        },
      },
      pricing: {
        title: 'Simple, Transparent Pricing',
        subtitle: 'Choose the plan that fits your needs',
        monthly: 'Monthly',
        annual: 'Annual',
        savePercent: 'Save 17%',
        free: {
          name: 'Free',
          description: 'For personal use',
          price: '$0',
          period: '/month',
          features: [
            '25 conversions/month',
            '25MB file size limit',
            '1GB cloud storage',
            'Basic PDF tools',
            'Google & GitHub login',
            'Community support',
          ],
        },
        pro: {
          name: 'Pro',
          description: 'For power users',
          price: '$7.99',
          period: '/month',
          features: [
            'Unlimited conversions',
            '500MB file size limit',
            '50GB cloud storage',
            'All PDF tools',
            'All cloud services',
            'AI Assistant',
            'No ads',
            'Priority support',
          ],
        },
        enterprise: {
          name: 'Enterprise',
          description: 'For teams',
          price: '$24.99',
          period: '/month',
          features: [
            'Everything in Pro',
            '2GB file size limit',
            '1TB cloud storage',
            'Unlimited AI credits',
            'Team management',
            'SSO/SAML',
            'API access',
            'Dedicated support',
          ],
        },
        cta: {
          free: 'Get Started Free',
          pro: 'Start Free Trial',
          enterprise: 'Contact Sales',
        },
        popular: 'Most Popular',
      },
      tools: {
        title: 'All PDF Tools',
        subtitle: 'Powerful tools to work with your documents',
        viewAll: 'View All 25+ Tools',
        merge: {
          name: 'Merge PDF',
          description: 'Combine multiple PDFs into one document',
        },
        split: {
          name: 'Split PDF',
          description: 'Extract pages or split into separate files',
        },
        compress: {
          name: 'Compress PDF',
          description: 'Reduce file size while maintaining quality',
        },
        convert: {
          name: 'Convert PDF',
          description: 'Convert to and from any format',
        },
        unlock: {
          name: 'Unlock PDF',
          description: 'Remove password protection',
        },
        protect: {
          name: 'Protect PDF',
          description: 'Add password protection',
        },
        edit: {
          name: 'Edit PDF',
          description: 'Add text, images, and annotations',
        },
        ocr: {
          name: 'OCR',
          description: 'Extract text from scanned documents',
        },
        aiSummary: {
          name: 'AI Summary',
          description: 'Summarize documents with AI',
        },
        pdfToJpg: {
          name: 'PDF to JPG',
          description: 'Extract images from PDF pages',
        },
      },
      features: {
        title: 'Why Choose OmniPDF?',
        subtitle: 'Built with modern technology for the best experience',
        fast: {
          title: 'Lightning Fast',
          description: 'Process files in seconds with our edge computing infrastructure.',
        },
        secure: {
          title: 'Military-Grade Security',
          description: 'AES-256 encryption, automatic file deletion, and zero-knowledge architecture.',
        },
        languages: {
          title: '50+ Languages',
          description: 'AI-powered translation for documents in over 50 languages.',
        },
        cloud: {
          title: 'Cloud Storage',
          description: 'Integrate with Google Drive, Dropbox, OneDrive, and Box.',
        },
        ai: {
          title: 'AI-Powered',
          description: 'Summarize, translate, and chat with your documents using Gemini AI.',
        },
        collaboration: {
          title: 'Real Collaboration',
          description: 'Work together on documents in real-time.',
        },
        mobile: {
          title: 'Mobile Friendly',
          description: 'Works perfectly on all devices.',
        },
        desktop: {
          title: 'Desktop Apps',
          description: 'Native apps for Windows, macOS, and Linux.',
        },
      },
      auth: {
        signIn: {
          title: 'Welcome back',
          subtitle: 'Sign in to your account',
          email: 'Email address',
          password: 'Password',
          rememberMe: 'Remember me',
          forgotPassword: 'Forgot password?',
          cta: 'Sign in',
          noAccount: "Don't have an account?",
          signUp: 'Sign up for free',
        },
        signUp: {
          title: 'Create your account',
          subtitle: 'Get started with OmniPDF for free',
          name: 'Full name',
          email: 'Email address',
          password: 'Password',
          confirmPassword: 'Confirm password',
          terms: 'I agree to the Terms of Service and Privacy Policy',
          cta: 'Create account',
          hasAccount: 'Already have an account?',
          signIn: 'Sign in',
        },
        verifyEmail: {
          title: 'Verify your email',
          subtitle: "We've sent you a verification email",
          instruction: 'Please check your email and click the verification link.',
          notReceived: "Didn't receive the email?",
          resend: 'Resend email',
          wrongEmail: 'Wrong email address?',
        },
      },
      convert: {
        title: 'Convert PDF',
        upload: {
          title: 'Upload Files',
          subtitle: 'Drag & drop your files here',
          browse: 'or click to browse',
          formats: 'Supports PDF, DOCX, XLSX, PPTX, and more',
          limits: 'Max file size: {{size}} • Max {{count}} files',
        },
        configure: {
          title: 'Configure conversion',
          subtitle: 'Selected {{count}} file(s)',
          outputFormat: 'Output format',
        },
        converting: {
          title: 'Converting your files...',
          subtitle: 'This may take a few moments',
        },
        complete: {
          title: 'Conversion complete!',
          subtitle: 'Your {{count}} file(s) is ready',
          download: 'Download',
          downloadAll: 'Download All as ZIP',
          convertMore: 'Convert More Files',
        },
      },
      dashboard: {
        title: 'Dashboard',
        welcome: 'Welcome back',
        newConversion: 'New Conversion',
        stats: {
          conversions: 'Conversions This Month',
          storage: 'Storage Used',
          aiCredits: 'AI Credits Used',
          memberSince: 'Member Since',
        },
        recentDocuments: 'Recent Documents',
        upgrade: 'Upgrade to Pro',
        noDocuments: {
          title: 'No documents yet',
          cta: 'Upload Your First Document',
        },
      },
      footer: {
        company: 'Company',
        product: 'Product',
        resources: 'Resources',
        legal: 'Legal',
        copyright: '© {{year}} OmniPDF. All rights reserved.',
        madeWith: 'Made with love worldwide',
      },
      accessibility: {
        skipToMain: 'Skip to main content',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        openSettings: 'Open settings',
        toggleTheme: 'Toggle theme',
        languageSelect: 'Select language',
        fileUpload: 'File upload area',
        selectFiles: 'Select files',
        removeFile: 'Remove file',
      },
      errors: {
        uploadFailed: 'Upload failed. Please try again.',
        conversionFailed: 'Conversion failed. Please try again.',
        authRequired: 'Please sign in to continue.',
        rateLimit: 'Too many requests. Please wait a moment.',
        fileTooLarge: 'File size exceeds the limit.',
        invalidFile: 'Invalid file type.',
        networkError: 'Network error. Please check your connection.',
      },
    },
  },
  es: {
    translation: {
      common: {
        appName: 'OmniPDF',
        tagline: 'Convertidor y Editor de PDF Todo en Uno',
        description: 'Convierte, fusiona, divide, comprime y edita PDFs con funciones impulsadas por IA. Gratis, rápido y seguro.',
        loading: 'Cargando...',
        error: 'Ocurrió un error',
        success: 'Éxito',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        download: 'Descargar',
        upload: 'Subir',
        search: 'Buscar',
        settings: 'Configuración',
        help: 'Ayuda',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        close: 'Cerrar',
        submit: 'Enviar',
        skip: 'Omitir',
        done: 'Hecho',
        clear: 'Limpiar',
        retry: 'Reintentar',
        required: 'Obligatorio',
        optional: 'Opcional',
      },
      nav: {
        home: 'Inicio',
        tools: 'Herramientas',
        convert: 'Convertir',
        pricing: 'Precios',
        dashboard: 'Panel',
        signIn: 'Iniciar Sesión',
        signUp: 'Registrarse',
        signOut: 'Cerrar Sesión',
      },
      hero: {
        title: 'PDF Todo en Uno',
        subtitle: 'Convertidor y Editor',
        ctaPrimary: 'Convertir PDF Ahora',
        ctaSecondary: 'Ver Precios',
        stats: {
          fast: 'Ultrarrápido',
          secure: 'Cifrado Seguro',
          languages: '50+ Idiomas',
          formats: '25+ Formatos',
        },
      },
      pricing: {
        title: 'Precios Simples y Transparentes',
        monthly: 'Mensual',
        annual: 'Anual',
        savePercent: 'Ahorra 17%',
        free: {
          name: 'Gratis',
          description: 'Para uso personal',
          price: '$0',
          period: '/mes',
        },
        pro: {
          name: 'Pro',
          description: 'Para usuarios avanzados',
          price: '$7.99',
          period: '/mes',
        },
        enterprise: {
          name: 'Empresa',
          description: 'Para equipos',
          price: '$24.99',
          period: '/mes',
        },
      },
      auth: {
        signIn: {
          title: 'Bienvenido de nuevo',
          subtitle: 'Inicia sesión en tu cuenta',
          email: 'Correo electrónico',
          password: 'Contraseña',
          cta: 'Iniciar sesión',
        },
        signUp: {
          title: 'Crea tu cuenta',
          subtitle: 'Comienza con OmniPDF gratis',
          name: 'Nombre completo',
          email: 'Correo electrónico',
          password: 'Contraseña',
          cta: 'Crear cuenta',
        },
      },
      footer: {
        copyright: '© {{year}} OmniPDF. Todos los derechos reservados.',
      },
    },
  },
  fr: {
    translation: {
      common: {
        appName: 'OmniPDF',
        tagline: 'Convertisseur et Éditeur PDF Tout-en-Un',
        description: 'Convertissez, fusionnez, divisez, compressez et modifiez des PDF avec des fonctionnalités IA. Gratuit, rapide et sécurisé.',
        loading: 'Chargement...',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        save: 'Enregistrer',
        download: 'Télécharger',
        upload: 'Télécharger',
      },
      nav: {
        home: 'Accueil',
        pricing: 'Tarifs',
        signIn: 'Connexion',
        signUp: 'Inscription',
      },
      hero: {
        title: 'PDF Tout-en-Un',
        subtitle: 'Convertisseur et Éditeur',
        ctaPrimary: 'Convertir PDF',
      },
      pricing: {
        title: 'Tarification Simple et Transparente',
        monthly: 'Mensuel',
        annual: 'Annuel',
        free: {
          name: 'Gratuit',
          description: 'Pour usage personnel',
          price: '$0',
        },
        pro: {
          name: 'Pro',
          price: '$7.99',
        },
        enterprise: {
          name: 'Entreprise',
          price: '$24.99',
        },
      },
      footer: {
        copyright: '© {{year}} OmniPDF. Tous droits réservés.',
      },
    },
  },
  de: {
    translation: {
      common: {
        appName: 'OmniPDF',
        loading: 'Laden...',
        cancel: 'Abbrechen',
        confirm: 'Bestätigen',
        save: 'Speichern',
        download: 'Herunterladen',
        upload: 'Hochladen',
      },
      nav: {
        home: 'Startseite',
        pricing: 'Preise',
        signIn: 'Anmelden',
        signUp: 'Registrieren',
      },
      hero: {
        title: 'PDF Alles-in-Einem',
        subtitle: 'Konverter & Editor',
      },
      pricing: {
        title: 'Einfache, transparente Preise',
        free: { name: 'Kostenlos', price: '$0' },
        pro: { name: 'Pro', price: '$7.99' },
        enterprise: { name: 'Unternehmen', price: '$24.99' },
      },
      footer: {
        copyright: '© {{year}} OmniPDF. Alle Rechte vorbehalten.',
      },
    },
  },
  zh: {
    translation: {
      common: {
        appName: 'OmniPDF',
        loading: '加载中...',
        cancel: '取消',
        confirm: '确认',
        save: '保存',
        download: '下载',
        upload: '上传',
      },
      nav: {
        home: '首页',
        pricing: '价格',
        signIn: '登录',
        signUp: '注册',
      },
      hero: {
        title: '一体化 PDF',
        subtitle: '转换器和编辑器',
      },
      pricing: {
        title: '简单透明的定价',
        free: { name: '免费', price: '$0' },
        pro: { name: '专业版', price: '$7.99' },
        enterprise: { name: '企业版', price: '$24.99' },
      },
      footer: {
        copyright: '© {{year}} OmniPDF. 版权所有。',
      },
    },
  },
  ja: {
    translation: {
      common: {
        appName: 'OmniPDF',
        loading: '読み込み中...',
        cancel: 'キャンセル',
        confirm: '確認',
        save: '保存',
        download: 'ダウンロード',
        upload: 'アップロード',
      },
      nav: {
        home: 'ホーム',
        pricing: '料金',
        signIn: 'サインイン',
        signUp: 'サインアップ',
      },
      hero: {
        title: 'オールインワン PDF',
        subtitle: 'コンバーター & エディター',
      },
      pricing: {
        title: 'シンプルで透明な料金体系',
        free: { name: '無料', price: '$0' },
        pro: { name: 'プロ', price: '$7.99' },
        enterprise: { name: 'エンタープライズ', price: '$24.99' },
      },
      footer: {
        copyright: '© {{year}} OmniPDF. 無断複写・転載を禁じます。',
      },
    },
  },
  pt: {
    translation: {
      common: {
        appName: 'OmniPDF',
        loading: 'Carregando...',
        cancel: 'Cancelar',
        confirm: 'Confirmar',
        save: 'Salvar',
        download: 'Baixar',
        upload: 'Enviar',
      },
      nav: {
        home: 'Início',
        pricing: 'Preços',
        signIn: 'Entrar',
        signUp: 'Cadastrar',
      },
      hero: {
        title: 'PDF Tudo-em-Um',
        subtitle: 'Conversor & Editor',
      },
      pricing: {
        title: 'Preços Simples e Transparentes',
        free: { name: 'Gratuito', price: '$0' },
        pro: { name: 'Pro', price: '$7.99' },
        enterprise: { name: 'Empresarial', price: '$24.99' },
      },
      footer: {
        copyright: '© {{year}} OmniPDF. Todos os direitos reservados.',
      },
    },
  },
  ru: {
    translation: {
      common: {
        appName: 'OmniPDF',
        loading: 'Загрузка...',
        cancel: 'Отмена',
        confirm: 'Подтвердить',
        save: 'Сохранить',
        download: 'Скачать',
        upload: 'Загрузить',
      },
      nav: {
        home: 'Главная',
        pricing: 'Цены',
        signIn: 'Войти',
        signUp: 'Регистрация',
      },
      hero: {
        title: 'PDF Все-в-Одном',
        subtitle: 'Конвертер и Редактор',
      },
      pricing: {
        title: 'Простые и прозрачные цены',
        free: { name: 'Бесплатно', price: '$0' },
        pro: { name: 'Про', price: '$7.99' },
        enterprise: { name: 'Корпоративный', price: '$24.99' },
      },
      footer: {
        copyright: '© {{year}} OmniPDF. Все права защищены.',
      },
    },
  },
  ar: {
    translation: {
      common: {
        appName: 'OmniPDF',
        loading: 'جاري التحميل...',
        cancel: 'إلغاء',
        confirm: 'تأكيد',
        save: 'حفظ',
        download: 'تحميل',
        upload: 'رفع',
      },
      nav: {
        home: 'الرئيسية',
        pricing: 'الأسعار',
        signIn: 'تسجيل الدخول',
        signUp: 'التسجيل',
      },
      hero: {
        title: 'PDF الكل في واحد',
        subtitle: 'محول ومحرر',
      },
      pricing: {
        title: 'أسعار بسيطة وشفافة',
        free: { name: 'مجاني', price: '$0' },
        pro: { name: 'احترافي', price: '$7.99' },
        enterprise: { name: 'المؤسسات', price: '$24.99' },
      },
      footer: {
        copyright: '© {{year}} OmniPDF. جميع الحقوق محفوظة.',
      },
    },
  },
  ko: {
    translation: {
      common: {
        appName: 'OmniPDF',
        loading: '로딩 중...',
        cancel: '취소',
        confirm: '확인',
        save: '저장',
        download: '다운로드',
        upload: '업로드',
      },
      nav: {
        home: '홈',
        pricing: '가격',
        signIn: '로그인',
        signUp: '가입하기',
      },
      hero: {
        title: '올인원 PDF',
        subtitle: '변환기 및 편집기',
      },
      pricing: {
        title: '단순하고 투명한 가격',
        free: { name: '무료', price: '$0' },
        pro: { name: '프로', price: '$7.99' },
        enterprise: { name: '엔터프라이즈', price: '$24.99' },
      },
      footer: {
        copyright: '© {{year}} OmniPDF. 모든 권리 보유.',
      },
    },
  },
  hi: {
    translation: {
      common: {
        appName: 'OmniPDF',
        loading: 'लोड हो रहा है...',
        cancel: 'रद्द करें',
        confirm: 'पुष्टि करें',
        save: 'सहेजें',
        download: 'डाउनलोड',
        upload: 'अपलोड',
      },
      nav: {
        home: 'होम',
        pricing: 'मूल्य निर्धारण',
        signIn: 'साइन इन',
        signUp: 'साइन अप',
      },
      hero: {
        title: 'ऑल-इन-वन PDF',
        subtitle: 'कनवर्टर और एडिटर',
      },
      pricing: {
        title: 'सरल, पारदर्शी मूल्य निर्धारण',
        free: { name: 'मुफ्त', price: '$0' },
        pro: { name: 'प्रो', price: '$7.99' },
        enterprise: { name: 'एंटरप्राइज', price: '$24.99' },
      },
      footer: {
        copyright: '© {{year}} OmniPDF. सर्वाधिकार सुरक्षित।',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
