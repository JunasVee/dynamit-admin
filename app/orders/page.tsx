"use client"

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import MenuBar from '@/components/MenuBar';

interface Receiver {
    id: string;
    name?: string;
    phone?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface Sender {
    id: string;
    name?: string;
    phone?: string;
    address?: string;
    latitude?: string;
    longitude?: string;
    createdAt?: string;
    updatedAt?: string;
}


interface Order {
    id: string;
    status: string;
    receiver: Receiver;
    sender: Sender;
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pendingUpdates, setPendingUpdates] = useState<Record<string, Partial<Order>>>({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await apiClient.get<{ status: boolean; message: string; data: any[] }>('packages/');
        
                const mappedOrders: Order[] = response.data.data.map((order) => ({
                    id: order.id,
                    status: order.status,
                    receiver: {
                        id: order.id,
                        name: order.receiver_name,
                        phone: order.receiver_phone,
                        address: order.receiver_address,
                        latitude: order.receiver_latitude,
                        longitude: order.receiver_longitude,
                        createdAt: order.createdAt,
                        updatedAt: order.updatedAt,
                    },
                    sender: {
                        id: order.id,
                        name: order.sender_name,
                        phone: order.sender_phone,
                        address: order.sender_address,
                        latitude: order.sender_latitude,
                        longitude: order.sender_longitude,
                        createdAt: order.createdAt,
                        updatedAt: order.updatedAt,
                    },
                }));
        
                setOrders(mappedOrders);
            } catch (err) {
                setError('Failed to fetch orders.' + err);
            } finally {
                setLoading(false);
            }
        };
        

        fetchOrders();
    }, []);

    const handleReceiverSenderChange = (orderId: string, role: 'receiver' | 'sender', field: string, value: string) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId ? {
                    ...order,
                    [role]: {
                        ...order[role],
                        [field]: value,
                    },
                } : order
            )
        );
        setPendingUpdates((prev) => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                [role]: {
                    ...(prev[orderId]?.[role] || {}),
                    [field]: value
                }
            }
        }));
    };

    const handleConfirmUpdate = async (orderId: string) => {
        if (!pendingUpdates[orderId]) return;
        try {
            const updatePayload = pendingUpdates[orderId];
            const existingOrder = orders.find(o => o.id === orderId);
            await apiClient.put(`packages/${orderId}`, {
                receiverName: updatePayload.receiver?.name || existingOrder?.receiver.name,
                receiverAddress: updatePayload.receiver?.address || existingOrder?.receiver.address,
                receiverPhone: updatePayload.receiver?.phone || existingOrder?.receiver.phone,
                receiverLatitude: updatePayload.receiver?.latitude || existingOrder?.receiver.latitude,
                receiverLongitude: updatePayload.receiver?.longitude || existingOrder?.receiver.longitude,
                senderName: updatePayload.sender?.name || existingOrder?.sender.name,
                senderAddress: updatePayload.sender?.address || existingOrder?.sender.address,
                senderPhone: updatePayload.sender?.phone || existingOrder?.sender.phone,
                senderLatitude: updatePayload.sender?.latitude || existingOrder?.sender.latitude,
                senderLongitude: updatePayload.sender?.longitude || existingOrder?.sender.longitude
            });
            setPendingUpdates((prev) => {
                const updated = { ...prev };
                delete updated[orderId];
                return updated;
            });
        } catch (err) {
            setError('Failed to update order.' + err);
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        const orderToDelete = orders.find((order) => order.id === orderId);
        if (!orderToDelete) return;
    
        try {
            await apiClient.delete(`packages/${orderId}`);
    
            setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
        } catch (err) {
            setError('Failed to delete order.' + err);
        }
    };
    

    return (
        <div className="flex h-screen">
            <div className="w-64 bg-gray-900 text-white">
                <MenuBar />
            </div>

            <div className="flex-1 p-6 overflow-auto">
                <h1 className="text-2xl font-bold mb-6">Orders</h1>

                {loading ? (
                    <Skeleton className="h-6 w-full mb-4" />
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Receiver Name</TableHead>
                                <TableHead>Receiver Phone</TableHead>
                                <TableHead>Sender Name</TableHead>
                                <TableHead>Sender Phone</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        <Input
                                            value={order.receiver.name}
                                            onChange={(e) => handleReceiverSenderChange(order.id, 'receiver', 'name', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={order.receiver.phone}
                                            onChange={(e) => handleReceiverSenderChange(order.id, 'receiver', 'phone', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={order.sender.name}
                                            onChange={(e) => handleReceiverSenderChange(order.id, 'sender', 'name', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={order.sender.phone}
                                            onChange={(e) => handleReceiverSenderChange(order.id, 'sender', 'phone', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Button variant="secondary" onClick={() => handleConfirmUpdate(order.id)} disabled={!pendingUpdates[order.id]}>Confirm Update</Button>
                                        <Button variant="destructive" onClick={() => handleDeleteOrder(order.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
