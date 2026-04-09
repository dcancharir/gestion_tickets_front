import { Component, signal } from "@angular/core";
import { CommonModule } from '@angular/common';
@Component({
    selector : 'app-ticket-list',
    templateUrl : './ticket-list.html',
      imports: [CommonModule],
})
export class TicketList {
    viewMode = signal<'grid' | 'list'>('grid');

  setView(mode: 'grid' | 'list') {
    this.viewMode.set(mode);
  }
}