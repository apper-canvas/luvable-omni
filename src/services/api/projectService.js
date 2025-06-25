import mockProjects from '../mockData/projects.json';
import taskService from './taskService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProjectService {
  constructor() {
    this.projects = [...mockProjects];
  }

  async getAll() {
    await delay(300);
    const projects = [...this.projects];
    
    // Calculate task counts for each project
    const allTasks = await taskService.getAll();
    
    return projects.map(project => {
      const projectTasks = allTasks.filter(task => task.projectId === project.Id);
      const completedTasks = projectTasks.filter(task => task.completed);
      
      return {
        ...project,
        taskCount: projectTasks.length,
        completedCount: completedTasks.length
      };
    });
  }

  async getById(id) {
    await delay(200);
    const project = this.projects.find(p => p.Id === parseInt(id, 10));
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Calculate task counts
    const allTasks = await taskService.getAll();
    const projectTasks = allTasks.filter(task => task.projectId === project.Id);
    const completedTasks = projectTasks.filter(task => task.completed);
    
    return {
      ...project,
      taskCount: projectTasks.length,
      completedCount: completedTasks.length
    };
  }

  async create(projectData) {
    await delay(300);
    const maxId = Math.max(...this.projects.map(p => p.Id), 0);
    const newProject = {
      Id: maxId + 1,
      name: projectData.name,
      color: projectData.color || '#FF6B6B',
      icon: projectData.icon || 'Folder',
      taskCount: 0,
      completedCount: 0
    };
    
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.projects.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Project not found');
    }

    // Prevent Id modification
    const { Id, ...allowedUpdates } = updates;
    
    this.projects[index] = {
      ...this.projects[index],
      ...allowedUpdates
    };
    
    return { ...this.projects[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.projects.findIndex(p => p.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error('Project not found');
    }

    const deletedProject = { ...this.projects[index] };
    this.projects.splice(index, 1);
    return deletedProject;
  }
}

export default new ProjectService();