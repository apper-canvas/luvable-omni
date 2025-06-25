import mockTasks from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...mockTasks];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  }

  async getTodaysTasks() {
    await delay(300);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    return this.tasks
      .filter(task => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
        return taskDate === todayStr && !task.completed;
      })
      .map(task => ({ ...task }));
  }

  async getByProject(projectId) {
    await delay(300);
    return this.tasks
      .filter(task => task.projectId === projectId)
      .map(task => ({ ...task }));
  }

  async create(taskData) {
    await delay(300);
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0);
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate || null,
      priority: taskData.priority || 'medium',
      projectId: taskData.projectId || null,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }

    // Prevent Id modification
    const { Id, ...allowedUpdates } = updates;
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...allowedUpdates
    };
    
    return { ...this.tasks[index] };
  }

  async complete(id) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }

    this.tasks[index] = {
      ...this.tasks[index],
      completed: true,
      completedAt: new Date().toISOString()
    };
    
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Task not found');
    }

    const deletedTask = { ...this.tasks[index] };
    this.tasks.splice(index, 1);
    return deletedTask;
  }

  async getCompletedTasks() {
    await delay(300);
    return this.tasks
      .filter(task => task.completed)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .map(task => ({ ...task }));
  }
}

export default new TaskService();