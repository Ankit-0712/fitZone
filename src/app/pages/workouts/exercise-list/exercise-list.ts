import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Exercise {
  name: string;
  description: string;
  formGuidance: string;
}

@Component({
  selector: 'app-exercise-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercise-list.html',
  styleUrl: './exercise-list.scss'
})
export class ExerciseList {
  exercises: Exercise[] = [
    {
      name: 'Push-Up',
      description: 'A basic upper body exercise that works the chest, shoulders, and triceps.',
      formGuidance: 'Keep your body straight, lower yourself until your chest nearly touches the floor, and push back up.'
    },
    {
      name: 'Squat',
      description: 'A fundamental lower body exercise that targets the quads, glutes, and hamstrings.',
      formGuidance: 'Keep your chest up, back straight, and lower down as if sitting in a chair. Knees should not go past toes.'
    },
    {
      name: 'Plank',
      description: 'A core exercise that strengthens the abs, back, and shoulders.',
      formGuidance: 'Keep your body in a straight line from head to heels, elbows under shoulders, and hold.'
    }
  ];

  selectedExercise: Exercise | null = null;

  selectExercise(exercise: Exercise) {
    this.selectedExercise = exercise;
  }
}
