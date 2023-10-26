export type RequestStat = {
  date: string;
  daily_requests_count: number;
  user_id: string;
};

export interface UserStats {
  email: string;
  max_requests_number: number;
  requests_stats: RequestStat[];
  date: string;
}
