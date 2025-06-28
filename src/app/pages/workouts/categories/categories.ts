import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss']
})
export class Categories {
  categories = [
    { name: 'Chest', image: 'assets/categories/chest.png' },
    { name: 'Back', image: 'assets/categories/back.png' },
    { name: 'Legs', image: 'assets/categories/legs.png' },
    { name: 'Shoulders', image: 'assets/categories/shoulders.png' },
    { name: 'Arms', image: 'assets/categories/arms.png' },
    { name: 'Core', image: 'assets/categories/core.png' },
    { name: 'Cardio', image: 'assets/categories/cardio.png' }
  ];

  goToCategory(category: any) {
    // Navigate to exercise list filtered by category
    console.log('Selected Category:', category.name);
    // Later: this.router.navigate(['/exercises'], { queryParams: { group: category.name } });
  }
}
