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
  // Removed showModal

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
          animationUrl: './assests/animations/PushUps.gif',
          difficulty: 'Beginner' as const,
          equipment: ['Bodyweight'],
          muscleGroups: ['Chest', 'Triceps', 'Shoulders']
        },
        {
          name: 'Bench Press',
          description: 'Compound movement for chest development.',
          animationUrl: './assests/animations/BenchPress.gif',
          difficulty: 'Intermediate' as const,
          equipment: ['Barbell', 'Bench'],
          muscleGroups: ['Chest', 'Triceps', 'Shoulders']
        },
        {
          name: 'Chest Fly',
          description: 'Isolation exercise for chest muscles.',
          animationUrl: './assests/animations/DumbellFly.gif',
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
          animationUrl: './assests/animations/PullUps.gif',
          difficulty: 'Advanced' as const,
          equipment: ['Pull-up Bar'],
          muscleGroups: ['Back', 'Biceps']
        },
        {
          name: 'Deadlifts',
          description: 'Full body compound exercise.',
          animationUrl: './assests/animations/DeadLift.gif',
          difficulty: 'Advanced' as const,
          equipment: ['Barbell'],
          muscleGroups: ['Back', 'Legs', 'Core']
        },
        {
          name: 'Seated Row',
          description: 'Machine-based back exercise.',
          animationUrl: './assests/animations/SeatedRowing.gif',
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
          animationUrl: './assests/animations/Squat.gif',
          difficulty: 'Beginner',
          equipment: ['Bodyweight'],
          muscleGroups: ['Quadriceps', 'Glutes', 'Core']
        },
        {
          name: 'Lunges',
          description: 'Unilateral leg exercise.',
          animationUrl: './assests/animations/Lungegs.gif',
          difficulty: 'Beginner' as const,
          equipment: ['Bodyweight'],
          muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings']
        },
        {
          name: 'Leg Press',
          description: 'Machine-based leg exercise.',
          animationUrl: './assests/animations/LegPress.gif',
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
          animationUrl: 'assests/animations/ShoulderPress.gif',
          difficulty: 'Intermediate' as const,
          equipment: ['Dumbbells'],
          muscleGroups: ['Shoulders', 'Triceps']
        },
        {
          name: 'Lateral Raise',
          description: 'Isolation for lateral deltoids.',
          animationUrl: 'assests/animations/LateralRaises.gif',
          difficulty: 'Beginner' as const,
          equipment: ['Dumbbells'],
          muscleGroups: ['Shoulders']
        },
        {
          name: 'Front Raise',
          description: 'Isolation for anterior deltoids.',
          animationUrl: 'assests/animations/FrontRaises.gif',
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
          animationUrl: 'assests/animations/BicepCurls.gif',
          difficulty: 'Beginner' as const,
          equipment: ['Dumbbells'],
          muscleGroups: ['Biceps']
        },
        {
          name: 'Triceps Dip',
          description: 'Bodyweight tricep exercise.',
          animationUrl: 'assests/animations/TricepDips.gif',
          difficulty: 'Intermediate' as const,
          equipment: ['Dip Bars'],
          muscleGroups: ['Triceps', 'Chest']
        },
        {
          name: 'Hammer Curl',
          description: 'Neutral grip curl variation.',
          animationUrl: 'assests/animations/HammerCurls.gif',
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
          animationUrl: 'assests/animations/Plank.gif',
          difficulty: 'Beginner' as const,
          equipment: ['Bodyweight'],
          muscleGroups: ['Core']
        },
        {
          name: 'Crunches',
          description: 'Abdominal isolation exercise.',
          animationUrl: 'assests/animations/Crunches.gif',
          difficulty: 'Beginner' as const,
          equipment: ['Bodyweight'],
          muscleGroups: ['Core']
        },
        {
          name: 'Russian Twist',
          description: 'Rotational core exercise.',
          animationUrl: 'assests/animations/RussinTwist.gif',
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
          animationUrl: 'assests/animations/Running.gif',
          difficulty: 'Beginner' as const,
          equipment: ['None'],
          muscleGroups: ['Cardiovascular']
        },
        {
          name: 'Jump Rope',
          description: 'High-intensity cardio with coordination.',
          animationUrl: 'assests/animations/JumppingRope.gif',
          difficulty: 'Beginner' as const,
          equipment: ['Jump Rope'],
          muscleGroups: ['Cardiovascular', 'Calves']
        },
        {
          name: 'Cycling',
          description: 'Low-impact cardiovascular exercise.',
          animationUrl: 'assests/animations/Cycling.gif',
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

  openExerciseDetails(exercise: Exercise) {
    this.selectedExercise = exercise;
  }

  closeExerciseModal() {
    this.selectedExercise = null;
  }

  getTotalExercises(): number {
    return this.categories.reduce((total, category) => total + category.exercises.length, 0);
  }

  getTotalMuscleGroups(): number {
    const allMuscles = new Set<string>();
    this.categories.forEach(category => {
      category.exercises.forEach(exercise => {
        exercise.muscleGroups.forEach(muscle => allMuscles.add(muscle));
      });
    });
    return allMuscles.size;
  }

  // Removed openExerciseModal and closeModal

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
    // Using local animation GIFs from public folder
    const gifMap: { [key: string]: string } = {
      'Push Ups': 'animations/PushUps.gif',
      'Bench Press': 'animations/BenchPress.gif',
      'Chest Fly': 'animations/DumbellFly.gif',
      'Pull Ups': 'animations/PullUps.gif',
      'Deadlifts': 'animations/DeadLift.gif',
      'Seated Row': 'animations/SeatedRowing.gif',
      'Squats': 'animations/Squat.gif',
      'Lunges': 'animations/Lungegs.gif',
      'Leg Press': 'animations/LegPress.gif',
      'Shoulder Press': 'animations/ShoulderPress.gif',
      'Lateral Raise': 'animations/LateralRaises.gif',
      'Front Raise': 'animations/FrontRaises.gif',
      'Bicep Curl': 'animations/BicepCurls.gif',
      'Triceps Dip': 'animations/TricepDips.gif',
      'Hammer Curl': 'animations/HammerCurls.gif',
      'Plank': 'animations/Plank.gif',
      'Crunches': 'animations/Crunches.gif',
      'Russian Twist': 'animations/RussinTwist.gif',
      'Running': 'animations/Running.gif',
      'Jump Rope': 'animations/JumppingRope.gif', 
      'Cycling': 'animations/Cycling.gif'
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
        'Start in a plank position with hands shoulder-width apart',
        'Lower your body until chest nearly touches the floor',
        'Keep your core tight and body in a straight line',
        'Push back up to the starting position'
      ],
      'Bench Press': [
        'Lie on bench with feet flat on the ground',
        'Grip barbell slightly wider than shoulder-width',
        'Lower bar to chest with controlled movement',
        'Press bar back up to starting position'
      ],
      'Squats': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Pull Ups': [
        'Hang from pull-up bar with hands shoulder-width apart',
        'Pull your body up until chin is over the bar',
        'Lower your body back down with control',
        'Repeat for desired number of reps'
      ],
      'Deadlifts': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Seated Row': [
        'Sit on a row machine with feet flat on the ground',
        'Grip the handles with hands slightly wider than shoulder-width',
        'Pull the handles towards your chest with controlled movement',
        'Return to starting position'
      ],
      'Lunges': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Leg Press': [
        'Sit on a leg press machine with feet flat on the ground',
        'Grip the handles with hands slightly wider than shoulder-width',
        'Press the handles away from your body with controlled movement',
        'Return to starting position'
        ],
      'Shoulder Press': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Lateral Raise': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Front Raise': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Bicep Curl': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Triceps Dip': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Hammer Curl': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Plank': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Crunches': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Russian Twist': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Running': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Jump Rope': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ],
      'Cycling': [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep knees behind toes and chest up',
        'Return to standing position'
      ]
      };
    return formMap[exerciseName] || [
      'Follow proper form for this exercise',
      'Maintain controlled movements',
      'Focus on the target muscle group',
      'Breathe steadily throughout the movement'
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