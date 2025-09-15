import { Constituency, DashboardData } from './types';
export type { Constituency, DashboardData };
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const API_URL = publicRuntimeConfig.apiUrl;


export const fetchConstituencies = async (): Promise<Constituency[]> => {
  try {
    const res = await fetch(`${API_URL}/api/v1/constituencies`);
    if (!res.ok) {
      throw new Error(`API call failed with status: ${res.status}`);
    }
    const data: Constituency[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching constituencies:", error);
  
    return [];
  }
};


export const fetchDashboardData = async (constituencyName: string): Promise<DashboardData | null> => {
  try {
   
    const res = await fetch(`${API_URL}/api/v1/dashboard/${encodeURIComponent(constituencyName)}`);
    if (!res.ok) {
      
      if (res.status === 404) return null;
      throw new Error(`API call failed with status: ${res.status}`);
    }
    const data: DashboardData = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching dashboard data for ${constituencyName}:`, error);
   
    return null;
  }
};