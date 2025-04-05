"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Menubar from "@/components/MenuBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import apiClient from "@/lib/apiClient";

interface Driver {
  id: string;
  name: string;
  isActive: boolean;
}

interface Order {
  id: string;
  status: "pending" | "on-going" | "delivered";
}

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await apiClient.get<{ status: boolean; data: Order[] }>("packages/");
      setOrders(response.data.data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders.");
    }
  };

  // Fetch drivers
  const fetchDrivers = async () => {
    try {
      const response = await apiClient.get<{ status: boolean; data: Driver[] }>("drivers/");
      const activeDrivers = response.data.data.filter((driver) => driver.isActive);
      setDrivers(activeDrivers);
    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError("Failed to load drivers.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchOrders(), fetchDrivers()]);
      setIsLoading(false);
    };

    fetchData();
    const intervalId = setInterval(fetchData, 15000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Menubar />
      <div className="p-5 w-full grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Drivers Overview */}
        <div className="flex justify-center">
          <Card className="shadow-lg rounded-lg w-full max-w-sm">
            <CardContent className="text-center p-6">
              <CardTitle className="text-xl">Active Drivers</CardTitle>
              {isLoading ? (
                <Spinner />
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <CardDescription className="text-3xl">{drivers.length}</CardDescription>
              )}
              <Link href="/drivers">
                <Button className="mt-4 w-full">More Details</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Orders Overview */}
        <div className="flex justify-center">
          <Card className="shadow-lg rounded-lg w-full max-w-sm">
            <CardContent className="text-center p-6">
              <CardTitle className="text-xl">Orders</CardTitle>
              {isLoading ? <Spinner /> : error ? <p className="text-red-500">{error}</p> : <p className="text-3xl">{orders.length}</p>}
              <Link href="/orders">
                <Button className="mt-4 w-full">More Details</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
