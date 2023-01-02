import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository', { timestamp: true });
  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    //send one parameters
    if (status) {
      query.where('task.status = :status', { status }).andWhere({ user });
    }

    //send parameters search and not send status
    if (search && !status) {
      query
        .where(
          '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
          { search: `%${search}%` },
        )
        .andWhere({ user });
    }

    //send parameters search and status
    if (search && status) {
      query
        .where('task.status = :status', { status })
        .andWhere(
          new Brackets((qb) => {
            qb.where('(LOWER(task.title) LIKE LOWER(:status))', {
              search: `%${search}%`,
            }).orWhere('(LOWER(task.description) LIKE LOWER(:search))', {
              search: `%${search}%`,
            });
          }),
        )
        .andWhere({ user });
    }

    try {
      const task = await query.getMany();
      return task;
    } catch (error) {
      // exception when query return empty
      throw new NotFoundException(`Not found Tasks with your search.`);
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const newTask = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(newTask);
    return newTask;
  }
}
