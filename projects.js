/*
⚠️ دليل إضافة التصنيفات (Categories):
عند إضافة مشروع جديد، يمكنك استخدام الكلمات التالية في حقل "category" لربط المشروع بالفلتر:
- "web" ⬅️ يظهر في قسم "منصات ويب"
- "app" ⬅️ يظهر في قسم "تطبيقات ذكية"
- "sys" ⬅️ يظهر في قسم "أنظمة متكاملة"

إذا كان المشروع مشتركاً (مثلاً موقع وتطبيق ونظام)، يمكنك وضع مسافة بين الكلمات:
"category": "web app sys"
*/
window.portfolioProjects = [
  {
    "id": 1,
    "title": "الغولي برنت",
    "title_en": "Alghouli Print",
    "title_tr": "Alghouli Print",
    "description": "منصة متكاملة لحلول الطباعة الإبداعية والأوفست، توفر تجربة مستخدم سلسة لطلب المطبوعات التجارية والهدايا الدعائية.",
    "description_en": "An integrated platform for creative printing and offset solutions, providing a seamless user experience for ordering commercial prints and promotional gifts.",
    "description_tr": "Ticari baskı ve promosyon hediyeleri sipariş etmek için sorunsuz bir kullanıcı deneyimi sunan, yaratıcı baskı ve ofset çözümleri için entegre bir platform.",
    "category": "web",
    "year": "2025",
    "type": "Printing Solutions",
    "image": "images/alghouli.png",
    "technologies": ["HTML", "CSS", "JavaScript"],
    "link": "https://alghouli.com/"
  },
  {
    "id": 2,
    "title": "منصة شمر الإعلامية",
    "title_en": "Shammar Media Platform",
    "title_tr": "Shammar Medya Platformu",
    "description": "منصة إخبارية شاملة متصلة بلوحة تحكم برمجية متطورة لإدارة المحتوى الإخباري والتقارير بدقة عالية.",
    "description_en": "A comprehensive news platform connected to a sophisticated software dashboard for managing news content and reports with high precision.",
    "description_tr": "Haber içeriğini ve raporlarını yüksek hassasiyetle yönetmek için sofistike bir yazılım paneline bağlı kapsamlı bir haber platformu.",
    "category": "web sys",
    "year": "2025",
    "type": "News & Admin CMS",
    "image": "images/shammar.png",
    "technologies": ["PHP", "SQL", "CSS", "JavaScript"],
    "link": "https://shammarplatform.com/"
  },
  {
    "id": 3,
    "title": "مركز AMTC للتميز العلاجي",
    "title_en": "AMTC Therapy Excellence Center",
    "title_tr": "AMTC Terapi Mükemmellik Merkezi",
    "description": "منصة طبية متطورة تقدم خدمات التحليل النفسي والتقنيات الحديثة، مع نظام حجز مواعيد ذكي وإدارة إلكترونية للمرضى.",
    "description_en": "An advanced medical platform offering psychological analysis and modern techniques, featuring a smart appointment booking system and electronic patient management.",
    "description_tr": "Psikolojik analiz ve modern teknikler sunan, akıllı randevu rezervasyon sistemi ve elektronik hasta yönetimi içeren gelişmiş bir tıbbi platform.",
    "category": "web sys",
    "year": "2025",
    "type": "HealthTech & Booking",
    "image": "images/amtc.png",
    "technologies": ["HTML", "CSS", "JavaScript", "Google Sheets"],
    "link": "https://amtc.clinic/"
  },
  {
    "id": 4,
    "title": "ديف أند إن للحلول الرقمية",
    "title_en": "Dev & Inn Digital Solutions",
    "title_tr": "Dev & Inn Dijital Çözümler",
    "description": "وكالة رقمية متكاملة تقدم خدمات تطوير المواقع والتطبيقات مع لوحة تحكم مخصصة لإدارة العملاء والمشاريع التقنية.",
    "description_en": "An integrated digital agency providing web and app development services with a dedicated dashboard for managing clients and technical projects.",
    "description_tr": "Müşterileri ve teknik projeleri yönetmek için özel bir panel ile web ve uygulama geliştirme hizmetleri sunan entegre bir dijital ajans.",
    "category": "web app sys",
    "year": "2025",
    "type": "Digital Agency Portal",
    "image": "images/devandinn.png",
    "technologies": ["HTML", "PHP", "CSS", "JavaScript", "SQL"],
    "link": "https://devandinn.com/"
  },
  {
    "id": 5,
    "title": "مجموعة صك للإنشاءات",
    "title_en": "Sak Group Construction",
    "title_tr": "Sak Group İnşaat",
    "description": "منصة عقارية وإنشائية متكاملة في إسطنبول، تهدف لعرض المشاريع الكبرى وجاري تطوير لوحة تحكم ذكية لإدارة الأصول العقارية.",
    "description_en": "An integrated real estate and construction platform in Istanbul, aimed at showcasing major projects, with a smart dashboard currently under development for asset management.",
    "description_tr": "Gayrimenkul varlık yönetimi için şu anda geliştirilmekte olan akıllı bir panel ile büyük projeleri sergilemeyi amaçlayan İstanbul'daki entegre bir gayrimenkul ve inşaat platformu.",
    "category": "web sys",
    "year": "2024",
    "type": "Real Estate Backend",
    "image": "images/sakgroup.png",
    "technologies": ["HTML", "CSS", "JavaScript", "EJS", "SQL"],
    "link": "https://sakgrouptr.com/"
  },
  {
    "id": 6,
    "title": "معرض أعمال DevNaji النخبوي",
    "title_en": "DevNaji Elite Portfolio",
    "title_tr": "DevNaji Elit Portföy",
    "description": "منصة عرض تكنولوجية متطورة تبرز مهارات هندسة البرمجيات والابتكار الرقمي مع تجربة مستخدم بمعايير عالمية.",
    "description_en": "A sophisticated tech showcase platform highlighting software engineering skills and digital innovation with a world-class user experience.",
    "description_tr": "Dünya standartlarında bir kullanıcı deneyimi ile yazılım mühendisliği becerilerini ve dijital inovasyonu vurgulayan sofistike bir teknoloji vitrini platformu.",
    "category": "web",
    "year": "2025",
    "type": "Personal Elite Brand",
    "image": "images/devnaji-portfolio.png",
    "technologies": ["Vanilla JS", "CSS3 Elite", "i18n", "Bento UI"],
    "link": "#"
  },

];
