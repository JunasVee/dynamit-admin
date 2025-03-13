"use client"

import MenuBar from '@/components/MenuBar'
import apiClient from '@/lib/apiClient';
import React, { useEffect, useState } from 'react'

interface Drivers {
    id: string;
    userId: string;
    name?: string;
    phone?: string;
    vehicle_number?: string;
    vehicle_type?: string;
    isAssigned?: boolean;
    isActive?: boolean;
    orderAmounts?: number;
  }

export default function Drivers() {

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const response = await apiClient.get<{ status: boolean; message: string; data: Drivers[] }>("drivers/");
            
            const mappedDrivers: Drivers[] = response.data.data.map((driver) => ({
                id: driver.id,
                userId: driver.userId,
                name: driver.name,
                phone: driver.phone,
                vehicle_number: driver.vehicle_number,
                vehicle_type: driver.vehicle_type,
                isAssigned: driver.isAssigned,
                isActive: driver.isActive,
                orderAmounts: driver.orderAmounts
            }));
    
            setDriversData(mappedDrivers);
          } catch (err: unknown) {
            if (err instanceof Error) {
              console.log("Failed to fetch drivers. " + err.message);
            }
          }
        };
    
        fetchOrders();
      }, []);

    const[driversData, setDriversData] = useState<Drivers[]>([])


  return (
    <div className='flex min-h-screen'>
        <div>
            <MenuBar />
        </div>
        <div>
            {driversData?.map((driver) => (
                <div key={driver.id}>
                    <p>{driver.name}</p>
                </div>
            ))}
        </div>
    </div>
  )
}
