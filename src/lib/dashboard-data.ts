import {
  getDashboardMetrics,
  getRecentClicks,
  getRecentFollowUps,
  getRecentSessions
} from "../database/repositories";

export function getDashboardData() {
  return {
    metrics: getDashboardMetrics(),
    sessions: getRecentSessions(),
    followUps: getRecentFollowUps(),
    clicks: getRecentClicks()
  };
}
