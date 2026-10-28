export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'makanan' | 'minuman';
  icon: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'cooking' | 'served' | 'cancelled';

export interface Order {
  id: number;
  customer: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequest {
  method: HttpMethod;
  endpoint: string;
  headers: Record<string, string>;
  body?: any;
}

export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any;
  durationMs: number;
}

export type PipelineNodeId = 'CLIENT' | 'API' | 'BACKEND' | 'DATABASE' | 'RESPONSE';

export interface SimulationStep {
  nodeId: PipelineNodeId;
  title: string;
  description: string;
  analogy: string;
  technicalTerm: string;
  payloadSnapshot?: any;
  checklists?: string[];
  isError?: boolean;
}

export interface TimelineEvent {
  timestamp: string;
  node: PipelineNodeId;
  description: string;
  status: 'info' | 'success' | 'warning' | 'error';
}
