import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-plan-builder',
  standalone: true,
  imports: [CommonModule, FormsModule], // 👈 this line is critical
  templateUrl: './plan-builder.html',
  styleUrls: ['./plan-builder.scss']
})
export class PlanBuilder {
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  categoryList: string[] = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Cardio'];
  
  exercisesMap: { [key: string]: string[] } = {
    Chest: ['Push Ups', 'Bench Press', 'Chest Fly'],
    Back: ['Pull Ups', 'Deadlifts', 'Seated Row'],
    Legs: ['Squats', 'Lunges', 'Leg Press'],
    Shoulders: ['Shoulder Press', 'Lateral Raise', 'Front Raise'],
    Arms: ['Bicep Curl', 'Triceps Dip', 'Hammer Curl'],
    Cardio: ['Running', 'Jump Rope', 'Cycling']
  };

  selectedDay: string = 'Monday';
  selectedCategory: string = '';
  selectedExercise: string = '';
  workoutPlan: { [day: string]: string[] } = {};

  get exercisesForSelectedCategory(): string[] {
    return this.exercisesMap[this.selectedCategory] || [];
  }

  addExercise(): void {
    if (!this.selectedDay || !this.selectedExercise) return;

    if (!this.workoutPlan[this.selectedDay]) {
      this.workoutPlan[this.selectedDay] = [];
    }

    if (!this.workoutPlan[this.selectedDay].includes(this.selectedExercise)) {
      this.workoutPlan[this.selectedDay].push(this.selectedExercise);
    }

    this.selectedExercise = '';
  }

  removeExercise(day: string, exercise: string): void {
    const index = this.workoutPlan[day].indexOf(exercise);
    if (index > -1) {
      this.workoutPlan[day].splice(index, 1);
    }
  }

  hasAnyPlan(): boolean {
    return Object.values(this.workoutPlan).some(day => day.length > 0);
  }

  downloadFullPlanAsPDF(): void {
    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text('Weekly Workout Plan', 10, y);
    y += 10;

    this.daysOfWeek.forEach(day => {
      const exercises = this.workoutPlan[day];
      if (exercises?.length) {
        doc.setFontSize(14);
        doc.text(`${day}:`, 10, y);
        y += 7;

        exercises.forEach(ex => {
          doc.setFontSize(12);
          doc.text(`• ${ex}`, 15, y);
          y += 7;

          if (y > 280) {
            doc.addPage();
            y = 10;
          }
        });

        y += 5;
      }
    });

    doc.save('Workout-Plan.pdf');
  }
}
