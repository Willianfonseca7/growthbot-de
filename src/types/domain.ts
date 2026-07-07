export type CatalogLayerKey = "camada1" | "camada2" | "camada3";

export type Product = {
  nome: string;
  nicho: string[];
  descricao: string;
  comissao: number;
  link: string;
};

export type Catalog = Record<CatalogLayerKey, Product[]>;

export type ChatHistoryEntry = {
  role: "user" | "assistant";
  content: string;
};

export type SessionRecord = {
  userId: string;
  history: ChatHistoryEntry[];
  updatedAt: number;
};

export type IntentLabel =
  | "financas"
  | "tech"
  | "saude"
  | "carreira"
  | "marketing"
  | "mindset"
  | "geral";

export type IntentClassification = {
  label: IntentLabel;
  matchedKeywords: string[];
  normalizedText: string;
};

export type ProductRecommendation = {
  productName: string;
  message: string;
};

export type FollowUpRecord = {
  user_id: string;
  produto_id: string;
  produto_nome: string;
  produto_link: string;
  scheduled_at: number;
  sent: number;
};

export type DashboardMetrics = {
  totalSessions: number;
  totalClicks: number;
  pendingFollowUps: number;
  sentFollowUps: number;
};

export type RecentSession = {
  userId: string;
  lastMessage: string;
  updatedAt: number;
};

export type ClickRecord = {
  userId: string;
  productId: string;
  clickedAt: number;
};
