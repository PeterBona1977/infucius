"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type LanguageContextType = {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
  translations: Record<string, any>
}

const defaultLanguage = "en"

// Create a default translation function that just returns the key
const defaultTranslate = (key: string) => key

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: defaultTranslate,
  translations: {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState(defaultLanguage)
  const [translations, setTranslations] = useState<Record<string, any>>({})
  const [isInitialized, setIsInitialized] = useState(false)

  // Load translations
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return

    try {
      const savedLanguage = localStorage.getItem("language") || defaultLanguage
      setLanguageState(savedLanguage)

      // Use hardcoded translations
      const translationsData = getHardcodedTranslations(savedLanguage)
      setTranslations(translationsData)
      setIsInitialized(true)
    } catch (error) {
      console.error("Error in language initialization:", error)
      // Set default translations as fallback
      setTranslations(getHardcodedTranslations(defaultLanguage))
      setIsInitialized(true)
    }
  }, [])

  // Update translations when language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("language", language)

        // Use hardcoded translations
        const translationsData = getHardcodedTranslations(language)
        setTranslations(translationsData)
      } catch (error) {
        console.error("Failed to update translations:", error)
      }
    }
  }, [language])

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
  }

  // Translation function that returns the original key if translation is not found
  const t = (key: string): string => {
    if (!key) return ""

    const keyParts = key.split(".")
    let current: any = translations

    for (const part of keyParts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part]
      } else {
        // Return the last part of the key as fallback
        return keyParts[keyParts.length - 1]
      }
    }

    return current || keyParts[keyParts.length - 1]
  }

  // Use a safe version of the translation function that handles errors
  const safeT = (key: string): string => {
    try {
      return t(key)
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error)
      return key.split(".").pop() || key
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: safeT,
        translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

// Hardcoded translations to avoid file loading issues
function getHardcodedTranslations(language: string) {
  const translations: Record<string, Record<string, any>> = {
    en: {
      common: {
        home: "Home",
        scanQR: "Scan QR",
        shop: "Shop",
        myMessages: "My Messages",
        adminDashboard: "Admin Dashboard",
        login: "Login",
        register: "Register",
        logout: "Logout",
        myAccount: "My Account",
        profile: "Profile",
        messageHistory: "Message History",
        orders: "Orders",
        language: "Language",
      },
      hero: {
        title: "Discover Your Personalized Message",
        subtitle: "Scan, sip, and discover messages uniquely crafted for you.",
      },
      shop: {
        title: "Shop Our Tea Collection",
      },
      cart: {
        title: "Your Shopping Cart",
        items: "Cart Items",
        itemsDescription: "Items you've added to your cart",
        empty: "Your cart is empty",
        emptyDescription: "Add some tea products to your cart to see them here.",
        browseShop: "Browse Shop",
        orderSummary: "Order Summary",
        subtotal: "Subtotal",
        shipping: "Shipping",
        tax: "Tax",
        total: "Total",
        checkout: "Checkout",
        promoCode: "Have a Promo Code?",
        enterPromoCode: "Enter promo code",
        apply: "Apply",
      },
      footer: {
        tagline: "Discover personalized tea-inspired messages with every scan.",
        terms: "Terms",
        privacy: "Privacy",
        contact: "Contact",
        allRightsReserved: "All rights reserved.",
      },
      teaThemes: {
        shopNow: "Shop Now",
        inspiration: {
          name: "Inspiration",
          description: "Ignite your creative spark",
        },
        serenity: {
          name: "Serenity",
          description: "Find your inner peace",
        },
        adventure: {
          name: "Adventure",
          description: "Embark on new journeys",
        },
        joy: {
          name: "Joy",
          description: "Celebrate life's moments",
        },
        "well-being": {
          name: "Well-being",
          description: "Nurture body and mind",
        },
        mysticism: {
          name: "Mysticism",
          description: "Explore the unknown",
        },
        introspection: {
          name: "Introspection",
          description: "Journey within yourself",
        },
      },
    },
    es: {
      common: {
        home: "Inicio",
        scanQR: "Escanear QR",
        shop: "Tienda",
        myMessages: "Mis Mensajes",
        adminDashboard: "Panel de Administración",
        login: "Iniciar Sesión",
        register: "Registrarse",
        logout: "Cerrar Sesión",
        myAccount: "Mi Cuenta",
        profile: "Perfil",
        messageHistory: "Historial de Mensajes",
        orders: "Pedidos",
        language: "Idioma",
      },
      hero: {
        title: "Descubre Tu Mensaje Personalizado",
        subtitle: "Escanea, sorbe y descubre mensajes creados exclusivamente para ti.",
      },
      shop: {
        title: "Compra Nuestra Colección de Té",
      },
      cart: {
        title: "Tu Carrito de Compras",
        items: "Artículos del Carrito",
        itemsDescription: "Artículos que has añadido a tu carrito",
        empty: "Tu carrito está vacío",
        emptyDescription: "Añade algunos productos de té a tu carrito para verlos aquí.",
        browseShop: "Explorar Tienda",
        orderSummary: "Resumen del Pedido",
        subtotal: "Subtotal",
        shipping: "Envío",
        tax: "Impuesto",
        total: "Total",
        checkout: "Finalizar Compra",
        promoCode: "¿Tienes un Código Promocional?",
        enterPromoCode: "Introduce código promocional",
        apply: "Aplicar",
      },
      footer: {
        tagline: "Descubre mensajes personalizados inspirados en el té con cada escaneo.",
        terms: "Términos",
        privacy: "Privacidad",
        contact: "Contacto",
        allRightsReserved: "Todos los derechos reservados.",
      },
      teaThemes: {
        shopNow: "Comprar Ahora",
        inspiration: {
          name: "Inspiración",
          description: "Enciende tu chispa creativa",
        },
        serenity: {
          name: "Serenidad",
          description: "Encuentra tu paz interior",
        },
        adventure: {
          name: "Aventura",
          description: "Embárcate en nuevos viajes",
        },
        joy: {
          name: "Alegría",
          description: "Celebra los momentos de la vida",
        },
        "well-being": {
          name: "Bienestar",
          description: "Nutre cuerpo y mente",
        },
        mysticism: {
          name: "Misticismo",
          description: "Explora lo desconocido",
        },
        introspection: {
          name: "Introspección",
          description: "Viaja dentro de ti mismo",
        },
      },
    },
    fr: {
      common: {
        home: "Accueil",
        scanQR: "Scanner QR",
        shop: "Boutique",
        myMessages: "Mes Messages",
        adminDashboard: "Tableau de Bord Admin",
        login: "Connexion",
        register: "S'inscrire",
        logout: "Déconnexion",
        myAccount: "Mon Compte",
        profile: "Profil",
        messageHistory: "Historique des Messages",
        orders: "Commandes",
        language: "Langue",
      },
      hero: {
        title: "Découvrez Votre Message Personnalisé",
        subtitle: "Scannez, dégustez et découvrez des messages créés uniquement pour vous.",
      },
      shop: {
        title: "Achetez Notre Collection de Thé",
      },
      cart: {
        title: "Votre Panier",
        items: "Articles du Panier",
        itemsDescription: "Articles que vous avez ajoutés à votre panier",
        empty: "Votre panier est vide",
        emptyDescription: "Ajoutez des produits de thé à votre panier pour les voir ici.",
        browseShop: "Parcourir la Boutique",
        orderSummary: "Résumé de la Commande",
        subtotal: "Sous-total",
        shipping: "Livraison",
        tax: "Taxe",
        total: "Total",
        checkout: "Passer à la Caisse",
        promoCode: "Vous avez un Code Promo?",
        enterPromoCode: "Entrez le code promo",
        apply: "Appliquer",
      },
      footer: {
        tagline: "Découvrez des messages personnalisés inspirés du thé à chaque scan.",
        terms: "Conditions",
        privacy: "Confidentialité",
        contact: "Contact",
        allRightsReserved: "Tous droits réservés.",
      },
      teaThemes: {
        shopNow: "Acheter Maintenant",
        inspiration: {
          name: "Inspiration",
          description: "Allumez votre étincelle créative",
        },
        serenity: {
          name: "Sérénité",
          description: "Trouvez votre paix intérieure",
        },
        adventure: {
          name: "Aventure",
          description: "Embarquez pour de nouveaux voyages",
        },
        joy: {
          name: "Joie",
          description: "Célébrez les moments de la vie",
        },
        "well-being": {
          name: "Bien-être",
          description: "Nourrissez corps et esprit",
        },
        mysticism: {
          name: "Mysticisme",
          description: "Explorez l'inconnu",
        },
        introspection: {
          name: "Introspection",
          description: "Voyagez à l'intérieur de vous-même",
        },
      },
    },
    de: {
      common: {
        home: "Startseite",
        scanQR: "QR Scannen",
        shop: "Shop",
        myMessages: "Meine Nachrichten",
        adminDashboard: "Admin-Dashboard",
        login: "Anmelden",
        register: "Registrieren",
        logout: "Abmelden",
        myAccount: "Mein Konto",
        profile: "Profil",
        messageHistory: "Nachrichtenverlauf",
        orders: "Bestellungen",
        language: "Sprache",
      },
      hero: {
        title: "Entdecken Sie Ihre Persönliche Nachricht",
        subtitle: "Scannen, nippen und entdecken Sie Nachrichten, die speziell für Sie erstellt wurden.",
      },
      shop: {
        title: "Kaufen Sie Unsere Teekollektion",
      },
      cart: {
        title: "Ihr Warenkorb",
        items: "Warenkorbartikel",
        itemsDescription: "Artikel, die Sie Ihrem Warenkorb hinzugefügt haben",
        empty: "Ihr Warenkorb ist leer",
        emptyDescription: "Fügen Sie Teeprodukte zu Ihrem Warenkorb hinzu, um sie hier zu sehen.",
        browseShop: "Shop Durchsuchen",
        orderSummary: "Bestellübersicht",
        subtotal: "Zwischensumme",
        shipping: "Versand",
        tax: "Steuer",
        total: "Gesamt",
        checkout: "Zur Kasse",
        promoCode: "Haben Sie einen Gutscheincode?",
        enterPromoCode: "Gutscheincode eingeben",
        apply: "Anwenden",
      },
      footer: {
        tagline: "Entdecken Sie personalisierte, vom Tee inspirierte Nachrichten bei jedem Scan.",
        terms: "AGB",
        privacy: "Datenschutz",
        contact: "Kontakt",
        allRightsReserved: "Alle Rechte vorbehalten.",
      },
      teaThemes: {
        shopNow: "Jetzt Kaufen",
        inspiration: {
          name: "Inspiration",
          description: "Entfachen Sie Ihren kreativen Funken",
        },
        serenity: {
          name: "Gelassenheit",
          description: "Finden Sie Ihren inneren Frieden",
        },
        adventure: {
          name: "Abenteuer",
          description: "Begeben Sie sich auf neue Reisen",
        },
        joy: {
          name: "Freude",
          description: "Feiern Sie die Momente des Lebens",
        },
        "well-being": {
          name: "Wohlbefinden",
          description: "Pflegen Sie Körper und Geist",
        },
        mysticism: {
          name: "Mystik",
          description: "Erforschen Sie das Unbekannte",
        },
        introspection: {
          name: "Selbstbetrachtung",
          description: "Reisen Sie in Ihr Inneres",
        },
      },
    },
    pt: {
      common: {
        home: "Início",
        scanQR: "Digitalizar QR",
        shop: "Loja",
        myMessages: "Minhas Mensagens",
        adminDashboard: "Painel de Administração",
        login: "Entrar",
        register: "Registar",
        logout: "Sair",
        myAccount: "Minha Conta",
        profile: "Perfil",
        messageHistory: "Histórico de Mensagens",
        orders: "Encomendas",
        language: "Idioma",
      },
      hero: {
        title: "Descubra a Sua Mensagem Personalizada",
        subtitle: "Digitalize, saboreie e descubra mensagens criadas exclusivamente para si.",
      },
      shop: {
        title: "Compre a Nossa Coleção de Chá",
      },
      cart: {
        title: "O Seu Carrinho de Compras",
        items: "Itens do Carrinho",
        itemsDescription: "Itens que adicionou ao seu carrinho",
        empty: "O seu carrinho está vazio",
        emptyDescription: "Adicione alguns produtos de chá ao seu carrinho para os ver aqui.",
        browseShop: "Explorar Loja",
        orderSummary: "Resumo da Encomenda",
        subtotal: "Subtotal",
        shipping: "Envio",
        tax: "Imposto",
        total: "Total",
        checkout: "Finalizar Compra",
        promoCode: "Tem um Código Promocional?",
        enterPromoCode: "Introduza o código promocional",
        apply: "Aplicar",
      },
      footer: {
        tagline: "Descubra mensagens personalizadas inspiradas em chá a cada digitalização.",
        terms: "Termos",
        privacy: "Privacidade",
        contact: "Contacto",
        allRightsReserved: "Todos os direitos reservados.",
      },
      teaThemes: {
        shopNow: "Comprar Agora",
        inspiration: {
          name: "Inspiração",
          description: "Acenda a sua faísca criativa",
        },
        serenity: {
          name: "Serenidade",
          description: "Encontre a sua paz interior",
        },
        adventure: {
          name: "Aventura",
          description: "Embarque em novas jornadas",
        },
        joy: {
          name: "Alegria",
          description: "Celebre os momentos da vida",
        },
        "well-being": {
          name: "Bem-estar",
          description: "Nutra corpo e mente",
        },
        mysticism: {
          name: "Misticismo",
          description: "Explore o desconhecido",
        },
        introspection: {
          name: "Introspecção",
          description: "Viaje para dentro de si mesmo",
        },
      },
    },
    zh: {
      common: {
        home: "首页",
        scanQR: "扫描二维码",
        shop: "商店",
        myMessages: "我的消息",
        adminDashboard: "管理员面板",
        login: "登录",
        register: "注册",
        logout: "退出登录",
        myAccount: "我的账户",
        profile: "个人资料",
        messageHistory: "消息历史",
        orders: "订单",
        language: "语言",
      },
      hero: {
        title: "发现您的个性化消息",
        subtitle: "扫描，品尝，发现专为您定制的消息。",
      },
      shop: {
        title: "选购我们的茶叶系列",
      },
      cart: {
        title: "您的购物车",
        items: "购物车商品",
        itemsDescription: "您已添加到购物车的商品",
        empty: "您的购物车是空的",
        emptyDescription: "添加一些茶叶产品到您的购物车，以便在此处查看。",
        browseShop: "浏览商店",
        orderSummary: "订单摘要",
        subtotal: "小计",
        shipping: "运费",
        tax: "税费",
        total: "总计",
        checkout: "结账",
        promoCode: "有促销代码？",
        enterPromoCode: "输入促销代码",
        apply: "应用",
      },
      footer: {
        tagline: "每次扫描都能发现受茶启发的个性化消息。",
        terms: "条款",
        privacy: "隐私",
        contact: "联系我们",
        allRightsReserved: "版权所有。",
      },
      teaThemes: {
        shopNow: "立即购买",
        inspiration: {
          name: "灵感",
          description: "点燃您的创意火花",
        },
        serenity: {
          name: "宁静",
          description: "找到您的内心平静",
        },
        adventure: {
          name: "冒险",
          description: "踏上新的旅程",
        },
        joy: {
          name: "喜悦",
          description: "庆祝生活的时刻",
        },
        "well-being": {
          name: "健康",
          description: "滋养身心",
        },
        mysticism: {
          name: "神秘主义",
          description: "探索未知",
        },
        introspection: {
          name: "内省",
          description: "探索自我内心",
        },
      },
    },
    ja: {
      common: {
        home: "ホーム",
        scanQR: "QRスキャン",
        shop: "ショップ",
        myMessages: "メッセージ履歴",
        adminDashboard: "管理パネル",
        login: "ログイン",
        register: "登録",
        logout: "ログアウト",
        myAccount: "マイアカウント",
        profile: "プロフィール",
        messageHistory: "メッセージ履歴",
        orders: "注文履歴",
        language: "言語",
      },
      hero: {
        title: "あなただけのメッセージを発見",
        subtitle: "スキャンして、お茶を楽しみながら、あなたのために作られたメッセージを発見しましょう。",
      },
      shop: {
        title: "お茶コレクションを購入",
      },
      cart: {
        title: "ショッピングカート",
        items: "カート内のアイテム",
        itemsDescription: "カートに追加したアイテム",
        empty: "カートは空です",
        emptyDescription: "お茶製品をカートに追加すると、ここに表示されます。",
        browseShop: "ショップを見る",
        orderSummary: "注文概要",
        subtotal: "小計",
        shipping: "配送料",
        tax: "税金",
        total: "合計",
        checkout: "チェックアウト",
        promoCode: "プロモーションコードをお持ちですか？",
        enterPromoCode: "プロモーションコードを入力",
        apply: "適用",
      },
      footer: {
        tagline: "スキャンするたびに、お茶にインスパイアされたパーソナライズされたメッセージを発見できます。",
        terms: "利用規約",
        privacy: "プライバシー",
        contact: "お問い合わせ",
        allRightsReserved: "All rights reserved.",
      },
      teaThemes: {
        shopNow: "今すぐ購入",
        inspiration: {
          name: "インスピレーション",
          description: "創造の火花を灯す",
        },
        serenity: {
          name: "静寂",
          description: "内なる平和を見つける",
        },
        adventure: {
          name: "冒険",
          description: "新しい旅に出る",
        },
        joy: {
          name: "喜び",
          description: "人生の瞬間を祝う",
        },
        "well-being": {
          name: "ウェルビーイング",
          description: "心と体を養う",
        },
        mysticism: {
          name: "神秘主義",
          description: "未知を探る",
        },
        introspection: {
          name: "内省",
          description: "自分自身の内側への旅",
        },
      },
    },
    ko: {
      common: {
        home: "홈",
        scanQR: "QR 스캔",
        shop: "상점",
        myMessages: "내 메시지",
        adminDashboard: "관리자 대시보드",
        login: "로그인",
        register: "회원가입",
        logout: "로그아웃",
        myAccount: "내 계정",
        profile: "프로필",
        messageHistory: "메시지 기록",
        orders: "주문",
        language: "언어",
      },
      hero: {
        title: "맞춤형 메시지 발견하기",
        subtitle: "스캔하고, 차를 마시며, 당신만을 위해 만들어진 메시지를 발견하세요.",
      },
      shop: {
        title: "차 컬렉션 쇼핑하기",
      },
      cart: {
        title: "장바구니",
        items: "장바구니 항목",
        itemsDescription: "장바구니에 추가한 항목",
        empty: "장바구니가 비어 있습니다",
        emptyDescription: "차 제품을 장바구니에 추가하면 여기에 표시됩니다.",
        browseShop: "상점 둘러보기",
        orderSummary: "주문 요약",
        subtotal: "소계",
        shipping: "배송",
        tax: "세금",
        total: "합계",
        checkout: "결제하기",
        promoCode: "프로모션 코드가 있으신가요?",
        enterPromoCode: "프로모션 코드 입력",
        apply: "적용",
      },
      footer: {
        tagline: "스캔할 때마다 차에서 영감을 받은 맞춤형 메시지를 발견하세요.",
        terms: "이용약관",
        privacy: "개인정보 보호",
        contact: "연락처",
        allRightsReserved: "모든 권리 보유.",
      },
      teaThemes: {
        shopNow: "지금 구매하기",
        inspiration: {
          name: "영감",
          description: "창의적인 불꽃을 일으키세요",
        },
        serenity: {
          name: "평온",
          description: "내면의 평화를 찾으세요",
        },
        adventure: {
          name: "모험",
          description: "새로운 여정을 시작하세요",
        },
        joy: {
          name: "기쁨",
          description: "삶의 순간을 축하하세요",
        },
        "well-being": {
          name: "웰빙",
          description: "몸과 마음을 가꾸세요",
        },
        mysticism: {
          name: "신비주의",
          description: "미지의 세계를 탐험하세요",
        },
        introspection: {
          name: "내면성찰",
          description: "자신의 내면으로 여행하세요",
        },
      },
    },
    ar: {
      common: {
        home: "الرئيسية",
        scanQR: "مسح رمز QR",
        shop: "المتجر",
        myMessages: "رسائلي",
        adminDashboard: "لوحة الإدارة",
        login: "تسجيل الدخول",
        register: "التسجيل",
        logout: "تسجيل الخروج",
        myAccount: "حسابي",
        profile: "الملف الشخصي",
        messageHistory: "سجل الرسائل",
        orders: "الطلبات",
        language: "اللغة",
      },
      hero: {
        title: "اكتشف رسالتك الشخصية",
        subtitle: "امسح، ارتشف، واكتشف رسائل مصممة خصيصًا لك.",
      },
      shop: {
        title: "تسوق مجموعة الشاي لدينا",
      },
      cart: {
        title: "سلة التسوق الخاصة بك",
        items: "عناصر السلة",
        itemsDescription: "العناصر التي أضفتها إلى سلتك",
        empty: "سلة التسوق فارغة",
        emptyDescription: "أضف بعض منتجات الشاي إلى سلتك لتراها هنا.",
        browseShop: "تصفح المتجر",
        orderSummary: "ملخص الطلب",
        subtotal: "المجموع الفرعي",
        shipping: "الشحن",
        tax: "الضريبة",
        total: "الإجمالي",
        checkout: "إتمام الشراء",
        promoCode: "هل لديك رمز ترويجي؟",
        enterPromoCode: "أدخل الرمز الترويجي",
        apply: "تطبيق",
      },
      footer: {
        tagline: "اكتشف رسائل مخصصة مستوحاة من الشاي مع كل مسح.",
        terms: "الشروط",
        privacy: "الخصوصية",
        contact: "اتصل بنا",
        allRightsReserved: "جميع الحقوق محفوظة.",
      },
      teaThemes: {
        shopNow: "تسوق الآن",
        inspiration: {
          name: "إلهام",
          description: "أشعل شرارة إبداعك",
        },
        serenity: {
          name: "صفاء",
          description: "اعثر على سلامك الداخلي",
        },
        adventure: {
          name: "مغامرة",
          description: "انطلق في رحلات جديدة",
        },
        joy: {
          name: "فرح",
          description: "احتفل بلحظات الحياة",
        },
        "well-being": {
          name: "عافية",
          description: "غذِّ الجسم والعقل",
        },
        mysticism: {
          name: "تصوف",
          description: "استكشف المجهول",
        },
        introspection: {
          name: "تأمل ذاتي",
          description: "سافر داخل نفسك",
        },
      },
    },
  }

  return translations[language] || translations[defaultLanguage]
}

export const useLanguage = () => useContext(LanguageContext)
