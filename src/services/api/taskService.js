import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    // Initialize ApperClient for database operations
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "title" } },
          { field: { "Name": "description" } },
          { field: { "Name": "due_date" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "project_id" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "created_at" } },
          { field: { "Name": "completed_at" } }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format
      return response.data.map(task => ({
        Id: task.Id,
        Name: task.Name || task.title || '',
        title: task.title || task.Name || '',
        description: task.description || '',
        dueDate: task.due_date,
        priority: task.priority || 'medium',
        projectId: parseInt(task.project_id) || null,
        completed: task.completed || false,
        createdAt: task.created_at,
        completedAt: task.completed_at
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "title" } },
          { field: { "Name": "description" } },
          { field: { "Name": "due_date" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "project_id" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "created_at" } },
          { field: { "Name": "completed_at" } }
        ]
      };

      const response = await this.apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const task = response.data;
      return {
        Id: task.Id,
        Name: task.Name || task.title || '',
        title: task.title || task.Name || '',
        description: task.description || '',
        dueDate: task.due_date,
        priority: task.priority || 'medium',
        projectId: parseInt(task.project_id) || null,
        completed: task.completed || false,
        createdAt: task.created_at,
        completedAt: task.completed_at
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getTodaysTasks() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "title" } },
          { field: { "Name": "description" } },
          { field: { "Name": "due_date" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "project_id" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "created_at" } },
          { field: { "Name": "completed_at" } }
        ],
        where: [
          {
            FieldName: "due_date",
            Operator: "ExactMatch",
            SubOperator: "Day",
            Values: [today.split('-').reverse().join(' ')],
            Include: true
          }
        ],
        orderBy: [
          {
            fieldName: "completed",
            sorttype: "ASC"
          },
          {
            fieldName: "priority",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        Name: task.Name || task.title || '',
        title: task.title || task.Name || '',
        description: task.description || '',
        dueDate: task.due_date,
        priority: task.priority || 'medium',
        projectId: parseInt(task.project_id) || null,
        completed: task.completed || false,
        createdAt: task.created_at,
        completedAt: task.completed_at
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching today's tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getByProject(projectId) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "title" } },
          { field: { "Name": "description" } },
          { field: { "Name": "due_date" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "project_id" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "created_at" } },
          { field: { "Name": "completed_at" } }
        ],
        where: [
          {
            FieldName: "project_id",
            Operator: "EqualTo",
            Values: [parseInt(projectId)],
            Include: true
          }
        ],
        orderBy: [
          {
            fieldName: "completed",
            sorttype: "ASC"
          },
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        Name: task.Name || task.title || '',
        title: task.title || task.Name || '',
        description: task.description || '',
        dueDate: task.due_date,
        priority: task.priority || 'medium',
        projectId: parseInt(task.project_id) || null,
        completed: task.completed || false,
        createdAt: task.created_at,
        completedAt: task.completed_at
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching project tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [
          {
            Name: taskData.title || taskData.Name || '',
            title: taskData.title || taskData.Name || '',
            description: taskData.description || '',
            due_date: taskData.dueDate || null,
            priority: taskData.priority || 'medium',
            project_id: taskData.projectId ? parseInt(taskData.projectId) : null,
            completed: false,
            created_at: new Date().toISOString(),
            completed_at: null
          }
        ]
      };

      const response = await this.apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          toast.success('Task created successfully! 🎉');
          return {
            Id: task.Id,
            Name: task.Name || task.title || '',
            title: task.title || task.Name || '',
            description: task.description || '',
            dueDate: task.due_date,
            priority: task.priority || 'medium',
            projectId: parseInt(task.project_id) || null,
            completed: task.completed || false,
            createdAt: task.created_at,
            completedAt: task.completed_at
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to create task');
      return null;
    }
  }

  async update(id, updates) {
    try {
      // Prepare updateable fields only
      const updateData = {};
      if (updates.title !== undefined || updates.Name !== undefined) {
        updateData.Name = updates.title || updates.Name;
        updateData.title = updates.title || updates.Name;
      }
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.projectId !== undefined) updateData.project_id = updates.projectId ? parseInt(updates.projectId) : null;
      if (updates.completed !== undefined) {
        updateData.completed = updates.completed;
        if (updates.completed) {
          updateData.completed_at = new Date().toISOString();
        } else {
          updateData.completed_at = null;
        }
      }

      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData
          }
        ]
      };

      const response = await this.apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          toast.success('Task updated successfully! ✅');
          return {
            Id: task.Id,
            Name: task.Name || task.title || '',
            title: task.title || task.Name || '',
            description: task.description || '',
            dueDate: task.due_date,
            priority: task.priority || 'medium',
            projectId: parseInt(task.project_id) || null,
            completed: task.completed || false,
            createdAt: task.created_at,
            completedAt: task.completed_at
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to update task');
      return null;
    }
  }

  async complete(id) {
    return this.update(id, { completed: true });
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} tasks:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('Task deleted successfully! 🗑️');
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to delete task');
      return false;
    }
  }

  async getCompletedTasks() {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "title" } },
          { field: { "Name": "description" } },
          { field: { "Name": "due_date" } },
          { field: { "Name": "priority" } },
          { field: { "Name": "project_id" } },
          { field: { "Name": "completed" } },
          { field: { "Name": "created_at" } },
          { field: { "Name": "completed_at" } }
        ],
        where: [
          {
            FieldName: "completed",
            Operator: "EqualTo",
            Values: [true],
            Include: true
          }
        ],
        orderBy: [
          {
            fieldName: "completed_at",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        Name: task.Name || task.title || '',
        title: task.title || task.Name || '',
        description: task.description || '',
        dueDate: task.due_date,
        priority: task.priority || 'medium',
        projectId: parseInt(task.project_id) || null,
        completed: task.completed || false,
        createdAt: task.created_at,
        completedAt: task.completed_at
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching completed tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  // Template Management (kept as static data for now)
  async getTemplates() {
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
    const templates = await this.getTemplates();
    const template = templates.find(t => t.Id === parseInt(id, 10));
    if (!template) {
      throw new Error('Template not found');
    }
    return { ...template };
  }

  async createTemplate(templateData) {
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
    const template = await this.getTemplateById(id);
    const { Id, ...allowedUpdates } = updates;
    const updatedTemplate = {
      ...template,
      ...allowedUpdates
    };
    return { ...updatedTemplate };
  }

  async deleteTemplate(id) {
    const template = await this.getTemplateById(id);
    return { ...template };
  }
}

export default new TaskService();

export default new TaskService();