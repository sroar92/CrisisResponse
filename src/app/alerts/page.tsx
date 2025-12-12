'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, AlertTriangle, Info, X, Globe, Loader2 } from 'lucide-react';

// Inline Language type
type Language = 'en' | 'es' | 'fr' | 'zh' | 'ar';

interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: Date;
  originalTitle: string;
  originalMessage: string;
  isTranslating?: boolean;
}

// Inline translation service
class SimpleTranslationService {
  private currentLanguage: Language = 'en';
  private listeners: Set<(lang: Language) => void> = new Set();

  setLanguage(lang: Language) {
    this.currentLanguage = lang;
    this.notifyListeners();
  }

  getLanguage(): Language {
    return this.currentLanguage;
  }

  subscribe(callback: (lang: Language) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }
}

const translationService = new SimpleTranslationService();

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    severity: 'medium' as Alert['severity'],
    title: '',
    message: '',
  });

  // Subscribe to language changes
  useEffect(() => {
    setCurrentLanguage(translationService.getLanguage());

    const unsubscribe = translationService.subscribe((lang) => {
      setCurrentLanguage(lang);
      translateAllAlerts(lang);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Function to translate all alerts to a new language
  const translateAllAlerts = async (targetLang: Language) => {
    if (targetLang === 'en') {
      setAlerts((prevAlerts) => 
        prevAlerts.map((alert) => ({
          ...alert,
          title: alert.originalTitle,
          message: alert.originalMessage,
          isTranslating: false,
        }))
      );
      return;
    }

    setAlerts((prevAlerts) => 
      prevAlerts.map((alert) => ({
        ...alert,
        isTranslating: true,
      }))
    );

    setAlerts((prevAlerts) => {
      const translateAlert = async (alert: Alert) => {
        const translatedTitle = await translateText(alert.originalTitle, targetLang);
        const translatedMessage = await translateText(alert.originalMessage, targetLang);
        
        return {
          ...alert,
          title: translatedTitle,
          message: translatedMessage,
          isTranslating: false,
        };
      };

      Promise.all(prevAlerts.map(translateAlert)).then((translated) => {
        setAlerts(translated);
      });

      return prevAlerts;
    });
  };

  const translateText = async (text: string, targetLang: Language): Promise<string> => {
    if (targetLang === 'en') return text;

    await new Promise(resolve => setTimeout(resolve, 300));

    const translations = getTranslationForText(text, targetLang);
    return translations || text;
  };

  const getTranslationForText = (text: string, targetLang: Language): string => {
    const exactMatches: { [key: string]: { [lang in Language]: string } } = {
      'Critical Alert': {
        en: 'Critical Alert',
        es: 'Alerta Crítica',
        fr: 'Alerte Critique',
        zh: '危急警报',
        ar: 'تنبيه حرج'
      },
      'Emergency Warning': {
        en: 'Emergency Warning',
        es: 'Advertencia de Emergencia',
        fr: 'Avertissement d\'urgence',
        zh: '紧急警告',
        ar: 'تحذير طارئ'
      },
      'Safety Notice': {
        en: 'Safety Notice',
        es: 'Aviso de Seguridad',
        fr: 'Avis de sécurité',
        zh: '安全通知',
        ar: 'إشعار أمان'
      },
    };

    const lowerText = text.toLowerCase();
    for (const [key, translations] of Object.entries(exactMatches)) {
      if (lowerText === key.toLowerCase()) {
        return translations[targetLang];
      }
    }

    const wordTranslations: { [word: string]: { [lang in Language]: string } } = {
      'emergency': { en: 'emergency', es: 'emergencia', fr: 'urgence', zh: '紧急', ar: 'طوارئ' },
      'alert': { en: 'alert', es: 'alerta', fr: 'alerte', zh: '警报', ar: 'تنبيه' },
      'critical': { en: 'critical', es: 'crítico', fr: 'critique', zh: '危急', ar: 'حرج' },
      'warning': { en: 'warning', es: 'advertencia', fr: 'avertissement', zh: '警告', ar: 'تحذير' },
      'danger': { en: 'danger', es: 'peligro', fr: 'danger', zh: '危险', ar: 'خطر' },
      'fire': { en: 'fire', es: 'incendio', fr: 'incendie', zh: '火灾', ar: 'حريق' },
      'flood': { en: 'flood', es: 'inundación', fr: 'inondation', zh: '洪水', ar: 'فيضان' },
      'evacuate': { en: 'evacuate', es: 'evacuar', fr: 'évacuer', zh: '疏散', ar: 'إخلاء' },
      'shelter': { en: 'shelter', es: 'refugio', fr: 'abri', zh: '庇护', ar: 'مأوى' },
      'medical': { en: 'medical', es: 'médico', fr: 'médical', zh: '医疗', ar: 'طبي' },
      'hospital': { en: 'hospital', es: 'hospital', fr: 'hôpital', zh: '医院', ar: 'مستشفى' },
      'help': { en: 'help', es: 'ayuda', fr: 'aide', zh: '帮助', ar: 'مساعدة' },
      'now': { en: 'now', es: 'ahora', fr: 'maintenant', zh: '现在', ar: 'الآن' },
      'immediately': { en: 'immediately', es: 'inmediatamente', fr: 'immédiatement', zh: '立即', ar: 'فورا' },
      'please': { en: 'please', es: 'por favor', fr: 's\'il vous plaît', zh: '请', ar: 'من فضلك' },
      'urgent': { en: 'urgent', es: 'urgente', fr: 'urgent', zh: '紧急', ar: 'عاجل' },
      'building': { en: 'building', es: 'edificio', fr: 'bâtiment', zh: '建筑', ar: 'مبنى' },
      'area': { en: 'area', es: 'área', fr: 'zone', zh: '区域', ar: 'منطقة' },
      'people': { en: 'people', es: 'personas', fr: 'personnes', zh: '人们', ar: 'الناس' },
      'safe': { en: 'safe', es: 'seguro', fr: 'sûr', zh: '安全', ar: 'آمن' },
      'earthquake': { en: 'earthquake', es: 'terremoto', fr: 'tremblement de terre', zh: '地震', ar: 'زلزال' },
      'tornado': { en: 'tornado', es: 'tornado', fr: 'tornade', zh: '龙卷风', ar: 'إعصار' },
      'storm': { en: 'storm', es: 'tormenta', fr: 'tempête', zh: '暴风雨', ar: 'عاصفة' },
      'explosion': { en: 'explosion', es: 'explosión', fr: 'explosion', zh: '爆炸', ar: 'انفجار' },
      'gas': { en: 'gas', es: 'gas', fr: 'gaz', zh: '气体', ar: 'غاز' },
      'leak': { en: 'leak', es: 'fuga', fr: 'fuite', zh: '泄漏', ar: 'تسرب' },
      'toxic': { en: 'toxic', es: 'tóxico', fr: 'toxique', zh: '有毒', ar: 'سام' },
      'ambulance': { en: 'ambulance', es: 'ambulancia', fr: 'ambulance', zh: '救护车', ar: 'سيارة إسعاف' },
      'police': { en: 'police', es: 'policía', fr: 'police', zh: '警察', ar: 'شرطة' },
      'road': { en: 'road', es: 'carretera', fr: 'route', zh: '道路', ar: 'طريق' },
      'exit': { en: 'exit', es: 'salida', fr: 'sortie', zh: '出口', ar: 'مخرج' },
      'north': { en: 'north', es: 'norte', fr: 'nord', zh: '北', ar: 'شمال' },
      'south': { en: 'south', es: 'sur', fr: 'sud', zh: '南', ar: 'جنوب' },
      'east': { en: 'east', es: 'este', fr: 'est', zh: '东', ar: 'شرق' },
      'west': { en: 'west', es: 'oeste', fr: 'ouest', zh: '西', ar: 'غرب' },
    };

    let translatedText = text;
    for (const [word, translations] of Object.entries(wordTranslations)) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      translatedText = translatedText.replace(regex, translations[targetLang]);
    }

    return translatedText;
  };

  const handleCreateAlert = () => {
    if (!newAlert.title || !newAlert.message) return;

    const alert: Alert = {
      id: Date.now().toString(),
      severity: newAlert.severity,
      title: newAlert.title,
      message: newAlert.message,
      originalTitle: newAlert.title,
      originalMessage: newAlert.message,
      timestamp: new Date(),
      isTranslating: false,
    };

    if (currentLanguage !== 'en') {
      alert.isTranslating = true;
      setAlerts([alert, ...alerts]);
      
      translateText(newAlert.title, currentLanguage).then(translatedTitle => {
        translateText(newAlert.message, currentLanguage).then(translatedMessage => {
          setAlerts((prev) => 
            prev.map((a) => 
              a.id === alert.id 
                ? { ...a, title: translatedTitle, message: translatedMessage, isTranslating: false }
                : a
            )
          );
        });
      });
    } else {
      setAlerts([alert, ...alerts]);
    }

    setNewAlert({ severity: 'medium', title: '', message: '' });
    setShowCreateForm(false);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const handleLanguageChange = (lang: Language) => {
    translationService.setLanguage(lang);
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 border-red-500';
      case 'high': return 'bg-orange-600 border-orange-500';
      case 'medium': return 'bg-yellow-600 border-yellow-500';
      case 'low': return 'bg-blue-600 border-blue-500';
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Alert System */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
          {/* Header with Language Selector */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-red-400" />
              Emergency Alerts
            </h2>
            
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-400" />
                <select
                  value={currentLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value as Language)}
                  className="bg-slate-700 text-white text-sm rounded-lg px-3 py-1.5 border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="zh">中文</option>
                  <option value="ar">العربية</option>
                </select>
              </div>

              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold"
              >
                Create Alert
              </button>
            </div>
          </div>

          {/* Create Alert Form */}
          {showCreateForm && (
            <div className="mb-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Severity
                  </label>
                  <select
                    value={newAlert.severity}
                    onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value as Alert['severity'] })}
                    className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Alert Title (in English)
                  </label>
                  <input
                    type="text"
                    value={newAlert.title}
                    onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                    placeholder="e.g., Emergency Warning, Fire Alert"
                    className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    ✨ Will be automatically translated to other languages
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Message (in English)
                  </label>
                  <textarea
                    value={newAlert.message}
                    onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                    placeholder="Type anything - it will be translated automatically"
                    rows={3}
                    className="w-full bg-slate-600 text-white rounded-lg px-3 py-2 border border-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    ✨ Type any message - translations happen automatically when users change language
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCreateAlert}
                    disabled={!newAlert.title || !newAlert.message}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                  >
                    Send Alert
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Alerts List */}
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active alerts</p>
                <p className="text-sm mt-1">Create an alert - it will automatically translate</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`${getSeverityColor(alert.severity)} rounded-lg p-4 border-2 relative`}
                >
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-black/20 rounded transition-colors"
                    disabled={alert.isTranslating}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>

                  <div className="flex items-start gap-3 pr-8">
                    <div className="mt-0.5">
                      {alert.isTranslating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        getSeverityIcon(alert.severity)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">
                          {alert.isTranslating ? 'Translating...' : alert.title}
                        </h3>
                        <span className="text-xs bg-black/20 px-2 py-0.5 rounded text-white uppercase">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-white/90 mb-2">
                        {alert.isTranslating ? 'Translating message...' : alert.message}
                      </p>
                      <p className="text-xs text-white/70">
                        {alert.timestamp.toLocaleTimeString()} - {alert.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Info Box */}
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
            <p className="text-sm text-blue-300">
              <Globe className="w-4 h-4 inline mr-1" />
              Currently showing in <strong>{currentLanguage.toUpperCase()}</strong>.
              {currentLanguage !== 'en' && ' Switch to any language to see automatic translations!'}
            </p>
            <p className="text-xs text-blue-400 mt-1">
              💡 Type alerts in English - they&apos;ll automatically translate to all languages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
