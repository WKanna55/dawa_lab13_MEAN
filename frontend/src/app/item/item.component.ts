import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html', 
  styleUrls: ['./item.component.css']
})

export class ItemComponent implements OnInit { 
  items: any[] = [];
  currentItem: any = {};
  searchTerm: string = '';

  constructor(private itemService: ItemService) { }
  
  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems()
      .subscribe((items) => {
        this.items = items;
      });
  }

  getItemById(id: string): void {
    this.itemService.getItemById(id)
      .subscribe((item) => {
        this.currentItem = item;
      });
  }
  
  createItem(item: any): void {
    this.itemService.createItem(item)
      .subscribe(() => {
        alert('Elemento creado con éxito');
        this.getItems();
        this.currentItem = {};
      });
  }

  updateItem(id: string, item: any): void {
    this.itemService.updateItem(id, item)
      .subscribe(() => {
        alert('Elemento actualizado con éxito');
        this.getItems();
        this.currentItem = {};
      });
  }

  deleteItem(id: string): void {
    this.itemService.deleteItem(id)
      .subscribe(() => {
        this.getItems();
      });
  }

  confirmDelete(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      this.deleteItem(id);
    }
  }

  editItem(id: string): void {
    this.getItemById(id);
  }

  get filteredItems() {
    return this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}