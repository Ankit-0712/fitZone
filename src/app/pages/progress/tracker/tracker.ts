import { Component, NgZone, OnInit } from '@angular/core';
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

interface FoodItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface Meal {
  name: string;
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

interface MealPlan {
  breakfast: Meal;
  morningSnack: Meal;
  lunch: Meal;
  afternoonSnack: Meal;
  dinner: Meal;
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  healthTip: string;
}

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tracker.html',
  styleUrl: './tracker.scss',
  providers: [],
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

  // --- BMI Calculator ---
  bmiWeight: number | null = null;
  bmiHeight: number | null = null;
  bmiResult: string = '';
  bmiCategory: string = '';

  // --- Meal Planning ---
  mealPlan: MealPlan | null = null;
  userDetails = {
    age: 25,
    gender: 'male',
    weight: 70,
    height: 175,
    fitnessGoal: 'maintain',
    dietType: 'balanced',
    restrictions: 'none'
  };

  // Accordion state
  openSection: string = 'log';

  constructor(private ngZone: NgZone) {} 

  toggleSection(section: string) {
    this.openSection = this.openSection === section ? '' : section;
  }

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

  getAchievementProgress(current: number, requirement: number): number {
    return Math.min(100, (current / requirement) * 100);
  }

  // --- BMI Calculator ---
  calculateBMI() {
    if (!this.bmiWeight || !this.bmiHeight) {
      this.bmiResult = '';
      this.bmiCategory = '';
      return;
    }
    const heightM = this.bmiHeight / 100;
    const bmi = this.bmiWeight / (heightM * heightM);
    this.bmiResult = bmi.toFixed(1);
    if (bmi < 18.5) {
      this.bmiCategory = 'Underweight';
    } else if (bmi < 25) {
      this.bmiCategory = 'Normal weight';
    } else if (bmi < 30) {
      this.bmiCategory = 'Overweight';
    } else {
      this.bmiCategory = 'Obese';
    }
  }

  // --- Meal Planning ---
  generateMealPlan() {
    const bmr = this.calculateBMR();
    const tdee = this.calculateTDEE(bmr);
    const targetCalories = this.getTargetCalories(tdee);
    
    this.mealPlan = this.createMealPlan(targetCalories);
  }

  regenerateMealPlan() {
    if (this.mealPlan) {
      const bmr = this.calculateBMR();
      const tdee = this.calculateTDEE(bmr);
      const targetCalories = this.getTargetCalories(tdee);
      
      this.mealPlan = this.createMealPlan(targetCalories);
    }
  }

  private calculateBMR(): number {
    // Mifflin-St Jeor Equation
    if (this.userDetails.gender === 'male') {
      return 10 * this.userDetails.weight + 6.25 * this.userDetails.height - 5 * this.userDetails.age + 5;
    } else {
      return 10 * this.userDetails.weight + 6.25 * this.userDetails.height - 5 * this.userDetails.age - 161;
    }
  }

  private calculateTDEE(bmr: number): number {
    // Activity multiplier based on fitness goal
    const activityMultipliers = {
      'maintain': 1.55,
      'lose': 1.375,
      'gain': 1.725
    };
    return bmr * (activityMultipliers[this.userDetails.fitnessGoal as keyof typeof activityMultipliers] || 1.55);
  }

  private getTargetCalories(tdee: number): number {
    const adjustments = {
      'maintain': 0,
      'lose': -500,
      'gain': 500
    };
    return tdee + (adjustments[this.userDetails.fitnessGoal as keyof typeof adjustments] || 0);
  }

  private createMealPlan(targetCalories: number): MealPlan {
    const breakfast = this.createBreakfast(targetCalories * 0.25);
    const morningSnack = this.createSnack(targetCalories * 0.15);
    const lunch = this.createLunch(targetCalories * 0.3);
    const afternoonSnack = this.createSnack(targetCalories * 0.1);
    const dinner = this.createDinner(targetCalories * 0.2);

    const dailyTotals = {
      calories: breakfast.totalCalories + morningSnack.totalCalories + lunch.totalCalories + afternoonSnack.totalCalories + dinner.totalCalories,
      protein: breakfast.totalProtein + morningSnack.totalProtein + lunch.totalProtein + afternoonSnack.totalProtein + dinner.totalProtein,
      carbs: breakfast.totalCarbs + morningSnack.totalCarbs + lunch.totalCarbs + afternoonSnack.totalCarbs + dinner.totalCarbs,
      fats: breakfast.totalFats + morningSnack.totalFats + lunch.totalFats + afternoonSnack.totalFats + dinner.totalFats
    };

    const healthTips = [
      "Stay hydrated! Drink at least 8 glasses of water daily to support your metabolism and workout recovery.",
      "Include a variety of colorful vegetables in your meals for essential vitamins and antioxidants.",
      "Don't skip breakfast - it kickstarts your metabolism and provides energy for your day.",
      "Plan your meals ahead to avoid unhealthy last-minute food choices.",
      "Listen to your body's hunger cues and eat mindfully without distractions.",
      "Protein is essential for muscle repair and growth, especially after workouts.",
      "Complex carbs provide sustained energy throughout your day.",
      "Healthy fats support hormone production and nutrient absorption.",
      "Eat slowly and savor each bite to improve digestion and satisfaction.",
      "Include fiber-rich foods to support gut health and maintain stable blood sugar."
    ];

    return {
      breakfast,
      morningSnack,
      lunch,
      afternoonSnack,
      dinner,
      dailyTotals,
      healthTip: healthTips[Math.floor(Math.random() * healthTips.length)]
    };
  }

  private createBreakfast(targetCalories: number): Meal {
    const foods: FoodItem[] = [];
    let remainingCalories = targetCalories;

    // Different breakfast options based on user details
    const breakfastOptions = this.getBreakfastOptions();
    const selectedOption = breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)];

    // Add main breakfast item
    const mainCalories = Math.min(selectedOption.calories, remainingCalories * 0.6);
    foods.push({
      name: selectedOption.name,
      portion: selectedOption.portion,
      calories: mainCalories,
      protein: selectedOption.protein * (mainCalories / selectedOption.calories),
      carbs: selectedOption.carbs * (mainCalories / selectedOption.calories),
      fats: selectedOption.fats * (mainCalories / selectedOption.calories)
    });
    remainingCalories -= mainCalories;

    // Add fruit based on age and preferences
    if (remainingCalories > 60) {
      const fruitOptions = this.getFruitOptions();
      const selectedFruit = fruitOptions[Math.floor(Math.random() * fruitOptions.length)];
      foods.push({
        name: selectedFruit.name,
        portion: selectedFruit.portion,
        calories: selectedFruit.calories,
        protein: selectedFruit.protein,
        carbs: selectedFruit.carbs,
        fats: selectedFruit.fats
      });
      remainingCalories -= selectedFruit.calories;
    }

    // Add protein/fat source based on fitness goal
    if (remainingCalories > 40) {
      const proteinOptions = this.getProteinOptions();
      const selectedProtein = proteinOptions[Math.floor(Math.random() * proteinOptions.length)];
      foods.push({
        name: selectedProtein.name,
        portion: selectedProtein.portion,
        calories: selectedProtein.calories,
        protein: selectedProtein.protein,
        carbs: selectedProtein.carbs,
        fats: selectedProtein.fats
      });
    }

    return this.calculateMealTotals(foods);
  }

  private createSnack(targetCalories: number): Meal {
    const foods: FoodItem[] = [];
    
    // Different snack options based on user details
    const snackOptions = this.getSnackOptions();
    const selectedSnack = snackOptions[Math.floor(Math.random() * snackOptions.length)];
    
    if (targetCalories > 100) {
      // Add main snack
      foods.push({
        name: selectedSnack.main.name,
        portion: selectedSnack.main.portion,
        calories: selectedSnack.main.calories,
        protein: selectedSnack.main.protein,
        carbs: selectedSnack.main.carbs,
        fats: selectedSnack.main.fats
      });
      
      // Add complementary item
      const complementaryOptions = this.getComplementarySnackOptions();
      const selectedComplementary = complementaryOptions[Math.floor(Math.random() * complementaryOptions.length)];
      foods.push({
        name: selectedComplementary.name,
        portion: selectedComplementary.portion,
        calories: selectedComplementary.calories,
        protein: selectedComplementary.protein,
        carbs: selectedComplementary.carbs,
        fats: selectedComplementary.fats
      });
    } else {
      // Light snack
      const lightSnackOptions = this.getLightSnackOptions();
      const selectedLightSnack = lightSnackOptions[Math.floor(Math.random() * lightSnackOptions.length)];
      foods.push({
        name: selectedLightSnack.name,
        portion: selectedLightSnack.portion,
        calories: selectedLightSnack.calories,
        protein: selectedLightSnack.protein,
        carbs: selectedLightSnack.carbs,
        fats: selectedLightSnack.fats
      });
    }

    return this.calculateMealTotals(foods);
  }

  private createLunch(targetCalories: number): Meal {
    const foods: FoodItem[] = [];
    let remainingCalories = targetCalories;

    // Different lunch options based on user details
    const lunchOptions = this.getLunchOptions();
    const selectedLunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];

    // Add protein source
    const proteinCalories = Math.min(selectedLunch.protein.calories, remainingCalories * 0.4);
    foods.push({
      name: selectedLunch.protein.name,
      portion: selectedLunch.protein.portion,
      calories: proteinCalories,
      protein: selectedLunch.protein.protein * (proteinCalories / selectedLunch.protein.calories),
      carbs: selectedLunch.protein.carbs * (proteinCalories / selectedLunch.protein.calories),
      fats: selectedLunch.protein.fats * (proteinCalories / selectedLunch.protein.calories)
    });
    remainingCalories -= proteinCalories;

    // Add grain/carb source
    if (remainingCalories > 100) {
      const grainOptions = this.getGrainOptions();
      const selectedGrain = grainOptions[Math.floor(Math.random() * grainOptions.length)];
      foods.push({
        name: selectedGrain.name,
        portion: selectedGrain.portion,
        calories: selectedGrain.calories,
        protein: selectedGrain.protein,
        carbs: selectedGrain.carbs,
        fats: selectedGrain.fats
      });
      remainingCalories -= selectedGrain.calories;
    }

    // Add vegetables
    if (remainingCalories > 50) {
      const vegetableOptions = this.getVegetableOptions();
      const selectedVegetable = vegetableOptions[Math.floor(Math.random() * vegetableOptions.length)];
      foods.push({
        name: selectedVegetable.name,
        portion: selectedVegetable.portion,
        calories: selectedVegetable.calories,
        protein: selectedVegetable.protein,
        carbs: selectedVegetable.carbs,
        fats: selectedVegetable.fats
      });
    }

    return this.calculateMealTotals(foods);
  }

  private createDinner(targetCalories: number): Meal {
    const foods: FoodItem[] = [];
    let remainingCalories = targetCalories;

    // Different dinner options based on user details
    const dinnerOptions = this.getDinnerOptions();
    const selectedDinner = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)];

    // Add protein source
    const proteinCalories = Math.min(selectedDinner.protein.calories, remainingCalories * 0.5);
    foods.push({
      name: selectedDinner.protein.name,
      portion: selectedDinner.protein.portion,
      calories: proteinCalories,
      protein: selectedDinner.protein.protein * (proteinCalories / selectedDinner.protein.calories),
      carbs: selectedDinner.protein.carbs * (proteinCalories / selectedDinner.protein.calories),
      fats: selectedDinner.protein.fats * (proteinCalories / selectedDinner.protein.calories)
    });
    remainingCalories -= proteinCalories;

    // Add grain/carb source
    if (remainingCalories > 80) {
      const grainOptions = this.getGrainOptions();
      const selectedGrain = grainOptions[Math.floor(Math.random() * grainOptions.length)];
      foods.push({
        name: selectedGrain.name,
        portion: selectedGrain.portion,
        calories: selectedGrain.calories,
        protein: selectedGrain.protein,
        carbs: selectedGrain.carbs,
        fats: selectedGrain.fats
      });
      remainingCalories -= selectedGrain.calories;
    }

    // Add vegetables
    if (remainingCalories > 30) {
      const vegetableOptions = this.getVegetableOptions();
      const selectedVegetable = vegetableOptions[Math.floor(Math.random() * vegetableOptions.length)];
      foods.push({
        name: selectedVegetable.name,
        portion: selectedVegetable.portion,
        calories: selectedVegetable.calories,
        protein: selectedVegetable.protein,
        carbs: selectedVegetable.carbs,
        fats: selectedVegetable.fats
      });
    }

    return this.calculateMealTotals(foods);
  }

  private getBreakfastOptions() {
    const options = [];
    
    // Age-based options
    if (this.userDetails.age < 30) {
      options.push(
        { name: 'Protein Pancakes', portion: '3 medium', calories: 180, protein: 15, carbs: 20, fats: 6 },
        { name: 'Smoothie Bowl', portion: '1 large bowl', calories: 200, protein: 12, carbs: 25, fats: 8 },
        { name: 'Breakfast Burrito', portion: '1 medium', calories: 250, protein: 18, carbs: 22, fats: 12 }
      );
    } else if (this.userDetails.age < 50) {
      options.push(
        { name: 'Greek Yogurt Parfait', portion: '1 large', calories: 220, protein: 20, carbs: 18, fats: 10 },
        { name: 'Avocado Toast', portion: '2 slices', calories: 240, protein: 8, carbs: 24, fats: 16 },
        { name: 'Oatmeal with Berries', portion: '1 cup cooked', calories: 180, protein: 6, carbs: 32, fats: 4 }
      );
    } else {
      options.push(
        { name: 'Oatmeal with Nuts', portion: '1 cup cooked', calories: 200, protein: 8, carbs: 28, fats: 8 },
        { name: 'Whole Grain Toast', portion: '2 slices', calories: 160, protein: 6, carbs: 26, fats: 4 },
        { name: 'Cottage Cheese Bowl', portion: '1 cup', calories: 180, protein: 20, carbs: 8, fats: 6 }
      );
    }

    // Gender-based additions (respecting diet preferences)
    if (this.userDetails.gender === 'male') {
      if (this.userDetails.dietType === 'vegan') {
        options.push(
          { name: 'Tofu Scramble', portion: '1 cup', calories: 200, protein: 20, carbs: 8, fats: 12 },
          { name: 'Steel Cut Oats', portion: '1 cup cooked', calories: 160, protein: 6, carbs: 28, fats: 3 }
        );
      } else if (this.userDetails.dietType === 'vegetarian') {
        options.push(
          { name: 'Eggs and Cheese', portion: '3 eggs + 1 oz cheese', calories: 280, protein: 22, carbs: 2, fats: 20 },
          { name: 'Steel Cut Oats', portion: '1 cup cooked', calories: 160, protein: 6, carbs: 28, fats: 3 }
        );
      } else {
        options.push(
          { name: 'Eggs and Bacon', portion: '3 eggs + 2 strips', calories: 280, protein: 22, carbs: 2, fats: 20 },
          { name: 'Steel Cut Oats', portion: '1 cup cooked', calories: 160, protein: 6, carbs: 28, fats: 3 }
        );
      }
    } else {
      options.push(
        { name: 'Chia Pudding', portion: '1 cup', calories: 160, protein: 8, carbs: 20, fats: 8 },
        { name: 'Quinoa Breakfast Bowl', portion: '1 cup cooked', calories: 180, protein: 8, carbs: 30, fats: 4 }
      );
    }

    // Filter out non-vegetarian/vegan options based on diet preference
    if (this.userDetails.dietType === 'vegan') {
      return options.filter(option => 
        !['Greek Yogurt Parfait', 'Cottage Cheese Bowl', 'Eggs and Bacon', 'Eggs and Cheese'].includes(option.name)
      );
    } else if (this.userDetails.dietType === 'vegetarian') {
      return options.filter(option => 
        !['Eggs and Bacon'].includes(option.name)
      );
    }

    return options;
  }

  private getFruitOptions() {
    const fruits = [
      { name: 'Banana', portion: '1 medium', calories: 50, protein: 0.5, carbs: 12, fats: 0.2 },
      { name: 'Apple', portion: '1 medium', calories: 45, protein: 0.3, carbs: 11, fats: 0.2 },
      { name: 'Orange', portion: '1 medium', calories: 60, protein: 0.8, carbs: 14, fats: 0.2 },
      { name: 'Strawberries', portion: '1 cup', calories: 40, protein: 0.8, carbs: 9, fats: 0.3 },
      { name: 'Blueberries', portion: '1/2 cup', calories: 35, protein: 0.4, carbs: 8, fats: 0.2 },
      { name: 'Grapefruit', portion: '1/2 medium', calories: 40, protein: 0.6, carbs: 9, fats: 0.1 }
    ];
    return fruits;
  }

  private getProteinOptions() {
    const options = [];
    
    if (this.userDetails.dietType === 'vegan') {
      if (this.userDetails.fitnessGoal === 'gain') {
        options.push(
          { name: 'Peanut Butter', portion: '2 tbsp', calories: 190, protein: 8, carbs: 6, fats: 16 },
          { name: 'Mixed Nuts', portion: '1/4 cup', calories: 180, protein: 6, carbs: 6, fats: 16 },
          { name: 'Tahini', portion: '2 tbsp', calories: 180, protein: 6, carbs: 6, fats: 16 }
        );
      } else {
        options.push(
          { name: 'Almonds', portion: '10 pieces', calories: 70, protein: 3, carbs: 2, fats: 6 },
          { name: 'Walnuts', portion: '8 pieces', calories: 80, protein: 2, carbs: 2, fats: 8 },
          { name: 'Sunflower Seeds', portion: '2 tbsp', calories: 60, protein: 2, carbs: 2, fats: 5 },
          { name: 'Pumpkin Seeds', portion: '2 tbsp', calories: 80, protein: 4, carbs: 2, fats: 7 }
        );
      }
    } else if (this.userDetails.dietType === 'vegetarian') {
      if (this.userDetails.fitnessGoal === 'gain') {
        options.push(
          { name: 'Peanut Butter', portion: '2 tbsp', calories: 190, protein: 8, carbs: 6, fats: 16 },
          { name: 'Mixed Nuts', portion: '1/4 cup', calories: 180, protein: 6, carbs: 6, fats: 16 },
          { name: 'Cheese Cubes', portion: '1 oz', calories: 110, protein: 7, carbs: 1, fats: 9 }
        );
      } else {
        options.push(
          { name: 'Almonds', portion: '10 pieces', calories: 70, protein: 3, carbs: 2, fats: 6 },
          { name: 'Walnuts', portion: '8 pieces', calories: 80, protein: 2, carbs: 2, fats: 8 },
          { name: 'Sunflower Seeds', portion: '2 tbsp', calories: 60, protein: 2, carbs: 2, fats: 5 },
          { name: 'Cheese Cubes', portion: '1/2 oz', calories: 55, protein: 3.5, carbs: 0.5, fats: 4.5 }
        );
      }
    } else {
      if (this.userDetails.fitnessGoal === 'gain') {
        options.push(
          { name: 'Peanut Butter', portion: '2 tbsp', calories: 190, protein: 8, carbs: 6, fats: 16 },
          { name: 'Mixed Nuts', portion: '1/4 cup', calories: 180, protein: 6, carbs: 6, fats: 16 }
        );
      } else {
        options.push(
          { name: 'Almonds', portion: '10 pieces', calories: 70, protein: 3, carbs: 2, fats: 6 },
          { name: 'Walnuts', portion: '8 pieces', calories: 80, protein: 2, carbs: 2, fats: 8 },
          { name: 'Sunflower Seeds', portion: '2 tbsp', calories: 60, protein: 2, carbs: 2, fats: 5 }
        );
      }
    }
    
    return options;
  }

  private getSnackOptions() {
    const options = [];
    
    // Check diet type first, then consider fitness goals
    if (this.userDetails.dietType === 'vegan') {
      if (this.userDetails.fitnessGoal === 'gain') {
        options.push({
          main: { name: 'Tempeh', portion: '2 oz', calories: 120, protein: 20, carbs: 6, fats: 4 },
          complementary: { name: 'Almonds', portion: '10 pieces', calories: 70, protein: 3, carbs: 2, fats: 6 }
        });
      } else if (this.userDetails.fitnessGoal === 'lose') {
        options.push({
          main: { name: 'Avocado', portion: '1/2 medium', calories: 120, protein: 1.5, carbs: 6, fats: 11 },
          complementary: { name: 'Celery Sticks', portion: '3 medium', calories: 15, protein: 1, carbs: 3, fats: 0.2 }
        });
      } else {
        options.push(
          {
            main: { name: 'Hummus', portion: '1/4 cup', calories: 100, protein: 4, carbs: 12, fats: 6 },
            complementary: { name: 'Apple', portion: '1 medium', calories: 50, protein: 0.3, carbs: 12, fats: 0.2 }
          },
          {
            main: { name: 'Edamame', portion: '1/2 cup', calories: 100, protein: 8, carbs: 8, fats: 4 },
            complementary: { name: 'Carrot Sticks', portion: '1 cup', calories: 50, protein: 1, carbs: 12, fats: 0.3 }
          }
        );
      }
    } else if (this.userDetails.dietType === 'vegetarian') {
      if (this.userDetails.fitnessGoal === 'gain') {
        options.push({
          main: { name: 'Greek Yogurt', portion: '1 cup', calories: 130, protein: 23, carbs: 9, fats: 0.5 },
          complementary: { name: 'Almonds', portion: '10 pieces', calories: 70, protein: 3, carbs: 2, fats: 6 }
        });
      } else if (this.userDetails.fitnessGoal === 'lose') {
        options.push({
          main: { name: 'Cheese Cubes', portion: '1 oz', calories: 110, protein: 7, carbs: 1, fats: 9 },
          complementary: { name: 'Celery Sticks', portion: '3 medium', calories: 15, protein: 1, carbs: 3, fats: 0.2 }
        });
      } else {
        options.push(
          {
            main: { name: 'Greek Yogurt', portion: '1/2 cup', calories: 80, protein: 15, carbs: 6, fats: 0.5 },
            complementary: { name: 'Apple', portion: '1 medium', calories: 50, protein: 0.3, carbs: 12, fats: 0.2 }
          },
          {
            main: { name: 'Hummus', portion: '1/4 cup', calories: 100, protein: 4, carbs: 12, fats: 6 },
            complementary: { name: 'Carrot Sticks', portion: '1 cup', calories: 50, protein: 1, carbs: 12, fats: 0.3 }
          }
        );
      }
    } else {
      // Non-vegetarian options
      if (this.userDetails.fitnessGoal === 'gain') {
        options.push({
          main: { name: 'Greek Yogurt', portion: '1 cup', calories: 130, protein: 23, carbs: 9, fats: 0.5 },
          complementary: { name: 'Almonds', portion: '10 pieces', calories: 70, protein: 3, carbs: 2, fats: 6 }
        });
      } else if (this.userDetails.fitnessGoal === 'lose') {
        options.push({
          main: { name: 'Cheese Cubes', portion: '1 oz', calories: 110, protein: 7, carbs: 1, fats: 9 },
          complementary: { name: 'Celery Sticks', portion: '3 medium', calories: 15, protein: 1, carbs: 3, fats: 0.2 }
        });
      } else {
        options.push(
          {
            main: { name: 'Greek Yogurt', portion: '1/2 cup', calories: 80, protein: 15, carbs: 6, fats: 0.5 },
            complementary: { name: 'Apple', portion: '1 medium', calories: 50, protein: 0.3, carbs: 12, fats: 0.2 }
          },
          {
            main: { name: 'Hummus', portion: '1/4 cup', calories: 100, protein: 4, carbs: 12, fats: 6 },
            complementary: { name: 'Carrot Sticks', portion: '1 cup', calories: 50, protein: 1, carbs: 12, fats: 0.3 }
          }
        );
      }
    }
    
    return options;
  }

  private getComplementarySnackOptions() {
    return [
      { name: 'Apple', portion: '1 medium', calories: 50, protein: 0.3, carbs: 12, fats: 0.2 },
      { name: 'Carrot Sticks', portion: '1 cup', calories: 50, protein: 1, carbs: 12, fats: 0.3 },
      { name: 'Celery Sticks', portion: '3 medium', calories: 15, protein: 1, carbs: 3, fats: 0.2 },
      { name: 'Cucumber Slices', portion: '1 cup', calories: 16, protein: 1, carbs: 4, fats: 0.2 }
    ];
  }

  private getLightSnackOptions() {
    return [
      { name: 'Carrot Sticks', portion: '1 cup', calories: 50, protein: 1, carbs: 12, fats: 0.3 },
      { name: 'Celery Sticks', portion: '3 medium', calories: 15, protein: 1, carbs: 3, fats: 0.2 },
      { name: 'Cucumber Slices', portion: '1 cup', calories: 16, protein: 1, carbs: 4, fats: 0.2 },
      { name: 'Bell Pepper Strips', portion: '1 medium', calories: 30, protein: 1, carbs: 7, fats: 0.3 }
    ];
  }

  private getLunchOptions() {
    const options = [];
    
    if (this.userDetails.dietType === 'vegetarian') {
      options.push({
        protein: { name: 'Tofu', portion: '4 oz grilled', calories: 120, protein: 12, carbs: 2, fats: 7 },
        grain: { name: 'Quinoa', portion: '1/2 cup cooked', calories: 110, protein: 4, carbs: 20, fats: 2 }
      });
    } else if (this.userDetails.dietType === 'vegan') {
      options.push({
        protein: { name: 'Lentils', portion: '1/2 cup cooked', calories: 115, protein: 9, carbs: 20, fats: 0.4 },
        grain: { name: 'Brown Rice', portion: '1/2 cup cooked', calories: 100, protein: 2, carbs: 22, fats: 0.8 }
      });
    } else {
      options.push(
        {
          protein: { name: 'Chicken Breast', portion: '4 oz grilled', calories: 180, protein: 35, carbs: 0, fats: 4 },
          grain: { name: 'Brown Rice', portion: '1/2 cup cooked', calories: 100, protein: 2, carbs: 22, fats: 0.8 }
        },
        {
          protein: { name: 'Turkey Breast', portion: '4 oz grilled', calories: 160, protein: 32, carbs: 0, fats: 3 },
          grain: { name: 'Quinoa', portion: '1/2 cup cooked', calories: 110, protein: 4, carbs: 20, fats: 2 }
        },
        {
          protein: { name: 'Salmon', portion: '3 oz grilled', calories: 155, protein: 22, carbs: 0, fats: 7 },
          grain: { name: 'Wild Rice', portion: '1/2 cup cooked', calories: 90, protein: 3, carbs: 18, fats: 0.7 }
        }
      );
    }
    
    return options;
  }

  private getDinnerOptions() {
    const options = [];
    
    if (this.userDetails.dietType === 'vegan') {
      if (this.userDetails.fitnessGoal === 'gain') {
        options.push({
          protein: { name: 'Tempeh', portion: '5 oz grilled', calories: 250, protein: 25, carbs: 15, fats: 12 },
          grain: { name: 'Sweet Potato', portion: '1 medium', calories: 120, protein: 2, carbs: 28, fats: 0.2 }
        });
      } else if (this.userDetails.fitnessGoal === 'lose') {
        options.push({
          protein: { name: 'Seitan', portion: '4 oz grilled', calories: 180, protein: 35, carbs: 8, fats: 2 },
          grain: { name: 'Cauliflower Rice', portion: '1 cup', calories: 25, protein: 2, carbs: 5, fats: 0.3 }
        });
      } else {
        options.push(
          {
            protein: { name: 'Lentils', portion: '1 cup cooked', calories: 230, protein: 18, carbs: 40, fats: 0.8 },
            grain: { name: 'Quinoa', portion: '1/3 cup cooked', calories: 80, protein: 3, carbs: 15, fats: 1.5 }
          },
          {
            protein: { name: 'Chickpeas', portion: '1 cup cooked', calories: 270, protein: 15, carbs: 45, fats: 4 },
            grain: { name: 'Brown Rice', portion: '1/3 cup cooked', calories: 70, protein: 1.5, carbs: 15, fats: 0.6 }
          },
          {
            protein: { name: 'Black Beans', portion: '1 cup cooked', calories: 220, protein: 15, carbs: 40, fats: 1 },
            grain: { name: 'Millet', portion: '1/3 cup cooked', calories: 75, protein: 2.5, carbs: 14, fats: 0.8 }
          }
        );
      }
    } else if (this.userDetails.dietType === 'vegetarian') {
      if (this.userDetails.fitnessGoal === 'gain') {
        options.push({
          protein: { name: 'Paneer', portion: '5 oz grilled', calories: 250, protein: 25, carbs: 2, fats: 18 },
          grain: { name: 'Sweet Potato', portion: '1 medium', calories: 120, protein: 2, carbs: 28, fats: 0.2 }
        });
      } else if (this.userDetails.fitnessGoal === 'lose') {
        options.push({
          protein: { name: 'Greek Yogurt', portion: '1 cup', calories: 130, protein: 23, carbs: 9, fats: 0.5 },
          grain: { name: 'Cauliflower Rice', portion: '1 cup', calories: 25, protein: 2, carbs: 5, fats: 0.3 }
        });
      } else {
        options.push(
          {
            protein: { name: 'Eggs', portion: '4 large', calories: 280, protein: 24, carbs: 2, fats: 20 },
            grain: { name: 'Quinoa', portion: '1/3 cup cooked', calories: 80, protein: 3, carbs: 15, fats: 1.5 }
          },
          {
            protein: { name: 'Cottage Cheese', portion: '1 cup', calories: 180, protein: 20, carbs: 8, fats: 6 },
            grain: { name: 'Brown Rice', portion: '1/3 cup cooked', calories: 70, protein: 1.5, carbs: 15, fats: 0.6 }
          },
          {
            protein: { name: 'Mozzarella', portion: '3 oz', calories: 240, protein: 24, carbs: 2, fats: 16 },
            grain: { name: 'Millet', portion: '1/3 cup cooked', calories: 75, protein: 2.5, carbs: 14, fats: 0.8 }
          }
        );
      }
    } else {
      if (this.userDetails.fitnessGoal === 'gain') {
        options.push({
          protein: { name: 'Beef Steak', portion: '5 oz grilled', calories: 250, protein: 35, carbs: 0, fats: 12 },
          grain: { name: 'Sweet Potato', portion: '1 medium', calories: 120, protein: 2, carbs: 28, fats: 0.2 }
        });
      } else if (this.userDetails.fitnessGoal === 'lose') {
        options.push({
          protein: { name: 'Tuna Steak', portion: '4 oz grilled', calories: 180, protein: 35, carbs: 0, fats: 4 },
          grain: { name: 'Cauliflower Rice', portion: '1 cup', calories: 25, protein: 2, carbs: 5, fats: 0.3 }
        });
      } else {
        options.push(
          {
            protein: { name: 'Salmon', portion: '4 oz grilled', calories: 200, protein: 28, carbs: 0, fats: 9 },
            grain: { name: 'Quinoa', portion: '1/3 cup cooked', calories: 80, protein: 3, carbs: 15, fats: 1.5 }
          },
          {
            protein: { name: 'Chicken Breast', portion: '4 oz grilled', calories: 180, protein: 35, carbs: 0, fats: 4 },
            grain: { name: 'Brown Rice', portion: '1/3 cup cooked', calories: 70, protein: 1.5, carbs: 15, fats: 0.6 }
          },
          {
            protein: { name: 'Cod', portion: '4 oz grilled', calories: 120, protein: 24, carbs: 0, fats: 1 },
            grain: { name: 'Millet', portion: '1/3 cup cooked', calories: 75, protein: 2.5, carbs: 14, fats: 0.8 }
          }
        );
      }
    }
    
    return options;
  }

  private getGrainOptions() {
    const grains = [
      { name: 'Brown Rice', portion: '1/2 cup cooked', calories: 100, protein: 2, carbs: 22, fats: 0.8 },
      { name: 'Quinoa', portion: '1/2 cup cooked', calories: 110, protein: 4, carbs: 20, fats: 2 },
      { name: 'Wild Rice', portion: '1/2 cup cooked', calories: 90, protein: 3, carbs: 18, fats: 0.7 },
      { name: 'Millet', portion: '1/2 cup cooked', calories: 110, protein: 3, carbs: 21, fats: 1 },
      { name: 'Farro', portion: '1/2 cup cooked', calories: 100, protein: 4, carbs: 20, fats: 0.5 },
      { name: 'Barley', portion: '1/2 cup cooked', calories: 95, protein: 2, carbs: 20, fats: 0.3 }
    ];
    return grains;
  }

  private getVegetableOptions() {
    const vegetables = [
      { name: 'Mixed Vegetables', portion: '1 cup steamed', calories: 50, protein: 3, carbs: 10, fats: 0.3 },
      { name: 'Spinach', portion: '2 cups raw', calories: 30, protein: 3, carbs: 5, fats: 0.5 },
      { name: 'Broccoli', portion: '1 cup steamed', calories: 35, protein: 3, carbs: 7, fats: 0.4 },
      { name: 'Cauliflower', portion: '1 cup steamed', calories: 25, protein: 2, carbs: 5, fats: 0.3 },
      { name: 'Bell Peppers', portion: '1 cup sliced', calories: 30, protein: 1, carbs: 7, fats: 0.3 },
      { name: 'Zucchini', portion: '1 cup sliced', calories: 20, protein: 1, carbs: 4, fats: 0.2 },
      { name: 'Asparagus', portion: '1 cup steamed', calories: 25, protein: 3, carbs: 4, fats: 0.2 },
      { name: 'Green Beans', portion: '1 cup steamed', calories: 30, protein: 2, carbs: 6, fats: 0.2 }
    ];
    return vegetables;
  }

  private calculateMealTotals(foods: FoodItem[]): Meal {
    const totalCalories = foods.reduce((sum, food) => sum + food.calories, 0);
    const totalProtein = foods.reduce((sum, food) => sum + food.protein, 0);
    const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);
    const totalFats = foods.reduce((sum, food) => sum + food.fats, 0);

    return {
      name: '',
      foods,
      totalCalories: Math.round(totalCalories),
      totalProtein: Math.round(totalProtein * 10) / 10,
      totalCarbs: Math.round(totalCarbs * 10) / 10,
      totalFats: Math.round(totalFats * 10) / 10
    };
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
