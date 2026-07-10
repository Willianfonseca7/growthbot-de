export type AppLocale = "de" | "en";

export function resolveLocale(lang: string | string[] | undefined): AppLocale {
  if (Array.isArray(lang)) {
    return resolveLocale(lang[0]);
  }

  return lang === "en" ? "en" : "de";
}

export function localeHref(path: string, locale: AppLocale): string {
  return locale === "de" ? path : `${path}?lang=en`;
}

type HomeCopy = {
  eyebrow: string;
  title: string;
  description: string;
  badges: string[];
  primaryCta: string;
  secondaryCta: string;
  note: string;
  localeLabel: string;
  localeOptions: {
    de: string;
    en: string;
  };
  panels: Array<{
    label: string;
    title: string;
    body: string;
  }>;
  systemShape: {
    eyebrow: string;
    title: string;
    features: string[];
  };
  architecture: {
    eyebrow: string;
    title: string;
    rows: Array<{
      label: string;
      value: string;
    }>;
  };
  accessModel: {
    eyebrow: string;
    title: string;
    steps: Array<{
      title: string;
      body: string;
    }>;
  };
};

type OpsCopy = {
  metadataTitle: string;
  metadataDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  localeLabel: string;
  localeOptions: {
    de: string;
    en: string;
  };
  metrics: {
    activeSessions: { label: string; hint: string };
    trackedClicks: { label: string; hint: string };
    pendingFollowUps: { label: string; hint: string };
    sentFollowUps: { label: string; hint: string };
  };
  architecture: {
    title: string;
    description: string;
    rows: Array<{
      label: string;
      value: string;
    }>;
  };
  sessions: {
    title: string;
    description: string;
    empty: string;
    columns: {
      user: string;
      message: string;
      updated: string;
    };
  };
  followUps: {
    title: string;
    description: string;
    empty: string;
    columns: {
      user: string;
      product: string;
      status: string;
      scheduled: string;
    };
    status: {
      sent: string;
      pending: string;
    };
  };
  clicks: {
    title: string;
    description: string;
    empty: string;
    columns: {
      user: string;
      productId: string;
      clicked: string;
    };
  };
};

const homeCopy: Record<AppLocale, HomeCopy> = {
  de: {
    eyebrow: "GrowthBot DE Live",
    title: "Vom Telegram-Chatbot zur KI-Vertriebsplattform.",
    description:
      "GrowthBot DE ist eine recruiter-sichere Live-Oberfläche für eine Plattform, die Intent-Erkennung, Produkt-Zuordnung, strukturierte LLM-Orchestrierung, Affiliate-Tracking, Follow-up-Automatisierung und operative Transparenz verbindet.",
    badges: [
      "Telegram-Runtime",
      "Next.js Oberfläche",
      "Strukturierter KI-Flow",
      "Geschütztes Ops-Dashboard"
    ],
    primaryCta: "Live-Health-Endpunkt",
    secondaryCta: "Geschützte Ops-Oberfläche",
    note:
      "Die öffentliche Landing Page ist bewusst vom operativen Dashboard getrennt. Sensible Laufzeitdaten bleiben hinter geschütztem Zugriff.",
    localeLabel: "Sprache",
    localeOptions: {
      de: "DE",
      en: "EN"
    },
    panels: [
      {
        label: "Öffentlicher Modus",
        title: "Recruiter-sichere Live-Ansicht",
        body: "Architektur, Fähigkeiten, Health-Status und Plattform-Positionierung ohne Offenlegung interner Betriebsdaten."
      },
      {
        label: "Privater Modus",
        title: "Ops-Dashboard hinter Auth",
        body: "Sitzungen, Klicks, Follow-ups und Laufzeit-Transparenz sind in einer geschützten Oberfläche getrennt."
      }
    ],
    systemShape: {
      eyebrow: "Systembild",
      title: "Was in diesem Projekt live ist",
      features: [
        "Telegram-Bot-Runtime für den Gesprächseinstieg",
        "Intent-Klassifikation und Produkt-Zuordnung",
        "Prompt-Builder plus OpenAI-Empfehlungsfluss",
        "Affiliate-Redirect-Tracking-Route",
        "Follow-up-Planungsmodell",
        "Geschützte operative Dashboard-Oberfläche"
      ]
    },
    architecture: {
      eyebrow: "Architektur",
      title: "Kernaufteilung der Plattform",
      rows: [
        {
          label: "Konversation",
          value: "Telegram-Adapter und Gesprächs-Orchestrator"
        },
        {
          label: "Entscheidungsfluss",
          value: "Intent → Kandidaten → Prompt → strukturierte Empfehlung"
        },
        {
          label: "Operations",
          value: "Tracking, Follow-up-Warteschlange, Health-Endpunkt, Ops-Transparenz"
        },
        {
          label: "Persistenz",
          value: "SQLite-Sitzungen, Klicks und Follow-up-Status"
        }
      ]
    },
    accessModel: {
      eyebrow: "Recruiter-Zugriffsmodell",
      title: "Öffentlich zuerst, operativ danach",
      steps: [
        {
          title: "1. Öffentliche Landing Page",
          body: "Live-Positionierung, Architekturansicht und Health-Endpunkt bleiben öffentlich erreichbar."
        },
        {
          title: "2. Geschützte Ops",
          body: "Interne Sitzungen, Klicks und Follow-ups bleiben hinter serverseitiger Basic Auth."
        },
        {
          title: "3. Kontrollierte Demo",
          body: "Recruiter sehen, dass das Projekt real läuft, ohne dass rohe Betriebsdaten standardmäßig offengelegt werden."
        }
      ]
    }
  },
  en: {
    eyebrow: "GrowthBot DE Live",
    title: "From Telegram chatbot to AI sales platform.",
    description:
      "GrowthBot DE is a recruiter-safe live surface for a platform that combines intent detection, product matching, structured LLM orchestration, affiliate tracking, follow-up automation, and operational visibility.",
    badges: [
      "Telegram Runtime",
      "Next.js Surface",
      "Structured AI Flow",
      "Protected Ops Dashboard"
    ],
    primaryCta: "Live Health Endpoint",
    secondaryCta: "Protected Ops Surface",
    note:
      "The public landing is intentionally separated from the operational dashboard. Sensitive runtime data stays behind protected access.",
    localeLabel: "Language",
    localeOptions: {
      de: "DE",
      en: "EN"
    },
    panels: [
      {
        label: "Public Mode",
        title: "Recruiter-safe live view",
        body: "Architecture, capabilities, health status, and platform positioning without exposing internal operational data."
      },
      {
        label: "Private Mode",
        title: "Ops dashboard behind auth",
        body: "Sessions, clicks, follow-ups, and runtime visibility are separated into a protected surface."
      }
    ],
    systemShape: {
      eyebrow: "System Shape",
      title: "What is live in this project",
      features: [
        "Telegram bot runtime for conversational entry",
        "Intent classification and product matching",
        "Prompt builder plus OpenAI recommendation flow",
        "Affiliate redirect tracking route",
        "Follow-up scheduling model",
        "Protected operational dashboard surface"
      ]
    },
    architecture: {
      eyebrow: "Architecture",
      title: "Core platform split",
      rows: [
        {
          label: "Conversation",
          value: "Telegram adapter and conversation orchestrator"
        },
        {
          label: "Decision Flow",
          value: "Intent → candidates → prompt → structured recommendation"
        },
        {
          label: "Operations",
          value: "Tracking, follow-up queue, health endpoint, ops visibility"
        },
        {
          label: "Persistence",
          value: "SQLite sessions, clicks and follow-up state"
        }
      ]
    },
    accessModel: {
      eyebrow: "Recruiter Access Model",
      title: "Public first, operational second",
      steps: [
        {
          title: "1. Public landing",
          body: "Live product positioning, architecture view, and health endpoint remain public."
        },
        {
          title: "2. Protected ops",
          body: "Internal sessions, clicks and follow-ups stay behind server-side basic auth."
        },
        {
          title: "3. Controlled demo",
          body: "Recruiters can see that the project is real without exposing raw operational data by default."
        }
      ]
    }
  }
};

const opsCopy: Record<AppLocale, OpsCopy> = {
  de: {
    metadataTitle: "GrowthBot DE Betriebsdashboard",
    metadataDescription: "Geschütztes Betriebsdashboard für GrowthBot DE",
    eyebrow: "Geschützte Ops-Oberfläche",
    title: "GrowthBot DE Betriebsdashboard",
    description:
      "Diese private Oberfläche zeigt den Live-Betriebszustand von Sitzungen, Follow-ups, Redirect-Tracking und der aktuellen Architekturaufteilung der Plattform.",
    localeLabel: "Sprache",
    localeOptions: {
      de: "DE",
      en: "EN"
    },
    metrics: {
      activeSessions: {
        label: "Aktive Sitzungen",
        hint: "Persistierte Gesprächsverläufe in SQLite."
      },
      trackedClicks: {
        label: "Erfasste Klicks",
        hint: "Affiliate-Redirect-Ereignisse, die über Route Handler erfasst wurden."
      },
      pendingFollowUps: {
        label: "Offene Follow-ups",
        hint: "Leads, die für Re-Engagement durch den Bot-Worker vorgemerkt sind."
      },
      sentFollowUps: {
        label: "Gesendete Follow-ups",
        hint: "Abgeschlossene Follow-up-Zustellungen im Speicher registriert."
      }
    },
    architecture: {
      title: "Plattform-Architektur",
      description:
        "Aktuelle Runtime-Aufteilung zwischen Gesprächs-Orchestrierung und Operator-Transparenz.",
      rows: [
        {
          label: "Kanal",
          value: "Telegram-Adapter für Nachrichten und Callbacks"
        },
        {
          label: "Kern",
          value: "Intent-Klassifikator, Produkt-Matcher, Gesprächs-Orchestrator"
        },
        {
          label: "LLM",
          value: "Prompt-Builder plus strukturierte OpenAI-Provider-Schicht"
        },
        {
          label: "Admin",
          value: "Next.js App Router, Metrik-Dashboard und Tracking-Routen"
        },
        {
          label: "Speicher",
          value: "SQLite-Sitzungen, Klicks und Follow-up-Status"
        }
      ]
    },
    sessions: {
      title: "Letzte Sitzungen",
      description: "Neueste Gespräche, die vom Orchestrator gespeichert wurden.",
      empty: "Noch keine Sitzungen gespeichert.",
      columns: {
        user: "Nutzer",
        message: "Letzte Nachricht",
        updated: "Aktualisiert"
      }
    },
    followUps: {
      title: "Follow-up-Warteschlange",
      description: "Produkte und Nutzer, die aktuell für Re-Engagement verfolgt werden.",
      empty: "Keine Follow-ups geplant.",
      columns: {
        user: "Nutzer",
        product: "Produkt",
        status: "Status",
        scheduled: "Geplant"
      },
      status: {
        sent: "Gesendet",
        pending: "Offen"
      }
    },
    clicks: {
      title: "Letzte Klicks",
      description: "Neueste Affiliate-Redirect-Ereignisse, die von der Plattform erfasst wurden.",
      empty: "Noch keine Klick-Tracking-Daten.",
      columns: {
        user: "Nutzer",
        productId: "Produkt-ID",
        clicked: "Geklickt"
      }
    }
  },
  en: {
    metadataTitle: "GrowthBot DE Ops Dashboard",
    metadataDescription: "Protected operational dashboard for GrowthBot DE",
    eyebrow: "Protected Ops Surface",
    title: "GrowthBot DE operational dashboard",
    description:
      "This private surface exposes the live operational state of sessions, follow-ups, redirect tracking, and the current platform architecture split.",
    localeLabel: "Language",
    localeOptions: {
      de: "DE",
      en: "EN"
    },
    metrics: {
      activeSessions: {
        label: "Active Sessions",
        hint: "Persisted conversation threads in SQLite."
      },
      trackedClicks: {
        label: "Tracked Clicks",
        hint: "Affiliate redirect events captured through route handlers."
      },
      pendingFollowUps: {
        label: "Pending Follow-ups",
        hint: "Leads queued for re-engagement by the bot worker."
      },
      sentFollowUps: {
        label: "Sent Follow-ups",
        hint: "Completed follow-up deliveries registered in storage."
      }
    },
    architecture: {
      title: "Platform Architecture",
      description:
        "Current runtime split between conversational orchestration and operator visibility.",
      rows: [
        {
          label: "Channel",
          value: "Telegram adapter for messages and callbacks"
        },
        {
          label: "Core",
          value: "Intent classifier, product matcher, conversation orchestrator"
        },
        {
          label: "LLM",
          value: "Prompt builder plus structured OpenAI provider layer"
        },
        {
          label: "Admin",
          value: "Next.js app router, metrics dashboard and tracking routes"
        },
        {
          label: "Storage",
          value: "SQLite sessions, clicks and follow-up state"
        }
      ]
    },
    sessions: {
      title: "Recent Sessions",
      description: "Latest conversations stored by the orchestrator.",
      empty: "No sessions stored yet.",
      columns: {
        user: "User",
        message: "Last Message",
        updated: "Updated"
      }
    },
    followUps: {
      title: "Follow-up Queue",
      description: "Products and users currently tracked for re-engagement.",
      empty: "No follow-ups scheduled.",
      columns: {
        user: "User",
        product: "Product",
        status: "Status",
        scheduled: "Scheduled"
      },
      status: {
        sent: "Sent",
        pending: "Pending"
      }
    },
    clicks: {
      title: "Recent Clicks",
      description: "Latest affiliate redirect events recorded by the platform.",
      empty: "No click tracking data yet.",
      columns: {
        user: "User",
        productId: "Product ID",
        clicked: "Clicked"
      }
    }
  }
};

export function getHomeCopy(locale: AppLocale): HomeCopy {
  return homeCopy[locale];
}

export function getOpsCopy(locale: AppLocale): OpsCopy {
  return opsCopy[locale];
}
