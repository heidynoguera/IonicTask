import { Component, ViewChild } from '@angular/core';
import { Task } from '../interfaces/task';
import { AlertInput, IonModal } from '@ionic/angular';
import { TaskService } from '../providers/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  isModalOpen = false;
  isAlertOpen = false;
  isOpen: boolean = false;
  editId = undefined;

  task!: Task;

  myTasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ionViewWillEnter() {
    this.taskService.getTask().then(data => {
      this.myTasks = data;
    })
  }

  detailTask() {
    this.isModalOpen = !this.isModalOpen;
  }

  setOpen(value: boolean) {
    this.isOpen = value;
  }

  editTask(id: any) {
    this.editId = id;
    const myTasks = this.taskService.editTask(id)
    console.log(myTasks)
    this.alertInputs = [
      {
        placeholder: 'Titulo',
        id: 'title',
        value: myTasks[0].title
      },
      {
        placeholder: 'Descripcion',
        id: 'description',
        value: myTasks[0].description,
        attributes: {
          maxlength: 140,
        },
      },
    ];
    this.isAlertOpen = !this.isAlertOpen;
  }

  deleteTask(id: any) {
    this.taskService.deleteTask(id).then(resp => {
      this.myTasks = resp;
    }
    );

  }

  public alertButtons = [{
    text: 'Cancelar', handler: () => {
      console.log('Alert canceled');
      this.isAlertOpen = !this.isAlertOpen;

    },
  }, {
    text: 'Guardar', handler: (e: AlertInput[]) => {
      this.isAlertOpen = false;
      this.alertInputs.forEach(e => {
        return e.value = '';
      });
      const newTask = { id: this.editId !== undefined ? this.editId : undefined, title: e[0],description: e[1] }
      this.taskService.saveTask(newTask).then(resp => {
        this.myTasks = resp;
      });
      this.editId = undefined;
    },
  }];

  public alertInputs: AlertInput[] = [
    {
      placeholder: 'Titulo',
      id: 'title',
      value: ''
    },
    {
      placeholder: 'Descripcion',
      id: 'description',
      value: '',
      attributes: {
        maxlength: 140,
      },
    },
  ];

  doneTask(id: any) {
    this.editId = id;
    const myTasks = this.taskService.editTask(id);
    myTasks[0].isDone = !myTasks[0].isDone;
    this.taskService.saveTask(myTasks).then(resp => {
      this.myTasks = resp;
    });
    this.editId = undefined;
  }
}
