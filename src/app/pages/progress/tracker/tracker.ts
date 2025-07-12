import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WorkoutLog {
  date: string;
  note: string;
  xp: number;
  type: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  current: number;
}

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  period: 'weekly' | 'monthly';
  type: 'workouts' | 'streak' | 'xp';
}

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracker.html',
  styleUrl: './tracker.scss'
})
export class Tracker implements OnInit {
  workoutNote = '';
  workoutType = 'general';
  logs: WorkoutLog[] = [];
  
  // Gamification stats
  totalXP = 0;
  level = 1;
  currentStreak = 0;
  longestStreak = 0;
  totalWorkouts = 0;
  
  // XP requirements for levels
  xpForNextLevel = 100;
  
  // Available workout types
  workoutTypes = [
    { value: 'general', label: 'General Workout', xp: 10 },
    { value: 'cardio', label: 'Cardio', xp: 15 },
    { value: 'strength', label: 'Strength Training', xp: 20 },
    { value: 'yoga', label: 'Yoga/Flexibility', xp: 8 },
    { value: 'sports', label: 'Sports', xp: 12 },
    { value: 'long', label: 'Long Session (1hr+)', xp: 25 }
  ];

  // Achievements
  achievements: Achievement[] = [
    { id: 'first', name: 'First Steps', description: 'Complete your first workout', icon: '🎯', unlocked: false, requirement: 1, current: 0 },
    { id: 'streak3', name: 'Getting Started', description: '3-day workout streak', icon: '🔥', unlocked: false, requirement: 3, current: 0 },
    { id: 'streak7', name: 'Week Warrior', description: '7-day workout streak', icon: '⚡', unlocked: false, requirement: 7, current: 0 },
    { id: 'streak30', name: 'Month Master', description: '30-day workout streak', icon: '👑', unlocked: false, requirement: 30, current: 0 },
    { id: 'workouts10', name: 'Dedicated', description: 'Complete 10 workouts', icon: '💪', unlocked: false, requirement: 10, current: 0 },
    { id: 'workouts50', name: 'Fitness Fanatic', description: 'Complete 50 workouts', icon: '🏆', unlocked: false, requirement: 50, current: 0 },
    { id: 'level5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', unlocked: false, requirement: 5, current: 1 },
    { id: 'level10', name: 'Elite Athlete', description: 'Reach level 10', icon: '🌟', unlocked: false, requirement: 10, current: 1 }
  ];

  // Goals
  goals: Goal[] = [
    { id: 'weekly_workouts', name: 'Weekly Workouts', target: 5, current: 0, period: 'weekly', type: 'workouts' },
    { id: 'weekly_xp', name: 'Weekly XP Goal', target: 100, current: 0, period: 'weekly', type: 'xp' },
    { id: 'monthly_streak', name: 'Monthly Streak Goal', target: 15, current: 0, period: 'monthly', type: 'streak' }
  ];

  ngOnInit() {
    this.loadData();
    this.updateStats();
  }

  addLog() {
    if (!this.workoutNote.trim()) return;
    
    const selectedType = this.workoutTypes.find(t => t.value === this.workoutType);
    const xp = selectedType ? selectedType.xp : 10;
    
    this.logs.unshift({
      date: new Date().toLocaleDateString(),
      note: this.workoutNote.trim(),
      xp: xp,
      type: this.workoutType
    });
    
    this.workoutNote = '';
    this.updateStats();
    this.checkAchievements();
    this.saveData();
  }

  deleteLog(idx: number) {
    this.logs.splice(idx, 1);
    this.updateStats();
    this.saveData();
  }

  updateStats() {
    this.totalWorkouts = this.logs.length;
    this.totalXP = this.logs.reduce((sum, log) => sum + log.xp, 0);
    this.calculateLevel();
    this.calculateStreak();
    this.updateGoals();
  }

  calculateLevel() {
    let xpNeeded = 0;
    let newLevel = 1;
    
    for (let lvl = 1; lvl <= 100; lvl++) {
      const xpForLevel = lvl * 100; // 100 XP per level
      if (this.totalXP >= xpNeeded) {
        newLevel = lvl;
        xpNeeded += xpForLevel;
      } else {
        break;
      }
    }
    
    this.level = newLevel;
    this.xpForNextLevel = this.level * 100;
  }

  calculateStreak() {
    if (this.logs.length === 0) {
      this.currentStreak = 0;
      return;
    }

    let streak = 0;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if there's a workout today
    const todayStr = today.toLocaleDateString();
    const hasToday = this.logs.some(log => log.date === todayStr);
    
    if (hasToday) {
      streak = 1;
      
      // Count consecutive days backwards
      for (let i = 1; i <= 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const checkDateStr = checkDate.toLocaleDateString();
        
        const hasWorkout = this.logs.some(log => log.date === checkDateStr);
        if (hasWorkout) {
          streak++;
        } else {
          break;
        }
      }
    }

    this.currentStreak = streak;
    if (streak > this.longestStreak) {
      this.longestStreak = streak;
    }
  }

  updateGoals() {
    // Weekly goals
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekWorkouts = this.logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= weekStart;
    }).length;
    
    const weekXP = weekWorkouts * 15; // Average XP per workout
    
    this.goals[0].current = weekWorkouts;
    this.goals[1].current = weekXP;
    this.goals[2].current = this.currentStreak;
  }

  checkAchievements() {
    // Update achievement progress
    this.achievements[0].current = this.totalWorkouts; // First workout
    this.achievements[1].current = this.currentStreak; // 3-day streak
    this.achievements[2].current = this.currentStreak; // 7-day streak
    this.achievements[3].current = this.currentStreak; // 30-day streak
    this.achievements[4].current = this.totalWorkouts; // 10 workouts
    this.achievements[5].current = this.totalWorkouts; // 50 workouts
    this.achievements[6].current = this.level; // Level 5
    this.achievements[7].current = this.level; // Level 10

    // Check if achievements are unlocked
    this.achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.current >= achievement.requirement) {
        achievement.unlocked = true;
        this.showAchievementNotification(achievement);
      }
    });
  }

  showAchievementNotification(achievement: Achievement) {
    // Simple notification - you could enhance this with a toast service
    console.log(`🎉 Achievement Unlocked: ${achievement.name} - ${achievement.description}`);
  }

  getLevelProgress(): number {
    const xpInCurrentLevel = this.totalXP - ((this.level - 1) * 100);
    return Math.min(100, (xpInCurrentLevel / this.xpForNextLevel) * 100);
  }

  getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(a => a.unlocked);
  }

  getLockedAchievements(): Achievement[] {
    return this.achievements.filter(a => !a.unlocked);
  }

  getWorkoutTypeLabel(type: string): string {
    const workoutType = this.workoutTypes.find(t => t.value === type);
    return workoutType ? workoutType.label : 'Unknown';
  }

  getGoalProgress(current: number, target: number): number {
    return Math.min(100, (current / target) * 100);
  }

  getAchievementProgress(current: number, requirement: number): number {
    return Math.min(100, (current / requirement) * 100);
  }

  private saveData() {
    const data = {
      logs: this.logs,
      totalXP: this.totalXP,
      level: this.level,
      currentStreak: this.currentStreak,
      longestStreak: this.longestStreak,
      totalWorkouts: this.totalWorkouts,
      achievements: this.achievements
    };
    localStorage.setItem('fitzone-tracker-data', JSON.stringify(data));
  }

  private loadData() {
    const saved = localStorage.getItem('fitzone-tracker-data');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.logs = data.logs || [];
        this.totalXP = data.totalXP || 0;
        this.level = data.level || 1;
        this.currentStreak = data.currentStreak || 0;
        this.longestStreak = data.longestStreak || 0;
        this.totalWorkouts = data.totalWorkouts || 0;
        this.achievements = data.achievements || this.achievements;
      } catch (e) {
        console.error('Error loading tracker data:', e);
      }
    }
  }
}
