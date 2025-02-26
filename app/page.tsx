"use client";

import Menubar from "@/components/MenuBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import Spinner from "@/components/Spinner";

interface Receiver {
  id: string;
  name: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
}

interface Sender {
  id: string;
  name: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  status: "pending" | "on-going" | "delivered"; // Ensure status is constrained to these values
  receiver: Receiver;
  sender: Sender;
}

export default function Home() {
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null); // Reset any previous errors
    try {
      const response = await apiClient.get<{ status: boolean; message: string; data: Order[] }>("packages/");

      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        setData(response.data.data);
      } else {
        setData([]); // If no data is returned, ensure it’s empty
      }
    } catch (err) {
      console.log("Error loading data: ", err);
      setError("Failed to load data. Please try again later.");
      setData([]); // Set empty data on error
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate order statuses
  const orderStatusCount = (status: "pending" | "on-going" | "delivered") => {
    return data.filter((order) => order.status === status).length;
  };

  useEffect(() => {
    fetchData();

    // Set interval for refreshing data
    const intervalId = setInterval(fetchData, 15000);

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount
    };
  }, []);

  return (
    <>
      <div className="flex min-h-screen bg-gray-50">
        <div>
          <Menubar />
        </div>
        <div className="p-5 w-full grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* DRIVERS OVERVIEW */}
          <div className="flex justify-center">
            <Card className="shadow-lg rounded-lg w-full max-w-sm">
              <CardContent className="text-center p-6">
                <CardTitle className="text-xl">Active Drivers</CardTitle>
                <CardDescription className="text-3xl">0</CardDescription>
                <Link href="/drivers">
                  <Button className="mt-4 w-full">More Details</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* ORDERS OVERVIEW */}
          <div className="flex justify-center">
            <Card className=" shadow-lg rounded-lg w-full max-w-sm">
              <CardContent className="text-center p-6">
                <CardTitle className="text-xl">Orders</CardTitle>
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <Spinner />
                  </div>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : data.length === 0 ? (
                  <p>No orders available.</p>
                ) : (
                  <p className="text-3xl">{data.length}</p>
                )}
                <Link href="/orders">
                  <Button className="mt-4 w-full">More Details</Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* STATUS OVERVIEW */}
          <div className="flex justify-center">
            <Card className=" shadow-lg rounded-lg w-full max-w-sm">
              <CardContent className="text-center p-6">
                <CardTitle className="text-xl">Order Status</CardTitle>
                <div className="grid grid-cols-1 gap-5 mt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Pending</span>
                    <span>{orderStatusCount("pending")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">On-Going</span>
                    <span>{orderStatusCount("on-going")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Delivered</span>
                    <span>{orderStatusCount("delivered")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
