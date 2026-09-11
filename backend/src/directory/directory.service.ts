import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const defaultTeams = [
  'TEAM ANCHOR',
  'TEAM ALPHA',
  'TITAN LITIGATION',
  'MARITIME PRACTICE GROUP',
  'CORPORATE DISPUTE TEAM',
];

const defaultCourts = [
  'HIGH COURT BENIN CITY',
  'HIGH COURT OKADA',
  'HIGH COURT EKIADOLOR',
  'EKIADOLOR MAGISTRATE COURT',
  'FEDERAL HIGH COURT',
  'HIGH COURT',
  'MAGISTRATE COURT OGBESON',
  'MAGISTRATE COURT OREDO',
  'MAGISTRATE COURT EGOR',
  'HIGH COURT WARRI',
  'HIGH COURT ABUDU',
  'FEDERAL HIGH COURT BENIN',
  'HIGH COURT BENIN',
  'APPEAL COURT BENIN CITY',
  'NATIONAL INDUSTRIAL COURT BENIN CITY',
  'AREA CUSTOMARY COURT EHOR',
  'CUSTOMARY COURT URHONIGBE',
  'HIGH COURT EHOR',
];

@Injectable()
export class DirectoryService implements OnModuleInit {
  private filePath = path.join(process.cwd(), 'data', 'directory.json');
  private courts: string[] = [];
  private teams: string[] = [];

  onModuleInit() {
    this.loadData();
  }

  private loadData() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.courts = Array.isArray(parsed.courts) ? parsed.courts : [...defaultCourts];
        this.teams = Array.isArray(parsed.teams) ? parsed.teams : [...defaultTeams];
      } else {
        this.courts = [...defaultCourts];
        this.teams = [...defaultTeams];
        this.saveData();
      }
    } catch (e) {
      console.warn('[DirectoryService] Failed to load directory.json, using defaults:', e);
      this.courts = [...defaultCourts];
      this.teams = [...defaultTeams];
    }
  }

  private saveData() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(
        this.filePath,
        JSON.stringify({ courts: this.courts, teams: this.teams }, null, 2),
        'utf-8',
      );
    } catch (e) {
      console.error('[DirectoryService] Failed to save directory data:', e);
    }
  }

  getCourts(): string[] {
    return [...this.courts];
  }

  addCourt(name: string): string[] {
    const clean = name.trim().toUpperCase();
    if (clean && !this.courts.includes(clean)) {
      this.courts.push(clean);
      this.saveData();
    }
    return this.getCourts();
  }

  removeCourt(name: string): string[] {
    const clean = name.trim().toUpperCase();
    this.courts = this.courts.filter((c) => c.toUpperCase() !== clean);
    this.saveData();
    return this.getCourts();
  }

  getTeams(): string[] {
    return [...this.teams];
  }

  addTeam(name: string): string[] {
    const clean = name.trim().toUpperCase();
    if (clean && !this.teams.includes(clean)) {
      this.teams.push(clean);
      this.saveData();
    }
    return this.getTeams();
  }

  removeTeam(name: string): string[] {
    const clean = name.trim().toUpperCase();
    this.teams = this.teams.filter((t) => t.toUpperCase() !== clean);
    this.saveData();
    return this.getTeams();
  }
}
