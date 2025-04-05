"use client";

import { useEffect, useState } from "react";
import MenuBar from "@/components/MenuBar";
import apiClient from "@/lib/apiClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicle_type: string;
  vehicle_number: string;
  isAssigned: boolean;
  isActive: boolean;
  orderAmounts: number;
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [newDriver, setNewDriver] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle_type: "",
    vehicle_number: "",
    password: "",
  });

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ status: boolean; message: string; data: Driver[] }>("drivers/");
      const validDrivers = Array.isArray(response.data.data) ? response.data.data.filter(driver => driver) : [];
      setDrivers(validDrivers);
    } catch (err) {
      console.error("Failed to fetch drivers.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDriver((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddDriver = async () => {
    if (!newDriver.name || !newDriver.email || !newDriver.password || !newDriver.phone || !newDriver.vehicle_type || !newDriver.vehicle_number) {
      toast.error("All fields are required!");
      return;
    }
  
    try {
      const response = await apiClient.post("drivers/", newDriver);
      console.log("Response:", response.data);
  
      if (response.data.status) {
        toast.success("Driver added successfully!");

        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to add driver.", error);
      toast.error("Error adding driver!");
    }
  };
  

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white">
        <MenuBar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Drivers</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Driver</Button>
            </DialogTrigger>
            <DialogContent className="p-6">
              {/* ✅ Added DialogTitle for accessibility */}
              <DialogTitle>Add New Driver</DialogTitle>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input name="name" value={newDriver.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input type="email" name="email" value={newDriver.email} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input name="phone" value={newDriver.phone} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Vehicle Type</Label>
                  <Input name="vehicle_type" value={newDriver.vehicle_type} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Vehicle Number</Label>
                  <Input name="vehicle_number" value={newDriver.vehicle_number} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" name="password" value={newDriver.password} onChange={handleInputChange} />
                </div>
                <Button onClick={handleAddDriver} className="w-full mt-4">Save Driver</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <Skeleton className="h-6 w-full mb-4" />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Driver List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers?.length > 0 ? (
                    drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.vehicle_type} - {driver.vehicle_number}</TableCell>
                        <TableCell>
                          <Badge variant={driver.isAssigned ? "default" : "secondary"}>
                            {driver.isAssigned ? "Assigned" : "Unassigned"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={driver.isActive ? "default" : "destructive"}>
                            {driver.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{driver.orderAmounts}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No drivers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
