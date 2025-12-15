import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Stethoscope, LogOut, UserPlus, List } from 'lucide-react';
import type { PatientQueueItem } from '@/types';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from '@tanstack/react-router';

interface AssistantDashboardProps {
    userId?: number;
}

export default function AssistantDashboard({ userId }: AssistantDashboardProps) {
    const [activeTab, setActiveTab] = useState<'add' | 'queue'>('add');
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        phone: '',
        address: '',
        occupation: '',
        complaint: '',
        chronicDiseases: '',
        serviceType: '',
        priority: '',
        amountDue: ''
    });
    const [queue, setQueue] = useState<PatientQueueItem[]>([]);
    const router = useRouter();

    // Mappings for API enums
    const priorityMap: Record<string, number> = {
        'عادي': 0,
        'عاجل': 1,
        'طارئ': 2
    };

    const serviceTypeMap: Record<string, number> = {
        'كشف': 0,
        'متابعة': 1,
        'استشارة': 2,
        'فحوصات': 3
    };

    const onLogout = () => {
        localStorage.removeItem('session');
        router.update({ context: { user: null, isLoggedIn: false, session: null } });
        router.navigate({ to: '/login' });
    }

    const fetchPatients = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Patient/GetQueue`);
            setQueue(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
            // toast.error("حدث خطأ أثناء جلب بيانات المرضى"); 
            // Suppressed initial toast error to avoid spam on load if backend is down, or implement better error handling
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            toast.error("User ID not found");
            return;
        }

        try {
            const apiBody = {
                pname: formData.name,
                userId: userId,
                page: parseInt(formData.age) || 0,
                pjob: formData.occupation,
                pgender: formData.gender,
                paddress: formData.address,
                pcomplain: formData.complaint,
                pchronicDisease: formData.chronicDiseases,
                pserviceType: serviceTypeMap[formData.serviceType] ?? 0,
                ppriority: priorityMap[formData.priority] ?? 0,
                pamountToPay: parseFloat(formData.amountDue) || 0,
                pphoneNumber: formData.phone
            };

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Patient/CreatePatient`, apiBody);

            toast.success("تم إضافة المريض بنجاح");

            // Refresh queue
            await fetchPatients();

            // Reset form
            setFormData({
                name: '',
                age: '',
                gender: '',
                phone: '',
                address: '',
                occupation: '',
                complaint: '',
                chronicDiseases: '',
                serviceType: '',
                priority: '',
                amountDue: ''
            });
        } catch (error) {
            console.error("Error creating patient:", error);
            toast.error("حدث خطأ أثناء إضافة المريض");
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const waitingPatients = queue.filter(p => p.status === 0 || p.status === 1);

    // Helpers for display
    const getPriorityLabel = (val: number) => {
        return Object.keys(priorityMap).find(key => priorityMap[key] === val) || 'عادي';
    }

    const getServiceTypeLabel = (val: number) => {
        return Object.keys(serviceTypeMap).find(key => serviceTypeMap[key] === val) || 'كشف';
    }

    return (
        <div dir="rtl" className="min-h-screen bg-gray-50">
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
                        <Button
                            variant="ghost"
                            onClick={onLogout}
                            className="rounded-lg"
                        >
                            <LogOut className="w-5 h-5 ml-2" />
                            تسجيل الخروج
                        </Button>
                    </div>
                </div>
            </header>

            {/* Sidebar Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-3 mb-6">
                    <Button
                        variant={activeTab === 'add' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('add')}
                        className="rounded-lg"
                    >
                        <UserPlus className="w-4 h-4 ml-2" />
                        إضافة مريض جديد
                    </Button>
                    <Button
                        variant={activeTab === 'queue' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('queue')}
                        className="rounded-lg"
                    >
                        <List className="w-4 h-4 ml-2" />
                        قائمة الانتظار
                    </Button>
                </div>

                {/* Add Patient Form */}
                {activeTab === 'add' && (
                    <Card className="p-6 shadow-md">
                        <h2 className="text-gray-900 mb-6">بيانات المريض</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">اسم المريض</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="أدخل اسم المريض"
                                        className="rounded-lg"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="age">العمر</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => handleChange('age', e.target.value)}
                                        placeholder="أدخل العمر"
                                        className="rounded-lg"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">الجنس</Label>
                                    <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                                        <SelectTrigger id="gender" className="rounded-lg">
                                            <SelectValue placeholder="اختر الجنس" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ذكر">ذكر</SelectItem>
                                            <SelectItem value="أنثى">أنثى</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">رقم الهاتف</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        placeholder="أدخل رقم الهاتف"
                                        className="rounded-lg"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">العنوان</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        placeholder="أدخل العنوان"
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="occupation">الوظيفة</Label>
                                    <Input
                                        id="occupation"
                                        value={formData.occupation}
                                        onChange={(e) => handleChange('occupation', e.target.value)}
                                        placeholder="أدخل الوظيفة"
                                        className="rounded-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="serviceType">نوع الخدمة</Label>
                                    <Select value={formData.serviceType} onValueChange={(value) => handleChange('serviceType', value)}>
                                        <SelectTrigger id="serviceType" className="rounded-lg">
                                            <SelectValue placeholder="اختر نوع الخدمة" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="كشف">كشف</SelectItem>
                                            <SelectItem value="متابعة">متابعة</SelectItem>
                                            <SelectItem value="استشارة">استشارة</SelectItem>
                                            <SelectItem value="فحوصات">فحوصات</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">الأولوية</Label>
                                    <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                                        <SelectTrigger id="priority" className="rounded-lg">
                                            <SelectValue placeholder="اختر الأولوية" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="عادي">عادي</SelectItem>
                                            <SelectItem value="عاجل">عاجل</SelectItem>
                                            <SelectItem value="طارئ">طارئ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amountDue">المبلغ المستحق</Label>
                                    <Input
                                        id="amountDue"
                                        type="number"
                                        value={formData.amountDue}
                                        onChange={(e) => handleChange('amountDue', e.target.value)}
                                        placeholder="أدخل المبلغ"
                                        className="rounded-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="complaint">الشكوى الرئيسية</Label>
                                <Textarea
                                    id="complaint"
                                    value={formData.complaint}
                                    onChange={(e) => handleChange('complaint', e.target.value)}
                                    placeholder="أدخل الشكوى الرئيسية"
                                    className="rounded-lg min-h-20"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="chronicDiseases">الأمراض المزمنة</Label>
                                <Textarea
                                    id="chronicDiseases"
                                    value={formData.chronicDiseases}
                                    onChange={(e) => handleChange('chronicDiseases', e.target.value)}
                                    placeholder="أدخل الأمراض المزمنة (إن وجدت)"
                                    className="rounded-lg min-h-20"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-lg bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                            >
                                إضافة المريض إلى قائمة الانتظار
                            </Button>
                        </form>
                    </Card>
                )}

                {/* Queue Section */}
                {activeTab === 'queue' && (
                    <Card className="p-6 shadow-md">
                        <h2 className="text-gray-900 mb-6">قائمة الانتظار</h2>

                        {waitingPatients.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <List className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>لا يوجد مرضى في قائمة الانتظار حالياً</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {waitingPatients.map((item, index) => (
                                    <div
                                        key={item.patientQueueId}
                                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-gray-900">{item.patient.pname}</p>
                                                    <p className="text-gray-500">{item.patient.page} سنة • {item.patient.pgender}</p>
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <p className="text-gray-600">{item.patient.pcomplain}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${item.patient.ppriority === 2 ? 'bg-red-100 text-red-700' :
                                                        item.patient.ppriority === 1 ? 'bg-orange-100 text-orange-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {getPriorityLabel(item.patient.ppriority)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {getServiceTypeLabel(item.patient.pserviceType)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </div>
    );
}
