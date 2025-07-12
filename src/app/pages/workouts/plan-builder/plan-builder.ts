import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';

interface Exercise {
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  muscleGroups: string[];
  description: string;
  sets?: number;
  reps?: number;
  duration?: string;
}

interface WorkoutDay {
  day: string;
  exercises: Exercise[];
  focus: string;
  estimatedTime: string;
}

interface PlanTemplate {
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  focus: string[];
  icon: string;
}

@Component({
  selector: 'app-plan-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plan-builder.html',
  styleUrls: ['./plan-builder.scss']
})
export class PlanBuilder {
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Enhanced exercise data
  exercises: Exercise[] = [
    // Chest Exercises
    { name: 'Push Ups', category: 'Chest', difficulty: 'Beginner', equipment: ['Bodyweight'], muscleGroups: ['Chest', 'Triceps', 'Shoulders'], description: 'Classic bodyweight exercise for chest strength' },
    { name: 'Bench Press', category: 'Chest', difficulty: 'Intermediate', equipment: ['Barbell', 'Bench'], muscleGroups: ['Chest', 'Triceps', 'Shoulders'], description: 'Compound movement for chest development' },
    { name: 'Chest Fly', category: 'Chest', difficulty: 'Beginner', equipment: ['Dumbbells'], muscleGroups: ['Chest'], description: 'Isolation exercise for chest muscles' },
    { name: 'Incline Press', category: 'Chest', difficulty: 'Intermediate', equipment: ['Dumbbells', 'Bench'], muscleGroups: ['Upper Chest', 'Shoulders'], description: 'Targets upper chest development' },
    
    // Back Exercises
    { name: 'Pull Ups', category: 'Back', difficulty: 'Advanced', equipment: ['Pull-up Bar'], muscleGroups: ['Back', 'Biceps'], description: 'Upper body pulling movement' },
    { name: 'Deadlifts', category: 'Back', difficulty: 'Advanced', equipment: ['Barbell'], muscleGroups: ['Back', 'Legs', 'Core'], description: 'Full body compound exercise' },
    { name: 'Seated Row', category: 'Back', difficulty: 'Beginner', equipment: ['Cable Machine'], muscleGroups: ['Back', 'Biceps'], description: 'Machine-based back exercise' },
    { name: 'Lat Pulldown', category: 'Back', difficulty: 'Beginner', equipment: ['Cable Machine'], muscleGroups: ['Back', 'Biceps'], description: 'Assisted pull-up movement' },
    
    // Legs Exercises
    { name: 'Squats', category: 'Legs', difficulty: 'Beginner', equipment: ['Bodyweight'], muscleGroups: ['Quadriceps', 'Glutes', 'Core'], description: 'Fundamental lower body movement' },
    { name: 'Lunges', category: 'Legs', difficulty: 'Beginner', equipment: ['Bodyweight'], muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'], description: 'Unilateral leg exercise' },
    { name: 'Leg Press', category: 'Legs', difficulty: 'Intermediate', equipment: ['Leg Press Machine'], muscleGroups: ['Quadriceps', 'Glutes'], description: 'Machine-based leg exercise' },
    { name: 'Romanian Deadlift', category: 'Legs', difficulty: 'Intermediate', equipment: ['Dumbbells'], muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'], description: 'Hip hinge movement' },
    
    // Shoulders Exercises
    { name: 'Shoulder Press', category: 'Shoulders', difficulty: 'Intermediate', equipment: ['Dumbbells'], muscleGroups: ['Shoulders', 'Triceps'], description: 'Overhead pressing movement' },
    { name: 'Lateral Raise', category: 'Shoulders', difficulty: 'Beginner', equipment: ['Dumbbells'], muscleGroups: ['Shoulders'], description: 'Isolation for lateral deltoids' },
    { name: 'Front Raise', category: 'Shoulders', difficulty: 'Beginner', equipment: ['Dumbbells'], muscleGroups: ['Shoulders'], description: 'Isolation for anterior deltoids' },
    { name: 'Upright Row', category: 'Shoulders', difficulty: 'Intermediate', equipment: ['Barbell'], muscleGroups: ['Shoulders', 'Traps'], description: 'Compound shoulder movement' },
    
    // Arms Exercises
    { name: 'Bicep Curl', category: 'Arms', difficulty: 'Beginner', equipment: ['Dumbbells'], muscleGroups: ['Biceps'], description: 'Classic bicep isolation' },
    { name: 'Triceps Dip', category: 'Arms', difficulty: 'Intermediate', equipment: ['Dip Bars'], muscleGroups: ['Triceps', 'Chest'], description: 'Bodyweight tricep exercise' },
    { name: 'Hammer Curl', category: 'Arms', difficulty: 'Beginner', equipment: ['Dumbbells'], muscleGroups: ['Biceps', 'Forearms'], description: 'Neutral grip curl variation' },
    { name: 'Skull Crushers', category: 'Arms', difficulty: 'Intermediate', equipment: ['Dumbbells'], muscleGroups: ['Triceps'], description: 'Lying tricep extension' },
    
    // Cardio Exercises
    { name: 'Running', category: 'Cardio', difficulty: 'Beginner', equipment: ['None'], muscleGroups: ['Cardiovascular'], description: 'High-intensity cardiovascular exercise', duration: '30-60 min' },
    { name: 'Jump Rope', category: 'Cardio', difficulty: 'Beginner', equipment: ['Jump Rope'], muscleGroups: ['Cardiovascular', 'Calves'], description: 'High-intensity cardio with coordination', duration: '15-30 min' },
    { name: 'Cycling', category: 'Cardio', difficulty: 'Beginner', equipment: ['Bicycle'], muscleGroups: ['Cardiovascular', 'Legs'], description: 'Low-impact cardiovascular exercise', duration: '30-60 min' },
    { name: 'Burpees', category: 'Cardio', difficulty: 'Advanced', equipment: ['Bodyweight'], muscleGroups: ['Full Body'], description: 'High-intensity full body movement', duration: '10-20 min' }
  ];

  // Plan templates
  planTemplates: PlanTemplate[] = [
    { name: 'Beginner Full Body', description: 'Perfect for fitness newcomers', difficulty: 'Beginner', duration: '4 weeks', focus: ['Full Body', 'Strength'], icon: '💪' },
    { name: 'Intermediate Split', description: 'Advanced muscle group targeting', difficulty: 'Intermediate', duration: '6 weeks', focus: ['Muscle Building', 'Strength'], icon: '🏋️‍♂️' },
    { name: 'Cardio Focus', description: 'Improve cardiovascular fitness', difficulty: 'Beginner', duration: '4 weeks', focus: ['Cardio', 'Endurance'], icon: '❤️' },
    { name: 'Strength Builder', description: 'Build maximum strength', difficulty: 'Advanced', duration: '8 weeks', focus: ['Strength', 'Power'], icon: '🔥' }
  ];

  selectedDay: string = 'Monday';
  selectedCategory: string = '';
  selectedExercise: string = '';
  workoutPlan: { [day: string]: WorkoutDay } = {};
  showTemplates: boolean = false;
  activeTab: 'builder' | 'templates' | 'plan' = 'builder';

  get exercisesForSelectedCategory(): Exercise[] {
    return this.exercises.filter(ex => ex.category === this.selectedCategory);
  }

  get categoryList(): string[] {
    return [...new Set(this.exercises.map(ex => ex.category))];
  }

  get selectedExerciseDetails(): Exercise | null {
    return this.exercises.find(ex => ex.name === this.selectedExercise) || null;
  }

  get totalExercises(): number {
    return Object.values(this.workoutPlan).reduce((total, day) => total + day.exercises.length, 0);
  }

  get estimatedTotalTime(): string {
    const totalMinutes = Object.values(this.workoutPlan).reduce((total, day) => {
      return total + this.calculateDayTime(day);
    }, 0);
    return `${Math.round(totalMinutes)} min`;
  }

  get workoutDaysCount(): number {
    return Object.keys(this.workoutPlan).length;
  }

  hasExercisesForDay(day: string): boolean {
    return this.workoutPlan[day]?.exercises?.length > 0;
  }

  hasExercisesForSelectedDay(): boolean {
    return this.workoutPlan[this.selectedDay]?.exercises?.length > 0;
  }

  getSelectedDayPlan() {
    return this.workoutPlan[this.selectedDay];
  }

  getDayPlan(day: string) {
    return this.workoutPlan[day];
  }

  addExercise(): void {
    if (!this.selectedDay || !this.selectedExercise) return;

    const exercise = this.exercises.find(ex => ex.name === this.selectedExercise);
    if (!exercise) return;

    if (!this.workoutPlan[this.selectedDay]) {
      this.workoutPlan[this.selectedDay] = {
        day: this.selectedDay,
        exercises: [],
        focus: this.selectedCategory,
        estimatedTime: '0 min'
      };
    }

    if (!this.workoutPlan[this.selectedDay].exercises.find(ex => ex.name === exercise.name)) {
      this.workoutPlan[this.selectedDay].exercises.push(exercise);
      this.updateDayTime(this.selectedDay);
    }

    this.selectedExercise = '';
  }

  removeExercise(day: string, exerciseName: string): void {
    if (this.workoutPlan[day]) {
      this.workoutPlan[day].exercises = this.workoutPlan[day].exercises.filter(ex => ex.name !== exerciseName);
      this.updateDayTime(day);
      
      if (this.workoutPlan[day].exercises.length === 0) {
        delete this.workoutPlan[day];
      }
    }
  }

  applyTemplate(template: PlanTemplate): void {
    this.workoutPlan = {};
    
    // Create a basic template structure
    const focusAreas = template.focus;
    const exercisesPerDay = 3;
    
    this.daysOfWeek.slice(0, 5).forEach((day, index) => {
      const focus = focusAreas[index % focusAreas.length];
      const dayExercises = this.exercises
        .filter(ex => ex.category.toLowerCase().includes(focus.toLowerCase()) || focus.toLowerCase().includes('full'))
        .slice(0, exercisesPerDay);
      
      if (dayExercises.length > 0) {
        this.workoutPlan[day] = {
          day: day,
          exercises: dayExercises,
          focus: focus,
          estimatedTime: this.calculateDayTime({ exercises: dayExercises }).toString() + ' min'
        };
      }
    });
    
    this.showTemplates = false;
    this.activeTab = 'plan';
  }

  calculateDayTime(day: WorkoutDay | { exercises: Exercise[] }): number {
    return day.exercises.reduce((total, exercise) => {
      if (exercise.duration) {
        const timeStr = exercise.duration.replace(/\D/g, '');
        return total + parseInt(timeStr) || 15;
      }
      return total + 15; // Default 15 minutes per exercise
    }, 0);
  }

  updateDayTime(day: string): void {
    if (this.workoutPlan[day]) {
      const time = this.calculateDayTime(this.workoutPlan[day]);
      this.workoutPlan[day].estimatedTime = `${time} min`;
    }
  }

  hasAnyPlan(): boolean {
    return Object.values(this.workoutPlan).some(day => day.exercises.length > 0);
  }

  clearPlan(): void {
    this.workoutPlan = {};
  }

  downloadFullPlanAsPDF(): void {
    const doc = new jsPDF();
    let y = 10;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(239, 68, 68);
    doc.text('FitZone Workout Plan', 10, y);
    y += 15;

    // Summary
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Exercises: ${this.totalExercises}`, 10, y);
    y += 7;
    doc.text(`Estimated Time: ${this.estimatedTotalTime}`, 10, y);
    y += 15;

    // Daily plans
    this.daysOfWeek.forEach(day => {
      const dayPlan = this.workoutPlan[day];
      if (dayPlan?.exercises.length) {
        doc.setFontSize(14);
        doc.setTextColor(239, 68, 68);
        doc.text(`${day} (${dayPlan.focus}) - ${dayPlan.estimatedTime}`, 10, y);
        y += 8;

        dayPlan.exercises.forEach(ex => {
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text(`• ${ex.name} (${ex.difficulty})`, 15, y);
          y += 6;

          if (y > 280) {
            doc.addPage();
            y = 10;
          }
        });

        y += 5;
      }
    });

    doc.save('FitZone-Workout-Plan.pdf');
  }
}
