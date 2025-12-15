import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, LogOut, GripVertical, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { PatientQueueItem } from '@/types';
import { useNavigate, useRouteContext, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export default function Patients() {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [patients, setPatients] = useState<PatientQueueItem[]>([]);
    const { user } = useRouteContext({ from: "/patients" })

    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Patient/GetQueue`);
                if (response.data) {
                    setPatients(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch patient queue:', error);
            }
        };

        fetchQueue();
    }, []);
    const navigator = useNavigate();
    const router = useRouter();

    const onLogout = async () => {
        localStorage.removeItem('session');
        router.update({ context: { user: null, isLoggedIn: false, session: null } });
        await navigator({ to: "/login", replace: true });
    }


    const waitingPatients = patients.filter(p => p.status === 0 || p.status === 1);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newPatients = [...waitingPatients];
        const draggedPatient = newPatients[draggedIndex];
        newPatients.splice(draggedIndex, 1);
        newPatients.splice(index, 0, draggedPatient);

        // Update the full patients list
        const otherPatients = patients.filter(p => p.status === 2);
        setPatients([...newPatients, ...otherPatients]);
        setDraggedIndex(index);
    };

    const onSelectPatient = async (item: PatientQueueItem) => {
        try {

            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Doctor/examination/start`, { patientId: item.patientId, userId: user?.id });
            if (res.data) {
                toast.success('Patient selected successfully');
                // Assuming res.data contains the examination object or ID. Using optional chaining to be safe.
                const examinationId = res.data.examinationId || res.data.id || res.data;
                await navigator({
                    to: `/examination/${item.patientId}`,
                    search: { examinationId },
                    replace: true
                });
            } else {
                await navigator({ to: `/examination/${item.patient.patientId}`, replace: true });
            }
        }
        catch (error) {
            console.error('Failed to select patient:', error);
            toast.error('Failed to select patient');
        }
    }

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const getStatusBadge = (status: number) => {
        switch (status) {
            case 0:
                return (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        <Clock className="w-3 h-3" />
                        Waiting
                    </span>
                );
            case 1:
                return (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                        <AlertCircle className="w-3 h-3" />
                        In Examination
                    </span>
                );
            case 2:
                return (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3" />
                        Done
                    </span>
                );
            default:
                return null;
        }
    };

    const getPriorityBadge = (priority: number) => {
        const priorityLabel = priority === 2 ? 'Emergency' : priority === 1 ? 'Urgent' : 'Normal';

        return (
            <span className={`text-xs px-2 py-1 rounded-full ${priority === 2 ? 'bg-red-100 text-red-700' :
                priority === 1 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                }`}>
                {priorityLabel}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <Stethoscope className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-gray-900">DigiDocs</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">Patients Queue</span>
                            <Button
                                variant="ghost"
                                onClick={onLogout}
                                className="rounded-lg"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Card className="p-6 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-gray-900">Patient Queue</h2>
                        <div className="flex items-center gap-2">
                            <div className="text-gray-500">
                                {waitingPatients.length} patient{waitingPatients.length !== 1 ? 's' : ''} waiting
                            </div>
                        </div>
                    </div>

                    {waitingPatients.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No patients in queue</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {waitingPatients.map((item, index) => (
                                <div
                                    key={item.patientQueueId}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => navigator({ to: `/examination/${item.patientId}` })}
                                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-move"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <GripVertical className="w-5 h-5 text-gray-400" />
                                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white">
                                                {index + 1}
                                            </div>
                                        </div>

                                        <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                                            <div>
                                                <p className="text-gray-900">{item.patient.pname}</p>
                                                <p className="text-gray-500">{item.patient.page} years • {item.patient.pgender}</p>
                                            </div>

                                            <div>
                                                <p className="text-gray-600">{item.patient.pcomplain}</p>
                                                {item.patient.pchronicDisease && (
                                                    <p className="text-gray-400 mt-1">Chronic: {item.patient.pchronicDisease}</p>
                                                )}
                                            </div>

                                            <div>
                                                {getPriorityBadge(item.patient.ppriority)}
                                            </div>

                                            <div>
                                                {getStatusBadge(item.status)}
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    onClick={() => onSelectPatient(item)}
                                                    disabled={item.status === 1}
                                                    className="rounded-lg bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                                                >
                                                    {item.status === 0 ? "Start Examination" : "In Examination"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Completed Patients */}
                    {patients.filter(p => p.status === 2).length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-gray-700 mb-4">Completed Today</h3>
                            <div className="space-y-2">
                                {patients.filter(p => p.status === 2).map((item) => (
                                    <div
                                        key={item.patientQueueId}
                                        className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            <div>
                                                <p className="text-gray-900">{item.patient.pname}</p>
                                                <p className="text-gray-500">{item.patient.page} years</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(item.status)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800">
                            💡 Tip: Drag and drop patients to reorder the queue based on priority and urgency.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
