import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stethoscope, ArrowLeft, Save, Printer, Plus, X, Edit2, Trash2, Settings, ChevronDownIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate, useSearch, useRouteContext, useParams } from '@tanstack/react-router';
import { Route } from '@/routes/examination/$patientId'
import axios from 'axios';
import { toast } from 'sonner';

interface Medication {
    id: string;
    name: string;
    dosage: string;
    duration: string;
    frequency: string;
    isEditing: boolean;
}

interface Symptom {
    id: string;
    text: string;
    category: string;
    isEditing: boolean;
}

interface SymptomCategory {
    name: string;
    symptoms: string[];
}

export default function DoctorExamination() {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSymptom, setSelectedSymptom] = useState('');
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const navigate = useNavigate();
    const search = useSearch({ from: '/examination/$patientId' });
    const { user } = useRouteContext({ from: '/examination/$patientId' });
    const { patientId } = useParams({ from: '/examination/$patientId' });
    const { patient, examinationId } = Route.useLoaderData();

    // Symptom categories with their symptoms
    const [symptomCategories, setSymptomCategories] = useState<SymptomCategory[]>([
        {
            name: 'Hearing Symptoms',
            symptoms: ['Hearing Loss', 'Tinnitus', 'Ear Fullness', 'Hyperacusis']
        },
        {
            name: 'Balance & Dizziness',
            symptoms: ['Vertigo', 'Dizziness', 'Balance Issues', 'Unsteadiness', 'Nausea/Vomiting']
        },
        {
            name: 'Ear Pain & Discharge',
            symptoms: ['Ear Pain', 'Ear Discharge', 'Ear Itching', 'Ear Pressure']
        },
        {
            name: 'Neurological',
            symptoms: ['Facial Weakness', 'Headache', 'Vision Changes', 'Numbness']
        }
    ]);

    const [newSymptomInput, setNewSymptomInput] = useState('');
    const [showSymptomManager, setShowSymptomManager] = useState(false);
    const [newCategoryInput, setNewCategoryInput] = useState('');
    const [managingCategoryIndex, setManagingCategoryIndex] = useState<number | null>(null);

    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [availableMedicines, setAvailableMedicines] = useState([
        'Betahistine',
        'Meclizine',
        'Dimenhydrinate',
        'Prochlorperazine',
        'Ciprofloxacin',
        'Amoxicillin',
        'Prednisolone',
        'Diazepam',
        'Ondansetron',
        'Cinnarizine'
    ]);
    const [newMedicineInput, setNewMedicineInput] = useState('');
    const [showMedicineManager, setShowMedicineManager] = useState(false);

    const [diagnosis, setDiagnosis] = useState('');
    const [investigations, setInvestigations] = useState('');
    const [nextAppointment, setNextAppointment] = useState<Date | undefined>(undefined);
    const [medications, setMedications] = useState<Medication[]>([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Category management
    const handleAddCategory = () => {
        if (newCategoryInput.trim() && !symptomCategories.find(c => c.name === newCategoryInput.trim())) {
            setSymptomCategories([...symptomCategories, { name: newCategoryInput.trim(), symptoms: [] }]);
            setNewCategoryInput('');
        }
    };

    const handleRemoveCategory = (index: number) => {
        const categoryName = symptomCategories[index].name;
        setSymptomCategories(symptomCategories.filter((_, i) => i !== index));
        // Remove symptoms from selected symptoms that belonged to this category
        setSymptoms(symptoms.filter(s => s.category !== categoryName));
    };

    // Symptom list management within category
    const handleAddSymptomToCategory = (categoryIndex: number) => {
        if (newSymptomInput.trim()) {
            const category = symptomCategories[categoryIndex];
            if (!category.symptoms.includes(newSymptomInput.trim())) {
                const updatedCategories = [...symptomCategories];
                updatedCategories[categoryIndex] = {
                    ...category,
                    symptoms: [...category.symptoms, newSymptomInput.trim()]
                };
                setSymptomCategories(updatedCategories);
                setNewSymptomInput('');
            }
        }
    };

    const handleRemoveSymptomFromCategory = (categoryIndex: number, symptomToRemove: string) => {
        const category = symptomCategories[categoryIndex];
        const updatedCategories = [...symptomCategories];
        updatedCategories[categoryIndex] = {
            ...category,
            symptoms: category.symptoms.filter(s => s !== symptomToRemove)
        };
        setSymptomCategories(updatedCategories);
        // Also remove from selected symptoms if it was selected
        setSymptoms(symptoms.filter(s => !(s.text === symptomToRemove && s.category === category.name)));
    };

    const onBack = () => {
        navigate({ to: '/patients' });
    };

    // Symptom handlers
    const handleAddSymptom = () => {
        if (selectedSymptom && selectedCategory && !symptoms.find(s => s.text === selectedSymptom)) {
            setSymptoms([
                ...symptoms,
                { id: Date.now().toString(), text: selectedSymptom, category: selectedCategory, isEditing: false }
            ]);
            setSelectedSymptom('');
        }
    };

    const handleEditSymptom = (id: string) => {
        setSymptoms(symptoms.map(symptom =>
            symptom.id === id ? { ...symptom, isEditing: true } : symptom
        ));
    };

    const handleUpdateSymptom = (id: string, newText: string) => {
        setSymptoms(symptoms.map(symptom =>
            symptom.id === id ? { ...symptom, text: newText, isEditing: false } : symptom
        ));
    };

    const handleDeleteSymptom = (id: string) => {
        setSymptoms(symptoms.filter(symptom => symptom.id !== id));
    };

    // Get available symptoms for the selected category that haven't been selected yet
    const getAvailableSymptomsForCategory = () => {
        if (!selectedCategory) return [];
        const category = symptomCategories.find(c => c.name === selectedCategory);
        if (!category) return [];
        return category.symptoms.filter(symptom =>
            !symptoms.find(s => s.text === symptom)
        );
    };

    // Get all available symptoms (for editing existing symptoms)
    const getAllAvailableSymptoms = () => {
        return symptomCategories.flatMap(c => c.symptoms);
    };

    // Medicine list management
    const handleAddMedicineToList = () => {
        if (newMedicineInput.trim() && !availableMedicines.includes(newMedicineInput.trim())) {
            setAvailableMedicines([...availableMedicines, newMedicineInput.trim()]);
            setNewMedicineInput('');
        }
    };

    const handleRemoveMedicineFromList = (medicine: string) => {
        setAvailableMedicines(availableMedicines.filter(m => m !== medicine));
    };

    // Medication handlers
    const handleAddMedicationFromList = () => {
        if (selectedMedicine) {
            setMedications([
                ...medications,
                {
                    id: Date.now().toString(),
                    name: selectedMedicine,
                    dosage: '',
                    duration: '',
                    frequency: '',
                    isEditing: true
                }
            ]);
            setSelectedMedicine('');
        }
    };

    const handleAddCustomMedication = () => {
        setMedications([
            ...medications,
            { id: Date.now().toString(), name: '', dosage: '', duration: '', frequency: '', isEditing: true }
        ]);
    };

    const handleEditMedication = (id: string) => {
        setMedications(medications.map(med =>
            med.id === id ? { ...med, isEditing: true } : med
        ));
    };

    const handleSaveMedication = (id: string) => {
        setMedications(medications.map(med =>
            med.id === id ? { ...med, isEditing: false } : med
        ));
    };

    const handleDeleteMedication = (id: string) => {
        setMedications(medications.filter(med => med.id !== id));
    };

    const handleMedicationChange = (id: string, field: keyof Medication, value: string) => {
        setMedications(medications.map(med =>
            med.id === id ? { ...med, [field]: value } : med
        ));
    };

    const handleSave = async () => {
        const currentPatientId = Number(patientId);

        if (!user?.id) {
            toast.error("Missing examination or user information");
            return;
        }

        try {
            // 1. Save Diagnosis
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Doctor/diagnosis/add`, {
                patientId: currentPatientId,
                examinationId,
                clinicalDiagnosis: diagnosis,
                requiredInvestigations: investigations,
                userId: user.id
            });

            // 2. Schedule Appointment (if date selected)
            let nextAppointmentDateString = null;
            if (nextAppointment) {
                nextAppointmentDateString = nextAppointment.toISOString();
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Doctor/appointment/schedule`, {
                    patientId: currentPatientId,
                    appointmentDate: nextAppointmentDateString,
                    userId: user.id
                });
            }

            // 3. Final Summary Call (Using /Doctor/examination/end as assumed endpoint)
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Doctor/examination/save`, {
                examinationId,
                symptoms: symptoms.map(() => 6), // Sending [0, 0...] as per "symptoms: [0]" request hint
                clinicalDiagnosis: diagnosis,
                requiredInvestigations: investigations,
                medications: medications.map(m => ({
                    medicineId: 1,
                    dosage: m.dosage,
                    frequency: m.frequency,
                    name: m.name
                })),
                nextAppointmentDate: nextAppointmentDateString,
                userId: user.id
            });

            toast.success("Examination saved successfully");
            navigate({ to: '/patients' });

        } catch (error) {
            console.error("Failed to save examination", error);
            toast.error("Failed to save examination details");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost"
                                onClick={onBack}
                                className="rounded-lg">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <Stethoscope className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-gray-900">DigiDocs</h1>
                        </div>
                        <span className="text-gray-600">Patient Examination</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="space-y-6">
                    {/* Patient Info Card */}
                    <Card className="p-6 shadow-md bg-linear-to-r from-blue-50 to-teal-50 border-blue-200">
                        <h2 className="text-gray-900 mb-4">Patient Information</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-gray-500">Name</p>
                                <p className="text-gray-900">{patient.pname}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Age</p>
                                <p className="text-gray-900">{patient.page} years</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Gender</p>
                                <p className="text-gray-900">{patient.pgender}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Phone</p>
                                <p className="text-gray-900">{patient.pphoneNumber}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500">Chief Complaint</p>
                                <p className="text-gray-900">{patient.pcomplain}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500">Chronic Diseases</p>
                                <p className="text-gray-900">{patient.pchronicDisease || 'None'}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Examination Form */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Symptoms */}
                            <Card className="p-6 shadow-md">
                                <h3 className="text-gray-900 mb-4">Symptoms (Neurotology)</h3>

                                {/* Symptom Selector */}
                                <div className="flex gap-2 mb-4">
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="rounded-lg flex-1">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {symptomCategories.map(category => (
                                                <SelectItem key={category.name} value={category.name}>{category.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select value={selectedSymptom} onValueChange={setSelectedSymptom}>
                                        <SelectTrigger className="rounded-lg flex-1">
                                            <SelectValue placeholder="Select a symptom" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getAvailableSymptomsForCategory().map(symptom => (
                                                <SelectItem key={symptom} value={symptom}>{symptom}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={handleAddSymptom}
                                        disabled={!selectedSymptom}
                                        className="rounded-lg bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Symptom
                                    </Button>
                                </div>

                                {/* Symptoms List */}
                                {symptoms.length > 0 ? (
                                    <div className="space-y-2">
                                        <Label>Added Symptoms</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {symptoms.map((symptom) => (
                                                <div
                                                    key={symptom.id}
                                                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-full"
                                                >
                                                    {symptom.isEditing ? (
                                                        <Select
                                                            value={symptom.text}
                                                            onValueChange={(value) => handleUpdateSymptom(symptom.id, value)}
                                                        >
                                                            <SelectTrigger className="h-6 border-0 bg-transparent p-0 min-w-[100px]">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {getAllAvailableSymptoms().map(s => (
                                                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <span className="text-blue-800">{symptom.text}</span>
                                                    )}
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => symptom.isEditing ? handleUpdateSymptom(symptom.id, symptom.text) : handleEditSymptom(symptom.id)}
                                                            className="text-blue-600 hover:text-blue-800 p-1"
                                                        >
                                                            <Edit2 className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSymptom(symptom.id)}
                                                            className="text-red-600 hover:text-red-800 p-1"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <p>No symptoms added yet</p>
                                    </div>
                                )}
                            </Card>

                            {/* Diagnosis */}
                            <Card className="p-6 shadow-md">
                                <h3 className="text-gray-900 mb-4">Diagnosis</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="diagnosis">Clinical Diagnosis</Label>
                                    <Textarea
                                        id="diagnosis"
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                        placeholder="Enter clinical diagnosis and findings..."
                                        className="rounded-lg min-h-32"
                                    />
                                </div>
                            </Card>

                            {/* Investigations */}
                            <Card className="p-6 shadow-md">
                                <h3 className="text-gray-900 mb-4">Investigations</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="investigations">Required Investigations</Label>
                                    <Textarea
                                        id="investigations"
                                        value={investigations}
                                        onChange={(e) => setInvestigations(e.target.value)}
                                        placeholder="E.g., Audiometry, Tympanometry, MRI, CT Scan..."
                                        className="rounded-lg min-h-24"
                                    />
                                </div>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Prescription */}
                            <Card className="p-6 shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-900">Prescription</h3>
                                    <div className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-lg"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add Medication
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Add Medication</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label>Select from list</Label>
                                                        <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                                                            <SelectTrigger className="rounded-lg">
                                                                <SelectValue placeholder="Select a medicine" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {availableMedicines.map(medicine => (
                                                                    <SelectItem key={medicine} value={medicine}>{medicine}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <Button
                                                            onClick={handleAddMedicationFromList}
                                                            disabled={!selectedMedicine}
                                                            className="w-full rounded-lg bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                                                        >
                                                            Add Selected Medicine
                                                        </Button>
                                                    </div>
                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <span className="w-full border-t" />
                                                        </div>
                                                        <div className="relative flex justify-center text-xs uppercase">
                                                            <span className="bg-white px-2 text-gray-500">Or</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Add custom medication</Label>
                                                        <Button
                                                            onClick={handleAddCustomMedication}
                                                            variant="outline"
                                                            className="w-full rounded-lg"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Add Custom Medication
                                                        </Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowMedicineManager(true)}
                                            className="rounded-lg"
                                        >
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {medications.length > 0 ? (
                                    <div className="space-y-3">
                                        {medications.map((medication, index) => (
                                            <div key={medication.id} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                                                {medication.isEditing ? (
                                                    <div className="p-4 space-y-3">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-gray-700">Medication {index + 1}</span>
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleSaveMedication(medication.id)}
                                                                    className="rounded-lg h-8 px-2"
                                                                >
                                                                    <Save className="w-4 h-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteMedication(medication.id)}
                                                                    className="rounded-lg h-8 px-2 text-red-600 hover:text-red-800"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Input
                                                                value={medication.name}
                                                                onChange={(e) => handleMedicationChange(medication.id, 'name', e.target.value)}
                                                                placeholder="Medication name"
                                                                className="rounded-lg"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2">
                                                            <Input
                                                                value={medication.dosage}
                                                                onChange={(e) => handleMedicationChange(medication.id, 'dosage', e.target.value)}
                                                                placeholder="Dosage (e.g., 500mg)"
                                                                className="rounded-lg"
                                                            />
                                                            <Input
                                                                value={medication.frequency}
                                                                onChange={(e) => handleMedicationChange(medication.id, 'frequency', e.target.value)}
                                                                placeholder="Frequency (e.g., 3x daily)"
                                                                className="rounded-lg"
                                                            />
                                                        </div>

                                                        <Input
                                                            value={medication.duration}
                                                            onChange={(e) => handleMedicationChange(medication.id, 'duration', e.target.value)}
                                                            placeholder="Duration (e.g., 7 days)"
                                                            className="rounded-lg"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="p-4">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <p className="text-gray-900">{medication.name || 'Unnamed Medication'}</p>
                                                                <div className="flex flex-wrap gap-2 mt-2">
                                                                    {medication.dosage && (
                                                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                                                            {medication.dosage}
                                                                        </span>
                                                                    )}
                                                                    {medication.frequency && (
                                                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                                                            {medication.frequency}
                                                                        </span>
                                                                    )}
                                                                    {medication.duration && (
                                                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                                                            {medication.duration}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1 ml-2">
                                                                <button
                                                                    onClick={() => handleEditMedication(medication.id)}
                                                                    className="p-1 text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteMedication(medication.id)}
                                                                    className="p-1 text-red-600 hover:text-red-800"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <p>No medications added yet</p>
                                    </div>
                                )}
                            </Card>

                            {/* Next Appointment */}
                            <Card className="p-6 shadow-md">
                                <h3 className="text-gray-900 mb-4">Next Appointment</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="nextAppointment">Appointment Date</Label>
                                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date"
                                                className="w-48 justify-between font-normal"
                                            >
                                                {nextAppointment ? nextAppointment.toLocaleDateString() : "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={nextAppointment}
                                                captionLayout="dropdown"
                                                onSelect={(date) => {
                                                    setNextAppointment(date)
                                                    setIsCalendarOpen(false)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {/* <Input
                                        id="nextAppointment"
                                        type="date"
                                        value={nextAppointment}
                                        onChange={(e) => setNextAppointment(e.target.value)}
                                        className="rounded-lg"
                                    /> */}
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <Card className="p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={onBack}
                                className="rounded-lg"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Queue
                            </Button>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handlePrint}
                                    className="rounded-lg"
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Print Prescription
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="rounded-lg bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Examination
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>


            {/* Medicine Manager Dialog */}
            <Dialog open={showMedicineManager} onOpenChange={setShowMedicineManager}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Manage Medicines</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Input
                                value={newMedicineInput}
                                onChange={(e) => setNewMedicineInput(e.target.value)}
                                placeholder="Add new medicine"
                                className="rounded-lg"
                            />
                            <Button
                                onClick={handleAddMedicineToList}
                                disabled={!newMedicineInput.trim()}
                                className="rounded-lg bg-linear-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Medicine
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label>Available Medicines</Label>
                            <div className="flex flex-wrap gap-2">
                                {availableMedicines.map(medicine => (
                                    <div
                                        key={medicine}
                                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-full"
                                    >
                                        <span className="text-blue-800">{medicine}</span>
                                        <button
                                            onClick={() => handleRemoveMedicineFromList(medicine)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}