import { toast } from 'react-toastify';

class AchievementService {
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
          { field: { "Name": "type" } },
          { field: { "Name": "earned_at" } },
          { field: { "Name": "message" } }
        ],
        orderBy: [
          {
            fieldName: "earned_at",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI format
      return response.data.map(achievement => ({
        Id: achievement.Id,
        Name: achievement.Name || '',
        type: achievement.type || '',
        earnedAt: achievement.earned_at,
        message: achievement.message || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching achievements:", error?.response?.data?.message);
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
          { field: { "Name": "type" } },
          { field: { "Name": "earned_at" } },
          { field: { "Name": "message" } }
        ]
      };

      const response = await this.apperClient.getRecordById('achievement', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data) {
        return null;
      }

      const achievement = response.data;
      return {
        Id: achievement.Id,
        Name: achievement.Name || '',
        type: achievement.type || '',
        earnedAt: achievement.earned_at,
        message: achievement.message || ''
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching achievement with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async create(achievementData) {
    try {
      const params = {
        records: [
          {
            Name: achievementData.message || '',
            type: achievementData.type || '',
            earned_at: new Date().toISOString(),
            message: achievementData.message || ''
          }
        ]
      };

      const response = await this.apperClient.createRecord('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} achievements:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          const achievement = successfulRecords[0].data;
          return {
            Id: achievement.Id,
            Name: achievement.Name || '',
            type: achievement.type || '',
            earnedAt: achievement.earned_at,
            message: achievement.message || ''
          };
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating achievement:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  async getRecent(limit = 5) {
    try {
      const params = {
        fields: [
          { field: { "Name": "Name" } },
          { field: { "Name": "Tags" } },
          { field: { "Name": "Owner" } },
          { field: { "Name": "type" } },
          { field: { "Name": "earned_at" } },
          { field: { "Name": "message" } }
        ],
        orderBy: [
          {
            fieldName: "earned_at",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords('achievement', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(achievement => ({
        Id: achievement.Id,
        Name: achievement.Name || '',
        type: achievement.type || '',
        earnedAt: achievement.earned_at,
        message: achievement.message || ''
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent achievements:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async checkAndAwardAchievements(completedTasksCount, streakDays) {
    const newAchievements = [];

    try {
      // Get existing achievements to avoid duplicates
      const existingAchievements = await this.getAll();

      // Task completion milestones
      const taskMilestones = [1, 5, 10, 25, 50, 100];
      for (const milestone of taskMilestones) {
        if (completedTasksCount === milestone) {
          const existing = existingAchievements.find(a => 
            a.type === 'tasks_completed' && a.message.includes(milestone.toString())
          );
          if (!existing) {
            const achievement = await this.create({
              type: 'tasks_completed',
              message: `Completed ${milestone} tasks! You're on fire! 🔥`
            });
            if (achievement) {
              newAchievements.push(achievement);
            }
          }
        }
      }

      // Streak milestones
      const streakMilestones = [3, 7, 14, 30];
      for (const milestone of streakMilestones) {
        if (streakDays === milestone) {
          const existing = existingAchievements.find(a => 
            a.type === 'streak' && a.message.includes(milestone.toString())
          );
          if (!existing) {
            const achievement = await this.create({
              type: 'streak',
              message: `${milestone} day streak! You're unstoppable! ⭐`
            });
            if (achievement) {
              newAchievements.push(achievement);
            }
          }
        }
      }

      return newAchievements;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error checking achievements:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
}

export default new AchievementService();