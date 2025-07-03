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

  // Template Management
  async getTemplates() {
    await delay(200);
    const templates = [
      {
        Id: 1,
        name: 'Morning Routine',
        title: 'Complete Morning Routine',
        description: 'Wake up, drink water, exercise, meditate, review daily goals',
        priority: 'high',
        projectId: null,
        category: 'daily'
      },
      {
        Id: 2,
        name: 'Weekly Report',
        title: 'Prepare Weekly Status Report',
        description: 'Review completed tasks, identify blockers, plan next week priorities',
        priority: 'medium',
        projectId: null,
        category: 'weekly'
      },
      {
        Id: 3,
        name: 'Monthly Review',
        title: 'Monthly Goal Review',
        description: 'Assess monthly progress, update goals, plan improvements',
        priority: 'medium',
        projectId: null,
        category: 'monthly'
      },
      {
        Id: 4,
        name: 'Daily Standup',
        title: 'Daily Team Standup',
        description: 'Share yesterday progress, today plans, blockers',
        priority: 'high',
        projectId: null,
        category: 'daily'
      }
    ];
    return [...templates];
  }

  async getTemplateById(id) {
    await delay(200);
    const templates = await this.getTemplates();
    const template = templates.find(t => t.Id === parseInt(id, 10));
    if (!template) {
      throw new Error('Template not found');
    }
    return { ...template };
  }

  async createTemplate(templateData) {
    await delay(300);
    // In a real app, this would save to a templates collection
    // For now, we'll just return the template data with an ID
    const templates = await this.getTemplates();
    const maxId = Math.max(...templates.map(t => t.Id), 0);
    const newTemplate = {
      Id: maxId + 1,
      name: templateData.name,
      title: templateData.title,
      description: templateData.description || '',
      priority: templateData.priority || 'medium',
      projectId: templateData.projectId || null,
      category: templateData.category || 'custom'
    };
    return { ...newTemplate };
  }

  async updateTemplate(id, updates) {
    await delay(300);
    // In a real app, this would update the template in storage
    const template = await this.getTemplateById(id);
    const { Id, ...allowedUpdates } = updates;
    const updatedTemplate = {
      ...template,
      ...allowedUpdates
    };
    return { ...updatedTemplate };
  }

  async deleteTemplate(id) {
    await delay(300);
    // In a real app, this would delete from templates collection
    const template = await this.getTemplateById(id);
    return { ...template };
  }
}

export default new TaskService();