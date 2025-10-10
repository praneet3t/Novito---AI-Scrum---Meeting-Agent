const API_BASE = 'http://localhost:8000';

export const api = {
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  async processMeeting(data: any) {
    const res = await fetch(`${API_BASE}/meetings/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getReviewQueue(workspaceId: number) {
    const res = await fetch(`${API_BASE}/tasks/review?workspace_id=${workspaceId}`);
    return res.json();
  },

  async approveTask(taskId: number) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/approve`, {
      method: 'PATCH'
    });
    return res.json();
  },

  async getTasks(workspaceId: number, status?: string) {
    const url = status 
      ? `${API_BASE}/tasks/?workspace_id=${workspaceId}&status=${status}`
      : `${API_BASE}/tasks/?workspace_id=${workspaceId}`;
    const res = await fetch(url);
    return res.json();
  },

  async getTask(taskId: number) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`);
    return res.json();
  },

  async updateTask(taskId: number, data: any) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async captureTask(workspaceId: number, text: string) {
    const res = await fetch(`${API_BASE}/tasks/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspace_id: workspaceId, text })
    });
    return res.json();
  },

  async getSprints(workspaceId: number) {
    const res = await fetch(`${API_BASE}/sprints/?workspace_id=${workspaceId}`);
    return res.json();
  },

  async getBriefing(workspaceId: number, days: number = 7) {
    const res = await fetch(`${API_BASE}/analytics/briefing?workspace_id=${workspaceId}&days=${days}`);
    return res.json();
  },

  async getBurndown(sprintId: number) {
    const res = await fetch(`${API_BASE}/analytics/burndown/${sprintId}`);
    return res.json();
  },

  async getVelocity(workspaceId: number) {
    const res = await fetch(`${API_BASE}/analytics/velocity?workspace_id=${workspaceId}`);
    return res.json();
  },

  async getDistribution(workspaceId: number) {
    const res = await fetch(`${API_BASE}/analytics/distribution?workspace_id=${workspaceId}`);
    return res.json();
  },

  async runSuggestions(workspaceId: number) {
    const res = await fetch(`${API_BASE}/agent/run-suggestions?workspace_id=${workspaceId}`, {
      method: 'POST'
    });
    return res.json();
  },

  async chatWithNova(message: string, context: string = '') {
    const res = await fetch(`${API_BASE}/agent/chat?message=${encodeURIComponent(message)}&context=${encodeURIComponent(context)}`, {
      method: 'POST'
    });
    return res.json();
  },

  async undoAction(auditId: number) {
    const res = await fetch(`${API_BASE}/agent/audits/${auditId}/undo`, {
      method: 'POST'
    });
    return res.json();
  },

  async runDemoSeed() {
    const res = await fetch(`${API_BASE}/seed/run-demo`, {
      method: 'POST'
    });
    return res.json();
  }
};
