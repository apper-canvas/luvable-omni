import mockAchievements from '../mockData/achievements.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class AchievementService {
  constructor() {
    this.achievements = [...mockAchievements];
  }

  async getAll() {
    await delay(300);
    return [...this.achievements].sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt));
  }

  async getById(id) {
    await delay(200);
    const achievement = this.achievements.find(a => a.Id === parseInt(id, 10));
    if (!achievement) {
      throw new Error('Achievement not found');
    }
    return { ...achievement };
  }

  async create(achievementData) {
    await delay(300);
    const maxId = Math.max(...this.achievements.map(a => a.Id), 0);
    const newAchievement = {
      Id: maxId + 1,
      type: achievementData.type,
      earnedAt: new Date().toISOString(),
      message: achievementData.message
    };
    
    this.achievements.push(newAchievement);
    return { ...newAchievement };
  }

  async getRecent(limit = 5) {
    await delay(200);
    return [...this.achievements]
      .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
      .slice(0, limit)
      .map(achievement => ({ ...achievement }));
  }

  async checkAndAwardAchievements(completedTasksCount, streakDays) {
    await delay(200);
    const newAchievements = [];

    // Task completion milestones
    const taskMilestones = [1, 5, 10, 25, 50, 100];
    for (const milestone of taskMilestones) {
      if (completedTasksCount === milestone) {
        const existing = this.achievements.find(a => 
          a.type === 'tasks_completed' && a.message.includes(milestone.toString())
        );
        if (!existing) {
          const achievement = await this.create({
            type: 'tasks_completed',
            message: `Completed ${milestone} tasks! You're on fire! 🔥`
          });
          newAchievements.push(achievement);
        }
      }
    }

    // Streak milestones
    const streakMilestones = [3, 7, 14, 30];
    for (const milestone of streakMilestones) {
      if (streakDays === milestone) {
        const existing = this.achievements.find(a => 
          a.type === 'streak' && a.message.includes(milestone.toString())
        );
        if (!existing) {
          const achievement = await this.create({
            type: 'streak',
            message: `${milestone} day streak! You're unstoppable! ⭐`
          });
          newAchievements.push(achievement);
        }
      }
    }

    return newAchievements;
  }
}

export default new AchievementService();