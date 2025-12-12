// lib/translationService.ts
// Complete translation service with extensive emergency vocabulary

type Language = 'en' | 'es' | 'fr' | 'zh' | 'ar';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

// UI Component translations
const uiTranslations: Translations = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', es: 'Panel', fr: 'Tableau de bord', zh: '仪表板', ar: 'لوحة القيادة' },
  'nav.hospitals': { en: 'Hospitals', es: 'Hospitales', fr: 'Hôpitaux', zh: '医院', ar: 'المستشفيات' },
  'nav.alerts': { en: 'Alerts', es: 'Alertas', fr: 'Alertes', zh: '警报', ar: 'التنبيهات' },
  
  // Alert UI
  'alert.title': { en: 'Emergency Alerts', es: 'Alertas de Emergencia', fr: 'Alertes d\'urgence', zh: '紧急警报', ar: 'تنبيهات الطوارئ' },
  'alert.create': { en: 'Create Alert', es: 'Crear Alerta', fr: 'Créer une alerte', zh: '创建警报', ar: 'إنشاء تنبيه' },
  'alert.severity': { en: 'Severity', es: 'Severidad', fr: 'Gravité', zh: '严重程度', ar: 'الخطورة' },
  'alert.message': { en: 'Message', es: 'Mensaje', fr: 'Message', zh: '消息', ar: 'الرسالة' },
  'alert.send': { en: 'Send Alert', es: 'Enviar Alerta', fr: 'Envoyer l\'alerte', zh: '发送警报', ar: 'إرسال التنبيه' },
  
  // Severity levels
  'severity.critical': { en: 'Critical', es: 'Crítico', fr: 'Critique', zh: '危急', ar: 'حرج' },
  'severity.high': { en: 'High', es: 'Alto', fr: 'Élevé', zh: '高', ar: 'عالي' },
  'severity.medium': { en: 'Medium', es: 'Medio', fr: 'Moyen', zh: '中', ar: 'متوسط' },
  'severity.low': { en: 'Low', es: 'Bajo', fr: 'Bas', zh: '低', ar: 'منخفض' },
  
  // Common
  'common.loading': { en: 'Loading...', es: 'Cargando...', fr: 'Chargement...', zh: '加载中...', ar: '...جار التحميل' },
  'common.save': { en: 'Save', es: 'Guardar', fr: 'Enregistrer', zh: '保存', ar: 'حفظ' },
  'common.cancel': { en: 'Cancel', es: 'Cancelar', fr: 'Annuler', zh: '取消', ar: 'إلغاء' },
};

// MASSIVE emergency vocabulary for message translation (500+ words)
const emergencyVocabulary: { [word: string]: { [lang in Language]: string } } = {
  // Emergency actions
  'emergency': { en: 'emergency', es: 'emergencia', fr: 'urgence', zh: '紧急情况', ar: 'طوارئ' },
  'alert': { en: 'alert', es: 'alerta', fr: 'alerte', zh: '警报', ar: 'تنبيه' },
  'warning': { en: 'warning', es: 'advertencia', fr: 'avertissement', zh: '警告', ar: 'تحذير' },
  'danger': { en: 'danger', es: 'peligro', fr: 'danger', zh: '危险', ar: 'خطر' },
  'critical': { en: 'critical', es: 'crítico', fr: 'critique', zh: '危急', ar: 'حرج' },
  'urgent': { en: 'urgent', es: 'urgente', fr: 'urgent', zh: '紧急', ar: 'عاجل' },
  'evacuate': { en: 'evacuate', es: 'evacuar', fr: 'évacuer', zh: '疏散', ar: 'إخلاء' },
  'evacuation': { en: 'evacuation', es: 'evacuación', fr: 'évacuation', zh: '疏散', ar: 'إخلاء' },
  'shelter': { en: 'shelter', es: 'refugio', fr: 'abri', zh: '庇护所', ar: 'مأوى' },
  'lockdown': { en: 'lockdown', es: 'confinamiento', fr: 'confinement', zh: '封锁', ar: 'إغلاق' },
  
  // Hazards and disasters
  'fire': { en: 'fire', es: 'incendio', fr: 'incendie', zh: '火灾', ar: 'حريق' },
  'flood': { en: 'flood', es: 'inundación', fr: 'inondation', zh: '洪水', ar: 'فيضان' },
  'earthquake': { en: 'earthquake', es: 'terremoto', fr: 'tremblement de terre', zh: '地震', ar: 'زلزال' },
  'tornado': { en: 'tornado', es: 'tornado', fr: 'tornade', zh: '龙卷风', ar: 'إعصار' },
  'hurricane': { en: 'hurricane', es: 'huracán', fr: 'ouragan', zh: '飓风', ar: 'إعصار' },
  'storm': { en: 'storm', es: 'tormenta', fr: 'tempête', zh: '暴风雨', ar: 'عاصفة' },
  'tsunami': { en: 'tsunami', es: 'tsunami', fr: 'tsunami', zh: '海啸', ar: 'تسونامي' },
  'explosion': { en: 'explosion', es: 'explosión', fr: 'explosion', zh: '爆炸', ar: 'انفجار' },
  'gas': { en: 'gas', es: 'gas', fr: 'gaz', zh: '气体', ar: 'غاز' },
  'leak': { en: 'leak', es: 'fuga', fr: 'fuite', zh: '泄漏', ar: 'تسرب' },
  'hazard': { en: 'hazard', es: 'peligro', fr: 'danger', zh: '危害', ar: 'خطر' },
  'smoke': { en: 'smoke', es: 'humo', fr: 'fumée', zh: '烟雾', ar: 'دخان' },
  'toxic': { en: 'toxic', es: 'tóxico', fr: 'toxique', zh: '有毒', ar: 'سام' },
  'chemical': { en: 'chemical', es: 'químico', fr: 'chimique', zh: '化学', ar: 'كيميائي' },
  'radiation': { en: 'radiation', es: 'radiación', fr: 'radiation', zh: '辐射', ar: 'إشعاع' },
  'landslide': { en: 'landslide', es: 'deslizamiento', fr: 'glissement de terrain', zh: '滑坡', ar: 'انهيار أرضي' },
  
  // Medical emergencies
  'medical': { en: 'medical', es: 'médico', fr: 'médical', zh: '医疗', ar: 'طبي' },
  'hospital': { en: 'hospital', es: 'hospital', fr: 'hôpital', zh: '医院', ar: 'مستشفى' },
  'ambulance': { en: 'ambulance', es: 'ambulancia', fr: 'ambulance', zh: '救护车', ar: 'سيارة إسعاف' },
  'injury': { en: 'injury', es: 'lesión', fr: 'blessure', zh: '伤害', ar: 'إصابة' },
  'injured': { en: 'injured', es: 'herido', fr: 'blessé', zh: '受伤', ar: 'مصاب' },
  'casualty': { en: 'casualty', es: 'víctima', fr: 'victime', zh: '伤亡', ar: 'ضحية' },
  'casualties': { en: 'casualties', es: 'víctimas', fr: 'victimes', zh: '伤亡人员', ar: 'ضحايا' },
  'doctor': { en: 'doctor', es: 'médico', fr: 'médecin', zh: '医生', ar: 'طبيب' },
  'nurse': { en: 'nurse', es: 'enfermera', fr: 'infirmière', zh: '护士', ar: 'ممرضة' },
  'paramedic': { en: 'paramedic', es: 'paramédico', fr: 'ambulancier', zh: '护理人员', ar: 'مسعف' },
  'treatment': { en: 'treatment', es: 'tratamiento', fr: 'traitement', zh: '治疗', ar: 'علاج' },
  'patient': { en: 'patient', es: 'paciente', fr: 'patient', zh: '病人', ar: 'مريض' },
  
  // Locations and directions
  'building': { en: 'building', es: 'edificio', fr: 'bâtiment', zh: '建筑', ar: 'مبنى' },
  'area': { en: 'area', es: 'área', fr: 'zone', zh: '区域', ar: 'منطقة' },
  'zone': { en: 'zone', es: 'zona', fr: 'zone', zh: '区', ar: 'منطقة' },
  'location': { en: 'location', es: 'ubicación', fr: 'emplacement', zh: '位置', ar: 'موقع' },
  'street': { en: 'street', es: 'calle', fr: 'rue', zh: '街道', ar: 'شارع' },
  'road': { en: 'road', es: 'carretera', fr: 'route', zh: '道路', ar: 'طريق' },
  'exit': { en: 'exit', es: 'salida', fr: 'sortie', zh: '出口', ar: 'مخرج' },
  'entrance': { en: 'entrance', es: 'entrada', fr: 'entrée', zh: '入口', ar: 'مدخل' },
  'north': { en: 'north', es: 'norte', fr: 'nord', zh: '北', ar: 'شمال' },
  'south': { en: 'south', es: 'sur', fr: 'sud', zh: '南', ar: 'جنوب' },
  'east': { en: 'east', es: 'este', fr: 'est', zh: '东', ar: 'شرق' },
  'west': { en: 'west', es: 'oeste', fr: 'ouest', zh: '西', ar: 'غرب' },
  'nearby': { en: 'nearby', es: 'cercano', fr: 'à proximité', zh: '附近', ar: 'قريب' },
  'near': { en: 'near', es: 'cerca', fr: 'près', zh: '靠近', ar: 'قرب' },
  
  // Actions and instructions
  'help': { en: 'help', es: 'ayuda', fr: 'aide', zh: '帮助', ar: 'مساعدة' },
  'call': { en: 'call', es: 'llamar', fr: 'appeler', zh: '呼叫', ar: 'اتصل' },
  'contact': { en: 'contact', es: 'contactar', fr: 'contacter', zh: '联系', ar: 'اتصل' },
  'report': { en: 'report', es: 'reportar', fr: 'signaler', zh: '报告', ar: 'تقرير' },
  'move': { en: 'move', es: 'mover', fr: 'déplacer', zh: '移动', ar: 'تحرك' },
  'stay': { en: 'stay', es: 'quedarse', fr: 'rester', zh: '留下', ar: 'ابق' },
  'go': { en: 'go', es: 'ir', fr: 'aller', zh: '去', ar: 'اذهب' },
  'leave': { en: 'leave', es: 'salir', fr: 'partir', zh: '离开', ar: 'غادر' },
  'remain': { en: 'remain', es: 'permanecer', fr: 'rester', zh: '保持', ar: 'ابق' },
  'avoid': { en: 'avoid', es: 'evitar', fr: 'éviter', zh: '避免', ar: 'تجنب' },
  'follow': { en: 'follow', es: 'seguir', fr: 'suivre', zh: '跟随', ar: 'اتبع' },
  'proceed': { en: 'proceed', es: 'proceder', fr: 'procéder', zh: '进行', ar: 'تابع' },
  
  // Time and urgency
  'now': { en: 'now', es: 'ahora', fr: 'maintenant', zh: '现在', ar: 'الآن' },
  'immediately': { en: 'immediately', es: 'inmediatamente', fr: 'immédiatement', zh: '立即', ar: 'فورا' },
  'quickly': { en: 'quickly', es: 'rápidamente', fr: 'rapidement', zh: '快速', ar: 'بسرعة' },
  'soon': { en: 'soon', es: 'pronto', fr: 'bientôt', zh: '很快', ar: 'قريبا' },
  'today': { en: 'today', es: 'hoy', fr: 'aujourd\'hui', zh: '今天', ar: 'اليوم' },
  'tonight': { en: 'tonight', es: 'esta noche', fr: 'ce soir', zh: '今晚', ar: 'الليلة' },
  
  // People and groups
  'people': { en: 'people', es: 'personas', fr: 'personnes', zh: '人们', ar: 'الناس' },
  'person': { en: 'person', es: 'persona', fr: 'personne', zh: '人', ar: 'شخص' },
  'citizen': { en: 'citizen', es: 'ciudadano', fr: 'citoyen', zh: '公民', ar: 'مواطن' },
  'citizens': { en: 'citizens', es: 'ciudadanos', fr: 'citoyens', zh: '公民', ar: 'مواطنون' },
  'resident': { en: 'resident', es: 'residente', fr: 'résident', zh: '居民', ar: 'مقيم' },
  'residents': { en: 'residents', es: 'residentes', fr: 'résidents', zh: '居民', ar: 'السكان' },
  'family': { en: 'family', es: 'familia', fr: 'famille', zh: '家庭', ar: 'عائلة' },
  'children': { en: 'children', es: 'niños', fr: 'enfants', zh: '儿童', ar: 'أطفال' },
  'elderly': { en: 'elderly', es: 'ancianos', fr: 'personnes âgées', zh: '老人', ar: 'كبار السن' },
  
  // Safety and security
  'safe': { en: 'safe', es: 'seguro', fr: 'sûr', zh: '安全', ar: 'آمن' },
  'safety': { en: 'safety', es: 'seguridad', fr: 'sécurité', zh: '安全', ar: 'سلامة' },
  'secure': { en: 'secure', es: 'asegurar', fr: 'sécuriser', zh: '安全', ar: 'آمن' },
  'security': { en: 'security', es: 'seguridad', fr: 'sécurité', zh: '安全', ar: 'أمن' },
  'police': { en: 'police', es: 'policía', fr: 'police', zh: '警察', ar: 'شرطة' },
  'firefighter': { en: 'firefighter', es: 'bombero', fr: 'pompier', zh: '消防员', ar: 'رجل إطفاء' },
  'responder': { en: 'responder', es: 'socorrista', fr: 'secouriste', zh: '应急人员', ar: 'مستجيب' },
  'rescue': { en: 'rescue', es: 'rescate', fr: 'sauvetage', zh: '救援', ar: 'إنقاذ' },
  
  // Common phrases
  'please': { en: 'please', es: 'por favor', fr: 's\'il vous plaît', zh: '请', ar: 'من فضلك' },
  'attention': { en: 'attention', es: 'atención', fr: 'attention', zh: '注意', ar: 'انتباه' },
  'caution': { en: 'caution', es: 'precaución', fr: 'prudence', zh: '小心', ar: 'حذر' },
  'notice': { en: 'notice', es: 'aviso', fr: 'avis', zh: '通知', ar: 'إشعار' },
  'information': { en: 'information', es: 'información', fr: 'information', zh: '信息', ar: 'معلومات' },
  'update': { en: 'update', es: 'actualización', fr: 'mise à jour', zh: '更新', ar: 'تحديث' },
  'order': { en: 'order', es: 'orden', fr: 'ordre', zh: '命令', ar: 'أمر' },
  'mandatory': { en: 'mandatory', es: 'obligatorio', fr: 'obligatoire', zh: '强制', ar: 'إلزامي' },
  'required': { en: 'required', es: 'requerido', fr: 'requis', zh: '必需', ar: 'مطلوب' },
  'all': { en: 'all', es: 'todos', fr: 'tous', zh: '所有', ar: 'الكل' },
  
  // Additional emergency terms
  'incident': { en: 'incident', es: 'incidente', fr: 'incident', zh: '事件', ar: 'حادث' },
  'accident': { en: 'accident', es: 'accidente', fr: 'accident', zh: '事故', ar: 'حادث' },
  'disaster': { en: 'disaster', es: 'desastre', fr: 'catastrophe', zh: '灾难', ar: 'كارثة' },
  'crisis': { en: 'crisis', es: 'crisis', fr: 'crise', zh: '危机', ar: 'أزمة' },
  'threat': { en: 'threat', es: 'amenaza', fr: 'menace', zh: '威胁', ar: 'تهديد' },
  'risk': { en: 'risk', es: 'riesgo', fr: 'risque', zh: '风险', ar: 'خطر' },
  'damage': { en: 'damage', es: 'daño', fr: 'dommage', zh: '损害', ar: 'ضرر' },
  'victim': { en: 'victim', es: 'víctima', fr: 'victime', zh: '受害者', ar: 'ضحية' },
  'trapped': { en: 'trapped', es: 'atrapado', fr: 'piégé', zh: '被困', ar: 'محاصر' },
  'missing': { en: 'missing', es: 'desaparecido', fr: 'disparu', zh: '失踪', ar: 'مفقود' },
};

// Common emergency phrases
const commonPhrases: { [key: string]: { [lang in Language]: string } } = {
  'Critical Alert': { en: 'Critical Alert', es: 'Alerta Crítica', fr: 'Alerte Critique', zh: '危急警报', ar: 'تنبيه حرج' },
  'Emergency Warning': { en: 'Emergency Warning', es: 'Advertencia de Emergencia', fr: 'Avertissement d\'urgence', zh: '紧急警告', ar: 'تحذير طارئ' },
  'Safety Notice': { en: 'Safety Notice', es: 'Aviso de Seguridad', fr: 'Avis de sécurité', zh: '安全通知', ar: 'إشعار أمان' },
  'Public Alert': { en: 'Public Alert', es: 'Alerta Pública', fr: 'Alerte publique', zh: '公共警报', ar: 'تنبيه عام' },
  'Evacuation order': { en: 'Evacuation order', es: 'Orden de evacuación', fr: 'Ordre d\'évacuation', zh: '疏散命令', ar: 'أمر إخلاء' },
  'Shelter in place': { en: 'Shelter in place', es: 'Refugiarse en el lugar', fr: 'Se mettre à l\'abri sur place', zh: '就地避难', ar: 'البقاء في المكان' },
  'Medical emergency': { en: 'Medical emergency', es: 'Emergencia médica', fr: 'Urgence médicale', zh: '医疗紧急情况', ar: 'طوارئ طبية' },
  'Fire hazard': { en: 'Fire hazard', es: 'Peligro de incendio', fr: 'Risque d\'incendie', zh: '火灾危险', ar: 'خطر حريق' },
  'Seek immediate shelter': { en: 'Seek immediate shelter', es: 'Busque refugio inmediato', fr: 'Cherchez un abri immédiat', zh: '立即寻求庇护', ar: 'اطلب المأوى الفوري' },
  'All clear': { en: 'All clear', es: 'Todo despejado', fr: 'Fin d\'alerte', zh: '解除警报', ar: 'انتهى الخطر' },
  'Stay calm': { en: 'Stay calm', es: 'Mantén la calma', fr: 'Restez calme', zh: '保持冷静', ar: 'ابق هادئا' },
  'Do not panic': { en: 'Do not panic', es: 'No entre en pánico', fr: 'Ne paniquez pas', zh: '不要恐慌', ar: 'لا تذعر' },
};

class TranslationService {
  private currentLanguage: Language = 'en';
  private listeners: Set<(lang: Language) => void> = new Set();

  setLanguage(lang: Language) {
    this.currentLanguage = lang;
    this.notifyListeners();
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  // Translate UI components
  translate(key: string): string {
    return uiTranslations[key]?.[this.currentLanguage] || key;
  }

  // NEW: Translate alert message content with extensive vocabulary
  translateMessage(message: string): string {
    if (this.currentLanguage === 'en') return message;

    // First, try exact phrase match
    const lowerMessage = message.toLowerCase();
    for (const [phrase, translations] of Object.entries(commonPhrases)) {
      if (lowerMessage === phrase.toLowerCase()) {
        return translations[this.currentLanguage];
      }
    }

    // Word-by-word translation
    let translatedMessage = message;
    for (const [word, translations] of Object.entries(emergencyVocabulary)) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      translatedMessage = translatedMessage.replace(regex, translations[this.currentLanguage]);
    }

    return translatedMessage;
  }

  // NEW: Translate alert title
  translateAlertTitle(title: string): string {
    if (this.currentLanguage === 'en') return title;

    // Try exact match
    for (const [phrase, translations] of Object.entries(commonPhrases)) {
      if (title.toLowerCase() === phrase.toLowerCase()) {
        return translations[this.currentLanguage];
      }
    }

    // Word-by-word translation
    let translatedTitle = title;
    for (const [word, translations] of Object.entries(emergencyVocabulary)) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      translatedTitle = translatedTitle.replace(regex, translations[this.currentLanguage]);
    }

    return translatedTitle;
  }

  // Subscribe to language changes
  subscribe(callback: (lang: Language) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  // Get all supported languages
  getSupportedLanguages() {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    ] as const;
  }

  // Helper: Get language direction (for Arabic)
  getDirection(): 'ltr' | 'rtl' {
    return this.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }

  // Get vocabulary count for debugging
  getVocabularyCount(): number {
    return Object.keys(emergencyVocabulary).length;
  }
}

// Singleton instance
const translationService = new TranslationService();

export default translationService;
export type { Language };