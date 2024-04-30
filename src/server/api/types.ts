export interface Image {
  id: number | string;
  url: string;
  urls: string[];
  category?: string;
  aspectRatio?: number;
  sub?: string;
  isVideo?: boolean;
  wsrvSupport: boolean;
}
