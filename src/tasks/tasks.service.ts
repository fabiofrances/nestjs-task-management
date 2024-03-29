import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private tasksRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTasksById(id: string, user: User): Promise<Task> {
    const foundID = await this.tasksRepository.findOne({ where: { id, user } });

    if (!foundID) {
      throw new NotFoundException(`Tasks with id "${id}" not found.`);
    }
    return foundID;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const foundTask = await this.tasksRepository.delete({ id, user });

    if (foundTask.affected === 0) {
      throw new NotFoundException(`Tasks with id "${id}" not found.`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTasksById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
