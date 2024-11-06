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
  // tarea filtro busqueda 
  searchTerm: string = '';

  // tarea imagen en los datos
  selectedFile: File | null = null;

  //tarea ordenar datos por campos
  sortField: string = ''; // Campo actual de ordenación
  sortOrder: 'asc' | 'desc' = 'asc'; // Orden actual ('asc' o 'desc')

  constructor(private itemService: ItemService) { }
  
  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems()
      .subscribe((items) => {
        this.items = items;
        this.sortItems(); // tarea Ordenar la lista cuando se cargue
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

  updateItem(id: string): void {
    const formData = new FormData();
    formData.append('name', this.currentItem.name);
    formData.append('description', this.currentItem.description);
    formData.append('rate', this.currentItem.rate);

    // Solo añadimos la imagen si se ha seleccionado una nueva
    if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    this.itemService.updateItem(id, formData)
        .subscribe(() => {
            alert('Elemento actualizado con éxito');
            this.getItems();
            this.currentItem = {};
            this.selectedFile = null;  // Limpiar el archivo seleccionado
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

  // tarea para filtrar items por busqueda
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

  // tarea ordenar por campos
  setSortField(field: string): void {
    if (this.sortField === field) {
        // Cambiar el orden si se hace clic en el mismo campo
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        // Establecer un nuevo campo de ordenación
        this.sortField = field;
        this.sortOrder = 'asc';
    }
    this.sortItems();
  }

  sortItems(): void {
    this.items.sort((a, b) => {
      const valueA = a[this.sortField];
      const valueB = b[this.sortField];

      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

}