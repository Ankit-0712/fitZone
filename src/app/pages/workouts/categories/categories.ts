import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Exercise {
  name: string;
  description: string;
  animationUrl: string; // GIF or SVG
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  muscleGroups: string[];
}

interface Category {
  name: string;
  image: string;
  color: string;
  icon: string;
  exercises: Exercise[];
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss']
})
export class Categories {
  selectedCategory: Category | null = null;
  selectedExercise: Exercise | null = null;
  showModal = false;

  categories: Category[] = [
    {
      name: 'Chest',
      image: 'https://via.placeholder.com/80x80/ef4444/ffffff?text=💪',
      color: '#ef4444',
      icon: '💪',
      exercises: [
        {
          name: 'Push Ups',
          description: 'Classic bodyweight exercise for chest strength.',
          animationUrl: 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
          difficulty: 'Beginner' as const,
          equipment: ['Bodyweight'],
          muscleGroups: ['Chest', 'Triceps', 'Shoulders']
        },
        {
          name: 'Bench Press',
          description: 'Compound movement for chest development.',
          animationUrl: 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
          difficulty: 'Intermediate' as const,
          equipment: ['Barbell', 'Bench'],
          muscleGroups: ['Chest', 'Triceps', 'Shoulders']
        },
        {
          name: 'Chest Fly',
          description: 'Isolation exercise for chest muscles.',
          animationUrl: 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
          difficulty: 'Beginner' as const,
          equipment: ['Dumbbells'],
          muscleGroups: ['Chest']
        }
      ]
    },
    {
      name: 'Back',
      image: 'https://via.placeholder.com/80x80/3b82f6/ffffff?text=🏋️‍♂️',
      color: '#3b82f6',
      icon: '🏋️‍♂️',
      exercises: [
        {
          name: 'Pull Ups',
          description: 'Upper body pulling movement.',
          animationUrl: 'https://via.placeholder.com/120x120/3b82f6/ffffff?text=🏋️‍♂️',
          difficulty: 'Advanced' as const,
          equipment: ['Pull-up Bar'],
          muscleGroups: ['Back', 'Biceps']
        },
        {
          name: 'Deadlifts',
          description: 'Full body compound exercise.',
          animationUrl: 'https://via.placeholder.com/120x120/3b82f6/ffffff?text=🏋️‍♂️',
          difficulty: 'Advanced' as const,
          equipment: ['Barbell'],
          muscleGroups: ['Back', 'Legs', 'Core']
        },
        {
          name: 'Seated Row',
          description: 'Machine-based back exercise.',
          animationUrl: 'https://via.placeholder.com/120x120/3b82f6/ffffff?text=🏋️‍♂️',
          difficulty: 'Beginner' as const,
          equipment: ['Cable Machine'],
          muscleGroups: ['Back', 'Biceps']
        }
      ]
    },
    {
      name: 'Legs',
      image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=🦵',
      color: '#10b981',
      icon: '🦵',
      exercises: [
        {
          name: 'Squats',
          description: 'Fundamental lower body movement.',
          animationUrl: 'https://via.placeholder.com/120x120/10b981/ffffff?text=🦵',
          difficulty: 'Beginner',
          equipment: ['Bodyweight'],
          muscleGroups: ['Quadriceps', 'Glutes', 'Core']
        },
        {
          name: 'Lunges',
          description: 'Unilateral leg exercise.',
          animationUrl: 'https://via.placeholder.com/120x120/10b981/ffffff?text=🦵',
          difficulty: 'Beginner' as const,
          equipment: ['Bodyweight'],
          muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings']
        },
        {
          name: 'Leg Press',
          description: 'Machine-based leg exercise.',
          animationUrl: 'https://via.placeholder.com/120x120/10b981/ffffff?text=🦵',
          difficulty: 'Intermediate' as const,
          equipment: ['Leg Press Machine'],
          muscleGroups: ['Quadriceps', 'Glutes']
        }
      ]
    },
    {
      name: 'Shoulders',
      image: 'https://via.placeholder.com/80x80/f59e0b/ffffff?text=🏐',
      color: '#f59e0b',
      icon: '🏐',
      exercises: [
        {
          name: 'Shoulder Press',
          description: 'Overhead pressing movement.',
          animationUrl: 'https://via.placeholder.com/120x120/f59e0b/ffffff?text=🏐',
          difficulty: 'Intermediate' as const,
          equipment: ['Dumbbells'],
          muscleGroups: ['Shoulders', 'Triceps']
        },
        {
          name: 'Lateral Raise',
          description: 'Isolation for lateral deltoids.',
          animationUrl: 'https://via.placeholder.com/120x120/f59e0b/ffffff?text=🏐',
          difficulty: 'Beginner' as const,
          equipment: ['Dumbbells'],
          muscleGroups: ['Shoulders']
        },
        {
          name: 'Front Raise',
          description: 'Isolation for anterior deltoids.',
          animationUrl: 'https://via.placeholder.com/120x120/f59e0b/ffffff?text=🏐',
          difficulty: 'Beginner' as const,
          equipment: ['Dumbbells'],
          muscleGroups: ['Shoulders']
        }
      ]
    },
    {
      name: 'Arms',
      image: 'https://via.placeholder.com/80x80/a21caf/ffffff?text=💪',
      color: '#a21caf',
      icon: '💪',
      exercises: [
        {
          name: 'Bicep Curl',
          description: 'Classic bicep isolation.',
          animationUrl: 'https://via.placeholder.com/120x120/a21caf/ffffff?text=💪',
          difficulty: 'Beginner' as const,
          equipment: ['Dumbbells'],
          muscleGroups: ['Biceps']
        },
        {
          name: 'Triceps Dip',
          description: 'Bodyweight tricep exercise.',
          animationUrl: 'https://via.placeholder.com/120x120/a21caf/ffffff?text=💪',
          difficulty: 'Intermediate' as const,
          equipment: ['Dip Bars'],
          muscleGroups: ['Triceps', 'Chest']
        },
        {
          name: 'Hammer Curl',
          description: 'Neutral grip curl variation.',
          animationUrl: 'https://via.placeholder.com/120x120/a21caf/ffffff?text=💪',
          difficulty: 'Beginner' as const,
          equipment: ['Dumbbells'],
          muscleGroups: ['Biceps', 'Forearms']
        }
      ]
    },
    {
      name: 'Core',
      image: 'https://via.placeholder.com/80x80/f43f5e/ffffff?text=🧘',
      color: '#f43f5e',
      icon: '🧘',
      exercises: [
        {
          name: 'Plank',
          description: 'Core stability exercise.',
          animationUrl: 'https://via.placeholder.com/120x120/f43f5e/ffffff?text=🧘',
          difficulty: 'Beginner' as const,
          equipment: ['Bodyweight'],
          muscleGroups: ['Core']
        },
        {
          name: 'Crunches',
          description: 'Abdominal isolation exercise.',
          animationUrl: 'https://via.placeholder.com/120x120/f43f5e/ffffff?text=🧘',
          difficulty: 'Beginner' as const,
          equipment: ['Bodyweight'],
          muscleGroups: ['Core']
        },
        {
          name: 'Russian Twist',
          description: 'Rotational core exercise.',
          animationUrl: 'https://via.placeholder.com/120x120/f43f5e/ffffff?text=🧘',
          difficulty: 'Intermediate' as const,
          equipment: ['Bodyweight'],
          muscleGroups: ['Core', 'Obliques']
        }
      ]
    },
    {
      name: 'Cardio',
      image: 'https://via.placeholder.com/80x80/0ea5e9/ffffff?text=🏃',
      color: '#0ea5e9',
      icon: '🏃',
      exercises: [
        {
          name: 'Running',
          description: 'High-intensity cardiovascular exercise.',
          animationUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
          difficulty: 'Beginner' as const,
          equipment: ['None'],
          muscleGroups: ['Cardiovascular']
        },
        {
          name: 'Jump Rope',
          description: 'High-intensity cardio with coordination.',
          animationUrl: 'https://via.placeholder.com/120x120/0ea5e9/ffffff?text=🏃',
          difficulty: 'Beginner' as const,
          equipment: ['Jump Rope'],
          muscleGroups: ['Cardiovascular', 'Calves']
        },
        {
          name: 'Cycling',
          description: 'Low-impact cardiovascular exercise.',
          animationUrl: 'https://via.placeholder.com/120x120/0ea5e9/ffffff?text=🏃',
          difficulty: 'Beginner' as const,
          equipment: ['Bicycle'],
          muscleGroups: ['Cardiovascular', 'Legs']
        }
      ]
    }
  ];

  selectCategory(category: Category) {
    console.log('Category selected:', category.name);
    this.selectedCategory = category;
  }

  goBack() {
    console.log('Going back to categories');
    this.selectedCategory = null;
  }

  toggleCategory(categoryName: string) {
    // Keep this method for backward compatibility if needed
    const category = this.categories.find(cat => cat.name === categoryName);
    if (category) {
      this.selectCategory(category);
    }
  }

  openExerciseModal(exercise: Exercise) {
    console.log('Opening exercise modal:', exercise.name);
    this.selectedExercise = exercise;
    this.showModal = true;
  }

  closeModal() {
    console.log('Closing modal');
    this.showModal = false;
    this.selectedExercise = null;
  }

  getDifficultyClass(difficulty: 'Beginner' | 'Intermediate' | 'Advanced'): string {
    return difficulty.toLowerCase();
  }

  getCategoryColor(categoryName: string): string {
    const category = this.categories.find(cat => cat.name === categoryName);
    return category?.color || '#ef4444';
  }

  getExerciseEmoji(exerciseName: string): string {
    const emojiMap: { [key: string]: string } = {
      'Push Ups': '💪',
      'Bench Press': '🏋️‍♂️',
      'Chest Fly': '💪',
      'Pull Ups': '🏋️‍♂️',
      'Deadlifts': '🏋️‍♂️',
      'Seated Row': '🏋️‍♂️',
      'Squats': '🦵',
      'Lunges': '🦵',
      'Leg Press': '🦵',
      'Shoulder Press': '🏐',
      'Lateral Raise': '🏐',
      'Front Raise': '🏐',
      'Bicep Curl': '💪',
      'Triceps Dip': '💪',
      'Hammer Curl': '💪',
      'Plank': '🧘',
      'Crunches': '🧘',
      'Russian Twist': '🧘',
      'Running': '🏃',
      'Jump Rope': '🏃',
      'Cycling': '🏃'
    };
    return emojiMap[exerciseName] || '💪';
  }

  getExerciseGif(exerciseName: string): string {
    // Using reliable workout form GIFs from a different source
    const gifMap: { [key: string]: string } = {
      'Push Ups': 'https://cdn.kibrispdr.org/data/1793/push-up-animasi-3.gif',
      'Bench Press': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Chest Fly': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Pull Ups': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Deadlifts': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Seated Row': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Squats': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Lunges': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Leg Press': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Shoulder Press': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Lateral Raise': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Front Raise': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Bicep Curl': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Triceps Dip': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Hammer Curl': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Plank': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Crunches': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Russian Twist': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Running': 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
      'Jump Rope': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif',
      'Cycling': 'https://media.giphy.com/media/3o7TKDEqX6VJWuOe6c/giphy.gif'
    };
    return gifMap[exerciseName] || '';
  }

  getSelectedCategoryName(): string {
    if (!this.selectedExercise) return '';
    for (const category of this.categories) {
      if (category.exercises.some(ex => ex.name === this.selectedExercise?.name)) {
        return category.name;
      }
    }
    return '';
  }

  getExerciseFormInstructions(exerciseName: string): string[] {
    const formMap: { [key: string]: string[] } = {
      'Push Ups': [
        '1. Start in a plank position with hands shoulder-width apart',
        '2. Lower your body until chest nearly touches the floor',
        '3. Keep your core tight and body in a straight line',
        '4. Push back up to the starting position'
      ],
      'Bench Press': [
        '1. Lie on bench with feet flat on the ground',
        '2. Grip barbell slightly wider than shoulder-width',
        '3. Lower bar to chest with controlled movement',
        '4. Press bar back up to starting position'
      ],
      'Squats': [
        '1. Stand with feet shoulder-width apart',
        '2. Lower your body as if sitting back into a chair',
        '3. Keep knees behind toes and chest up',
        '4. Return to standing position'
      ],
      'Pull Ups': [
        '1. Hang from pull-up bar with hands shoulder-width apart',
        '2. Pull your body up until chin is over the bar',
        '3. Lower your body back down with control',
        '4. Repeat for desired number of reps'
      ]
    };
    return formMap[exerciseName] || [
      '1. Follow proper form for this exercise',
      '2. Maintain controlled movements',
      '3. Focus on the target muscle group',
      '4. Breathe steadily throughout the movement'
    ];
  }

  hasGifAnimation(exerciseName: string): boolean {
    const gifExercises = [
      'Push Ups', 'Bench Press', 'Chest Fly', 'Pull Ups', 'Deadlifts', 'Seated Row',
      'Squats', 'Lunges', 'Leg Press', 'Shoulder Press', 'Lateral Raise', 'Front Raise',
      'Bicep Curl', 'Triceps Dip', 'Hammer Curl', 'Plank', 'Crunches', 'Russian Twist',
      'Running', 'Jump Rope', 'Cycling'
    ];
    return gifExercises.includes(exerciseName);
  }
}
