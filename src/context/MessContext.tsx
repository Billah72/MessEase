import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
  MessSettings, 
  MemberFinancialSummary, 
  MessOverallStats,
  RequestStatus,
  MealType
} from '../types';
import { StorageService } from '../services/storage';
import { calculateAllStats } from '../services/calculations';
import { useAuth } from './AuthContext';

interface MessContextType {
  settings: MessSettings;
  users: User[];
  meals: MealRecord[];
  mealInfos: MealInfo[];
  mealRequests: MealRequest[];
  bazarTrips: BazarTrip[];
  transactions: Transaction[];
  expenses: Expense[];
  responsibilities: ResponsibilityAssignment[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  activityLogs: ActivityLogItem[];
  
  overallStats: MessOverallStats;
  memberSummaries: MemberFinancialSummary[];
  myFinancialSummary?: MemberFinancialSummary;
  myMealRequests: MealRequest[];
  myAssignedDuties?: ResponsibilityAssignment;

  // Member management (Manager Only)
  createMemberAccount: (data: { name: string; email: string; phone: string; password?: string; roomNo?: string; initialDeposit?: number }) => User;
  updateMemberAccount: (id: string, updates: Partial<User>) => void;
  toggleMemberStatus: (id: string) => void;

  // Meal Management
  updateMealRecord: (record: Partial<MealRecord> & { memberId: string; date: string }) => void;
  updateMealInfo: (info: MealInfo) => void;

  // Meal Requests (Member & Manager workflow)
  submitMealRequest: (req: Omit<MealRequest, 'id' | 'status' | 'submittedAt'>) => void;
  reviewMealRequest: (requestId: string, status: RequestStatus, responseNote?: string) => void;

  // Bazar & Finance (Manager)
  addBazarTrip: (trip: Omit<BazarTrip, 'id' | 'createdAt'>) => void;
  deleteBazarTrip: (id: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  deleteExpense: (id: string) => void;

  // Responsibilities & Notices
  saveResponsibility: (res: ResponsibilityAssignment) => void;
  createAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Settings
  updateSettings: (newSettings: MessSettings) => void;
  resetAllToDemo: () => void;
  exportBackup: () => string;
  importBackup: (json: string) => boolean;
}

const MessContext = createContext<MessContextType | undefined>(undefined);

export const MessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [settings, setSettings] = useState<MessSettings>(() => StorageService.getSettings());
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [meals, setMeals] = useState<MealRecord[]>(() => StorageService.getMeals());
  const [mealInfos, setMealInfos] = useState<MealInfo[]>(() => StorageService.getMealInfos());
  const [mealRequests, setMealRequests] = useState<MealRequest[]>(() => StorageService.getMealRequests());
  const [bazarTrips, setBazarTrips] = useState<BazarTrip[]>(() => StorageService.getBazarTrips());
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageService.getTransactions());
  const [expenses, setExpenses] = useState<Expense[]>(() => StorageService.getExpenses());
  const [responsibilities, setResponsibilities] = useState<ResponsibilityAssignment[]>(() => StorageService.getResponsibilities());
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => StorageService.getAnnouncements());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(() => StorageService.getActivityLogs());

  // Persistence effects
  useEffect(() => { StorageService.saveSettings(settings); }, [settings]);
  useEffect(() => { StorageService.saveUsers(users); }, [users]);
  useEffect(() => { StorageService.saveMeals(meals); }, [meals]);
  useEffect(() => { StorageService.saveMealInfos(mealInfos); }, [mealInfos]);
  useEffect(() => { StorageService.saveMealRequests(mealRequests); }, [mealRequests]);
  useEffect(() => { StorageService.saveBazarTrips(bazarTrips); }, [bazarTrips]);
  useEffect(() => { StorageService.saveTransactions(transactions); }, [transactions]);
  useEffect(() => { StorageService.saveExpenses(expenses); }, [expenses]);
  useEffect(() => { StorageService.saveResponsibilities(responsibilities); }, [responsibilities]);
  useEffect(() => { StorageService.saveAnnouncements(announcements); }, [announcements]);
  useEffect(() => { StorageService.saveNotifications(notifications); }, [notifications]);
  useEffect(() => { StorageService.saveActivityLogs(activityLogs); }, [activityLogs]);

  // Logging & Notification Helpers
  const logActivity = (action: string, details: string) => {
    const log: ActivityLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + new Date().toISOString().split('T')[0] + ')',
      userName: currentUser?.name || 'System',
      userRole: currentUser?.role || 'MANAGER',
      action,
      details
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  const notify = (title: string, message: string, type: NotificationItem['type'] = 'INFO', userId: string = 'ALL') => {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toLocaleString('en-GB')
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Live Calculations
  const { overallStats, memberSummaries } = useMemo(() => {
    const pendingCount = mealRequests.filter(r => r.status === 'PENDING').length;
    return calculateAllStats(users, meals, bazarTrips, transactions, expenses, settings, pendingCount);
  }, [users, meals, bazarTrips, transactions, expenses, settings, mealRequests]);

  const myFinancialSummary = useMemo(() => {
    if (!currentUser || currentUser.role !== 'MEMBER') return undefined;
    return memberSummaries.find(s => s.memberId === currentUser.id);
  }, [memberSummaries, currentUser]);

  const myMealRequests = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'MANAGER') return mealRequests;
    return mealRequests.filter(r => r.memberId === currentUser.id);
  }, [mealRequests, currentUser]);

  const myAssignedDuties = useMemo(() => {
    if (!currentUser) return undefined;
    const today = '2026-09-12';
    return responsibilities.find(r => 
      r.date === today && (
        r.bazarDutyMemberIds.includes(currentUser.id) ||
        r.cookingDutyMemberIds.includes(currentUser.id) ||
        r.cleaningDutyMemberIds.includes(currentUser.id)
      )
    );
  }, [responsibilities, currentUser]);

  // --- Member Management (Manager Only) ---
  const createMemberAccount = (data: { name: string; email: string; phone: string; password?: string; roomNo?: string; initialDeposit?: number }): User => {
    const newMember: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'MEMBER',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      roomNo: data.roomNo || 'Room 402',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      password: data.password || 'member123'
    };

    setUsers(prev => [...prev, newMember]);

    // If initial deposit provided
    if (data.initialDeposit && data.initialDeposit > 0) {
      const initialTx: Transaction = {
        id: `trx-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'DEPOSIT',
        category: 'MEMBER_DEPOSIT',
        memberId: newMember.id,
        memberName: newMember.name,
        amount: Number(data.initialDeposit),
        paymentMethod: 'Cash',
        description: 'Initial Opening Deposit',
        recordedBy: currentUser?.name || 'Manager',
        status: 'VERIFIED',
        createdAt: new Date().toLocaleString('en-GB')
      };
      setTransactions(prev => [initialTx, ...prev]);
    }

    logActivity('Created Member Account', `Manager created new member account for ${data.name} (${data.email})`);
    notify('New Member Registered', `${data.name} joined the mess.`, 'INFO', 'ALL');
    return newMember;
  };

  const updateMemberAccount = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    logActivity('Updated Member', `Manager updated profile details for user ID: ${id}`);
  };

  const toggleMemberStatus = (id: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        logActivity('Changed Member Status', `Member ${u.name} status set to ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // --- Meal Actions ---
  const updateMealRecord = (record: Partial<MealRecord> & { memberId: string; date: string }) => {
    setMeals(prev => {
      const idx = prev.findIndex(m => m.memberId === record.memberId && m.date === record.date);
      const member = users.find(u => u.id === record.memberId);
      const memberName = member?.name || 'Member';

      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          ...record,
          memberName,
          updatedAt: new Date().toLocaleString('en-GB')
        };
        return updated;
      } else {
        const newRecord: MealRecord = {
          id: `meal-${record.memberId}-${record.date}`,
          date: record.date,
          memberId: record.memberId,
          memberName,
          breakfast: record.breakfast ?? 1,
          lunch: record.lunch ?? 1,
          dinner: record.dinner ?? 1,
          guestMeals: record.guestMeals ?? 0,
          updatedAt: new Date().toLocaleString('en-GB')
        };
        return [...prev, newRecord];
      }
    });
  };

  const updateMealInfo = (info: MealInfo) => {
    setMealInfos(prev => {
      const idx = prev.findIndex(m => m.date === info.date && m.mealType === info.mealType);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = info;
        return updated;
      }
      return [...prev, info];
    });
    logActivity('Updated Meal Menu', `Manager updated ${info.mealType} menu for ${info.date}`);
  };

  // --- Meal Request Workflow (Core Feature) ---
  const submitMealRequest = (req: Omit<MealRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: MealRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'PENDING',
      submittedAt: new Date().toLocaleString('en-GB')
    };

    setMealRequests(prev => [newReq, ...prev]);
    logActivity('Submitted Meal Request', `${req.memberName} requested ${req.requestType === 'EXTRA_MEAL' ? `+${req.extraCount} Extra ${req.mealType}` : `Removal of ${req.mealType}`} on ${req.date}`);
    notify('New Meal Request', `${req.memberName} submitted a ${req.requestType === 'EXTRA_MEAL' ? 'Extra Meal' : 'Meal Removal'} request for ${req.date}.`, 'INFO', 'user-manager');
  };

  const reviewMealRequest = (requestId: string, status: RequestStatus, responseNote?: string) => {
    const target = mealRequests.find(r => r.id === requestId);
    if (!target) return;

    // AUTOMATED MEAL UPDATING ON APPROVAL
    if (status === 'APPROVED') {
      const { memberId, date, mealType, requestType, extraCount } = target;

      setMeals(prev => {
        const idx = prev.findIndex(m => m.memberId === memberId && m.date === date);
        const member = users.find(u => u.id === memberId);
        const memberName = member?.name || 'Member';

        let currentRecord = idx >= 0 ? { ...prev[idx] } : {
          id: `meal-${memberId}-${date}`,
          date,
          memberId,
          memberName,
          breakfast: 1,
          lunch: 1,
          dinner: 1,
          guestMeals: 0,
          updatedAt: new Date().toLocaleString('en-GB')
        };

        if (requestType === 'EXTRA_MEAL') {
          // Add extra guest meals or increment meal count
          currentRecord.guestMeals = (currentRecord.guestMeals || 0) + (extraCount || 1);
        } else if (requestType === 'MEAL_REMOVAL') {
          // Set meal type to 0
          if (mealType === 'BREAKFAST') currentRecord.breakfast = 0;
          if (mealType === 'LUNCH') currentRecord.lunch = 0;
          if (mealType === 'DINNER') currentRecord.dinner = 0;
        }

        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = currentRecord;
          return updated;
        } else {
          return [...prev, currentRecord];
        }
      });
    }

    // Update Request status
    setMealRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status,
          responseNote: responseNote || (status === 'APPROVED' ? 'Approved by Manager' : 'Declined by Manager'),
          reviewedAt: new Date().toLocaleString('en-GB'),
          reviewedBy: currentUser?.name || 'Manager'
        };
      }
      return r;
    }));

    logActivity('Reviewed Meal Request', `Manager ${status.toLowerCase()} request #${requestId} from ${target.memberName}`);
    notify(`Meal Request ${status}`, `Your request for ${target.mealType} on ${target.date} was ${status.toLowerCase()} by Manager.`, status === 'APPROVED' ? 'SUCCESS' : 'WARNING', target.memberId);
  };

  // --- Bazar Actions ---
  const addBazarTrip = (trip: Omit<BazarTrip, 'id' | 'createdAt'>) => {
    const newTrip: BazarTrip = {
      ...trip,
      id: `bazar-${Date.now()}`,
      createdAt: new Date().toLocaleString('en-GB')
    };
    setBazarTrips(prev => [newTrip, ...prev]);
    logActivity('Added Bazar Record', `Manager logged bazar of ৳${trip.totalAmount} at ${trip.storeName}`);
  };

  const deleteBazarTrip = (id: string) => {
    setBazarTrips(prev => prev.filter(t => t.id !== id));
  };

  // --- Finance Actions ---
  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `trx-${Date.now()}`,
      createdAt: new Date().toLocaleString('en-GB')
    };
    setTransactions(prev => [newTx, ...prev]);
    logActivity('Recorded Payment', `Received ৳${tx.amount} deposit from ${tx.memberName || 'Member'} via ${tx.paymentMethod}`);
    if (tx.memberId) {
      notify('Payment Credited', `Your deposit of ৳${tx.amount} has been verified and added to your balance.`, 'SUCCESS', tx.memberId);
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExp: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
      createdAt: new Date().toLocaleString('en-GB')
    };
    setExpenses(prev => [newExp, ...prev]);
    logActivity('Recorded Utility Expense', `Manager recorded ${expense.category} expense of ৳${expense.amount}`);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // --- Duties & Notices ---
  const saveResponsibility = (res: ResponsibilityAssignment) => {
    setResponsibilities(prev => {
      const idx = prev.findIndex(r => r.date === res.date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = res;
        return updated;
      }
      return [res, ...prev];
    });
    logActivity('Assigned Responsibilities', `Manager updated duties for ${res.date}`);
    notify('Duty Schedule Updated', `New duties assigned for ${res.date}.`, 'INFO');
  };

  const createAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toLocaleString('en-GB')
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logActivity('Published Announcement', `Manager posted notice: "${ann.title}"`);
    notify('New Announcement', ann.title, 'INFO');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const updateSettings = (newSettings: MessSettings) => {
    setSettings(newSettings);
    logActivity('Updated Mess Settings', 'Manager updated mess details and calculation preferences');
  };

  const resetAllToDemo = () => {
    StorageService.resetToDemo();
    window.location.reload();
  };

  const exportBackup = () => StorageService.exportAllData();

  const importBackup = (json: string) => {
    const ok = StorageService.importAllData(json);
    if (ok) window.location.reload();
    return ok;
  };

  return (
    <MessContext.Provider
      value={{
        settings,
        users,
        meals,
        mealInfos,
        mealRequests,
        bazarTrips,
        transactions,
        expenses,
        responsibilities,
        announcements,
        notifications,
        activityLogs,
        overallStats,
        memberSummaries,
        myFinancialSummary,
        myMealRequests,
        myAssignedDuties,

        createMemberAccount,
        updateMemberAccount,
        toggleMemberStatus,
        updateMealRecord,
        updateMealInfo,
        submitMealRequest,
        reviewMealRequest,
        addBazarTrip,
        deleteBazarTrip,
        addTransaction,
        deleteTransaction,
        addExpense,
        deleteExpense,
        saveResponsibility,
        createAnnouncement,
        deleteAnnouncement,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateSettings,
        resetAllToDemo,
        exportBackup,
        importBackup
      }}
    >
      {children}
    </MessContext.Provider>
  );
};

export const useMess = () => {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
};
