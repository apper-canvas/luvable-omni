import { toast } from 'react-toastify';

class ProjectService {
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
          { field: { "Name": "color" } },
          { field: { "Name": "icon" } },
          { field: { "Name": "task_count" } },
          { field: { "Name": "completed_count" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format
      return response.data.map(project => ({
        Id: project.Id,
        Name: project.Name || '',
        name: project.Name || '',
        color: project.color || '#FF6B6B',
        icon: project.icon || 'Folder',
        taskCount: project.task_count || 0,
        completedCount: project.completed_count || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching projects:", error?.response?.data?.message);
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
          { field: { "Name": "color" } },
          { field: { "Name": "icon" } },
          { field: { "Name": "task_count" } },
          { field: { "Name": "completed_count" } }
        ]
      };

      const response = await this.apperClient.getRecordById('project', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const project = response.data;
      return {
        Id: project.Id,
        Name: project.Name || '',
        name: project.Name || '',
        color: project.color || '#FF6B6B',
        icon: project.icon || 'Folder',
        taskCount: project.task_count || 0,
        completedCount: project.completed_count || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching project with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(projectData) {
    try {
      const params = {
        records: [
          {
            Name: projectData.name || projectData.Name || '',
            color: projectData.color || '#FF6B6B',
            icon: projectData.icon || 'Folder',
            task_count: 0,
            completed_count: 0
          }
        ]
      };

      const response = await this.apperClient.createRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} projects:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const project = successfulRecords[0].data;
          toast.success('Project created successfully! 🎉');
          return {
            Id: project.Id,
            Name: project.Name || '',
            name: project.Name || '',
            color: project.color || '#FF6B6B',
            icon: project.icon || 'Folder',
            taskCount: project.task_count || 0,
            completedCount: project.completed_count || 0
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating project:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to create project');
      return null;
    }
  }

  async update(id, updates) {
    try {
      // Prepare updateable fields only
      const updateData = {};
      if (updates.name !== undefined || updates.Name !== undefined) {
        updateData.Name = updates.name || updates.Name;
      }
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.taskCount !== undefined) updateData.task_count = updates.taskCount;
      if (updates.completedCount !== undefined) updateData.completed_count = updates.completedCount;

      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData
          }
        ]
      };

      const response = await this.apperClient.updateRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} projects:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          const project = successfulUpdates[0].data;
          toast.success('Project updated successfully! ✅');
          return {
            Id: project.Id,
            Name: project.Name || '',
            name: project.Name || '',
            color: project.color || '#FF6B6B',
            icon: project.icon || 'Folder',
            taskCount: project.task_count || 0,
            completedCount: project.completed_count || 0
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating project:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to update project');
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} projects:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulDeletions.length > 0) {
          toast.success('Project deleted successfully! 🗑️');
          return true;
        }
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting project:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to delete project');
      return false;
    }
  }
}

export default new ProjectService();