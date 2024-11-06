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
  selectedFile: File | null = null;

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

  //tarea crear item con imagen

  createItemImage(): void {
    const formData = new FormData();
    formData.append('name', this.currentItem.name);
    formData.append('description', this.currentItem.description);
    formData.append('rate', this.currentItem.rate);
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);  // Cambia 'imagePath' por 'image'
    }
  
    if (this.currentItem._id) {
      this.itemService.updateItem(this.currentItem._id, formData).subscribe(() => {
        alert('Elemento actualizado con éxito');
        this.getItems();
        this.currentItem = {};
        this.selectedFile = null;
      });
    } else {
      this.itemService.createItem(formData).subscribe(() => {
        alert('Elemento creado con éxito');
        this.getItems();
        this.currentItem = {};
        this.selectedFile = null;
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

}