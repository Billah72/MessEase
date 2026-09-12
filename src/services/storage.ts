import type { 
  User, 
  MealRecord, 
  MealRequest,
  MealInfo,
  BazarTrip, 
  Transaction, 
  Expense, 
  ResponsibilityAssignment, 
  Announcement, 
  NotificationItem, 
  ActivityLogItem, 
  MessSettings 
} from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_USERS, 
  generateInitialMeals, 
  INITIAL_MEAL_INFOS,
  INITIAL_MEAL_REQUESTS, 
  INITIAL_BAZAR_TRIPS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_EXPENSES, 
  INITIAL_RESPONSIBILITIES, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ACTIVITY_LOGS 
} from './mockData';

const STORAGE_KEYS = {
  SETTINGS: 'gvm2_settings',
  USERS: 'gvm2_users',
  MEALS: 'gvm2_meals',
  MEAL_INFOS: 'gvm2_meal_infos',
  MEAL_REQUESTS: 'gvm2_meal_requests',
  BAZAR: 'gvm2_bazar',
  TRANSACTIONS: 'gvm2_transactions',
  EXPENSES: 'gvm2_expenses',
  RESPONSIBILITIES: 'gvm2_responsibilities',
  ANNOUNCEMENTS: 'gvm2_announcements',
  NOTIFICATIONS: 'gvm2_notifications',
  ACTIVITY_LOGS: 'gvm2_activity_logs',
  ACTIVE_USER_ID: 'gvm2_active_user_id',
};

export const StorageService = {
  getSettings(): MessSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : INITIAL_SETTINGS;
  },
  saveSettings(settings: MessSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  },
  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getMeals(): MealRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.MEALS);
    return data ? JSON.parse(data) : generateInitialMeals();
  },
  saveMeals(meals: MealRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  },

  getMealInfos(): MealInfo[] {
    const data = localStorage.getItem(STORAGE_KEYS.MEAL_INFOS);
    return data ? JSON.parse(data) : INITIAL_MEAL_INFOS;
  },
  saveMealInfos(infos: MealInfo[]): void {
    localStorage.setItem(STORAGE_KEYS.MEAL_INFOS, JSON.stringify(infos));
  },

  getMealRequests(): MealRequest[] {
    const data = localStorage.getItem(STORAGE_KEYS.MEAL_REQUESTS);
    return data ? JSON.parse(data) : INITIAL_MEAL_REQUESTS;
  },
  saveMealRequests(requests: MealRequest[]): void {
    localStorage.setItem(STORAGE_KEYS.MEAL_REQUESTS, JSON.stringify(requests));
  },

  getBazarTrips(): BazarTrip[] {
    const data = localStorage.getItem(STORAGE_KEYS.BAZAR);
    return data ? JSON.parse(data) : INITIAL_BAZAR_TRIPS;
  },
  saveBazarTrips(trips: BazarTrip[]): void {
    localStorage.setItem(STORAGE_KEYS.BAZAR, JSON.stringify(trips));
  },

  getTransactions(): Transaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
  },
  saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getExpenses(): Expense[] {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return data ? JSON.parse(data) : INITIAL_EXPENSES;
  },
  saveExpenses(expenses: Expense[]): void {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  },

  getResponsibilities(): ResponsibilityAssignment[] {
    const data = localStorage.getItem(STORAGE_KEYS.RESPONSIBILITIES);
    return data ? JSON.parse(data) : INITIAL_RESPONSIBILITIES;
  },
  saveResponsibilities(responsibilities: ResponsibilityAssignment[]): void {
    localStorage.setItem(STORAGE_KEYS.RESPONSIBILITIES, JSON.stringify(responsibilities));
  },

  getAnnouncements(): Announcement[] {
    const data = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return data ? JSON.parse(data) : INITIAL_ANNOUNCEMENTS;
  },
  saveAnnouncements(announcements: Announcement[]): void {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  },

  getNotifications(): NotificationItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
  },
  saveNotifications(notifications: NotificationItem[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  getActivityLogs(): ActivityLogItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    return data ? JSON.parse(data) : INITIAL_ACTIVITY_LOGS;
  },
  saveActivityLogs(logs: ActivityLogItem[]): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs));
  },

  getActiveUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
  },
  saveActiveUserId(id: string | null): void {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
    }
  },

  resetToDemo(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },

  exportAllData(): string {
    const dump = {
      settings: this.getSettings(),
      users: this.getUsers(),
      meals: this.getMeals(),
      mealInfos: this.getMealInfos(),
      mealRequests: this.getMealRequests(),
      bazar: this.getBazarTrips(),
      transactions: this.getTransactions(),
      expenses: this.getExpenses(),
      responsibilities: this.getResponsibilities(),
      announcements: this.getAnnouncements(),
      notifications: this.getNotifications(),
      activityLogs: this.getActivityLogs(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(dump, null, 2);
  },

  importAllData(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.settings) this.saveSettings(data.settings);
      if (data.users) this.saveUsers(data.users);
      if (data.meals) this.saveMeals(data.meals);
      if (data.mealInfos) this.saveMealInfos(data.mealInfos);
      if (data.mealRequests) this.saveMealRequests(data.mealRequests);
      if (data.bazar) this.saveBazarTrips(data.bazar);
      if (data.transactions) this.saveTransactions(data.transactions);
      if (data.expenses) this.saveExpenses(data.expenses);
      if (data.responsibilities) this.saveResponsibilities(data.responsibilities);
      if (data.announcements) this.saveAnnouncements(data.announcements);
      if (data.notifications) this.saveNotifications(data.notifications);
      if (data.activityLogs) this.saveActivityLogs(data.activityLogs);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
};
