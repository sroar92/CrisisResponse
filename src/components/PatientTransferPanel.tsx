// components/PatientTransferPanel.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Activity, 
  AlertCircle, 
  ArrowRight, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Check,
  X
} from 'lucide-react';
import {
  fetchTransferEligiblePatients,
  createTransferRequest,
  fetchTransferRequests,
  PatientData,
  TransferRequest,
  updateTransferStatus,
  deleteTransferRequest,
  deletePatientFromHIS
} from  '@/lib/hospitalSystemAPI';
import { mapHISToInternal, generateTransferSummary } from '@/lib/patientDataMapper';
import { getHospitalData } from '@/lib/hospitalDataStore';

export default function PatientTransferPanel() {
  const [eligiblePatients, setEligiblePatients] = useState<PatientData[]>([]);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [transferForm, setTransferForm] = useState({
    toHospital: '',
    transferType: 'scheduled' as 'emergency' | 'scheduled' | 'urgent',
    bedType: 'general' as 'general' | 'icu' | 'emergency',
    transportMethod: 'ambulance' as 'ambulance' | 'helicopter' | 'patient_transport' | 'family',
    reason: ''
  });
  const [newPatientForm, setNewPatientForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
    bloodType: '',
    allergies: '',
    medications: '',
    medicalConditions: '',
    admissionStatus: 'admitted' as 'outpatient' | 'admitted' | 'emergency' | 'icu',
    transferPriority: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    transferReason: '',
    requiredSpecialty: '',
    sourceHospital: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [patients, transferList] = await Promise.all([
        fetchTransferEligiblePatients(),
        fetchTransferRequests()
      ]);
      setEligiblePatients(patients);
      setTransfers(transferList);
    } catch (error) {
      console.error('Error loading transfer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateTransfer = (patient: PatientData) => {
    setSelectedPatient(patient);
    setShowTransferModal(true);
    setTransferForm({
      toHospital: '',
      transferType: patient.transferPriority === 'critical' ? 'emergency' : 'scheduled',
      bedType: patient.admissionStatus === 'icu' ? 'icu' : 'general',
      transportMethod: 'ambulance',
      reason: patient.transferReason || ''
    });
  };

  const handleSubmitTransfer = async () => {
    if (!selectedPatient || !transferForm.toHospital || !transferForm.reason) {
      window.alert('Please fill in all required fields');
      return;
    }

    try {
      await createTransferRequest({
        patientId: selectedPatient.patientId,
        fromHospital: selectedPatient.sourceHospital,
        toHospital: transferForm.toHospital,
        transferType: transferForm.transferType,
        priority: selectedPatient.transferPriority || 'medium',
        requiredSpecialty: selectedPatient.requiredSpecialty,
        requiredBedType: transferForm.bedType,
        transportMethod: transferForm.transportMethod,
        reason: transferForm.reason,
        requestedBy: 'Current User' // In production, get from auth context
      });

      window.alert('✅ Transfer request submitted successfully!');
      setShowTransferModal(false);
      setSelectedPatient(null);
      loadData();
    } catch (error) {
      console.error('Error creating transfer:', error);
      window.alert('❌ Failed to create transfer request');
    }
  };

  const handleAddPatient = async () => {
    const { addPatientToHIS } = await import('@/lib/hospitalSystemAPI');
    
    if (!newPatientForm.firstName || !newPatientForm.lastName || !newPatientForm.dateOfBirth || !newPatientForm.sourceHospital) {
      window.alert('Please fill in all required fields (Name, DOB, Source Hospital)');
      return;
    }

    try {
      const calculateAge = (dob: string): number => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      };

      const newPatient: PatientData = {
        patientId: `PT-${Date.now()}`,
        mrn: `MRN-2024-${Math.floor(Math.random() * 9000) + 1000}`,
        firstName: newPatientForm.firstName,
        lastName: newPatientForm.lastName,
        dateOfBirth: newPatientForm.dateOfBirth,
        age: calculateAge(newPatientForm.dateOfBirth),
        gender: newPatientForm.gender,
        bloodType: newPatientForm.bloodType || undefined,
        allergies: newPatientForm.allergies ? newPatientForm.allergies.split(',').map(a => a.trim()) : [],
        medications: newPatientForm.medications ? newPatientForm.medications.split(',').map(m => m.trim()) : [],
        medicalConditions: newPatientForm.medicalConditions ? newPatientForm.medicalConditions.split(',').map(c => c.trim()) : [],
        admissionStatus: newPatientForm.admissionStatus,
        transferEligible: true,
        transferPriority: newPatientForm.transferPriority,
        transferReason: newPatientForm.transferReason || undefined,
        requiredSpecialty: newPatientForm.requiredSpecialty || undefined,
        sourceHospital: newPatientForm.sourceHospital,
        lastUpdated: new Date().toISOString()
      };

      await addPatientToHIS(newPatient);
      
      window.alert('✅ Patient added successfully!');
      setShowAddPatientModal(false);
      setNewPatientForm({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        bloodType: '',
        allergies: '',
        medications: '',
        medicalConditions: '',
        admissionStatus: 'admitted',
        transferPriority: 'medium',
        transferReason: '',
        requiredSpecialty: '',
        sourceHospital: ''
      });
      loadData();
    } catch (error) {
      console.error('Error adding patient:', error);
      window.alert('❌ Failed to add patient');
    }
  };

  // NEW: Handle approving a transfer request
  const handleApproveTransfer = async (transferId: string) => {
    if (!window.confirm('Approve this transfer request?')) return;

    try {
      // First, get the transfer details to know which patient and destination
      const transfer = transfers.find(t => t.transferId === transferId);
      if (!transfer) {
        window.alert('❌ Transfer not found');
        return;
      }

      // Update transfer status to approved
      const success = await updateTransferStatus(transferId, 'approved', 'Current User');
      
      if (success) {
        // Update patient's hospital to the destination hospital
        const { updatePatientInHIS } = await import('@/lib/hospitalSystemAPI');
        await updatePatientInHIS(transfer.patientId, {
          sourceHospital: transfer.toHospital
        });
        
        window.alert(`✅ Transfer approved! Patient moved to ${transfer.toHospital}`);
        loadData();
      } else {
        window.alert('❌ Failed to approve transfer');
      }
    } catch (error) {
      console.error('Error approving transfer:', error);
      window.alert('❌ Error approving transfer');
    }
  };

  // NEW: Handle rejecting a transfer request
  const handleRejectTransfer = async (transferId: string) => {
    if (!window.confirm('Reject this transfer request?')) return;

    try {
      const success = await updateTransferStatus(transferId, 'rejected', 'Current User');
      if (success) {
        window.alert('❌ Transfer request rejected');
        loadData();
      } else {
        window.alert('❌ Failed to reject transfer');
      }
    } catch (error) {
      console.error('Error rejecting transfer:', error);
      window.alert('❌ Error rejecting transfer');
    }
  };

  // NEW: Handle deleting a transfer request
  const handleDeleteTransfer = async (transferId: string) => {
    if (!window.confirm('Are you sure you want to delete this transfer request? This cannot be undone.')) {
      return;
    }

    try {
      const success = await deleteTransferRequest(transferId);
      if (success) {
        window.alert('✅ Transfer request deleted');
        loadData();
      } else {
        window.alert('❌ Failed to delete transfer');
      }
    } catch (error) {
      console.error('Error deleting transfer:', error);
      window.alert('❌ Error deleting transfer');
    }
  };

  // NEW: Handle deleting a patient
  const handleDeletePatient = async (patientId: string, patientName: string) => {
    if (!window.confirm(`Are you sure you want to delete patient ${patientName}? This will permanently remove all their records. This action cannot be undone.`)) {
      return;
    }

    try {
      const success = await deletePatientFromHIS(patientId);
      if (success) {
        window.alert('✅ Patient deleted successfully');
        loadData();
      } else {
        window.alert('❌ Failed to delete patient');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
      window.alert('❌ Error deleting patient');
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-900/30 border-red-500';
      case 'high': return 'text-orange-400 bg-orange-900/30 border-orange-500';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
      default: return 'text-blue-400 bg-blue-900/30 border-blue-500';
    }
  };

  const getStatusIcon = (status: TransferRequest['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'in_transit': return <Activity className="w-5 h-5 text-blue-400" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default: return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-slate-400">Loading patient data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Patient Transfers
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage patient transfers between hospitals
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Add Patient
          </button>
          <button
            onClick={loadData}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Eligible Patients</p>
          <p className="text-3xl font-bold text-white mt-1">{eligiblePatients.length}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Pending Transfers</p>
          <p className="text-3xl font-bold text-yellow-400 mt-1">
            {transfers.filter(t => t.status === 'pending').length}
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">In Transit</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">
            {transfers.filter(t => t.status === 'in_transit').length}
          </p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm">Completed Today</p>
          <p className="text-3xl font-bold text-green-400 mt-1">
            {transfers.filter(t => t.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Eligible Patients */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Transfer-Eligible Patients
        </h3>

        {eligiblePatients.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No transfer-eligible patients at this time</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {eligiblePatients.map((patient) => {
              const internal = mapHISToInternal(patient);
              
              return (
                <div
                  key={patient.patientId}
                  className={`border-l-4 rounded-lg p-4 bg-slate-700 ${getPriorityColor(patient.transferPriority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">
                          {internal.demographics.name.full}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(patient.transferPriority)}`}>
                          {patient.transferPriority?.toUpperCase() || 'MEDIUM'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-2">
                        <div>
                          <span className="text-slate-400">MRN:</span>
                          <p className="text-white font-medium">{patient.mrn}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Age/Gender:</span>
                          <p className="text-white font-medium">
                            {patient.age}y {patient.gender.charAt(0).toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400">Status:</span>
                          <p className="text-white font-medium capitalize">{patient.admissionStatus}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Room:</span>
                          <p className="text-white font-medium">{patient.assignedRoom || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Current Hospital */}
                      <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 mb-2">
                        <span className="text-slate-400 text-xs">Currently At:</span>
                        <p className="text-emerald-400 font-semibold text-sm">🏥 {patient.sourceHospital}</p>
                      </div>

                      <div className="mt-3 space-y-1 text-sm">
                        <div>
                          <span className="text-slate-400">Reason:</span>
                          <p className="text-white">{patient.transferReason}</p>
                        </div>
                        {patient.requiredSpecialty && (
                          <div>
                            <span className="text-slate-400">Required Specialty:</span>
                            <p className="text-blue-300">{patient.requiredSpecialty}</p>
                          </div>
                        )}
                        {patient.allergies.length > 0 && (
                          <div>
                            <span className="text-red-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Allergies:
                            </span>
                            <p className="text-red-300">{patient.allergies.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => handleInitiateTransfer(patient)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Initiate Transfer
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient.patientId, `${patient.firstName} ${patient.lastName}`)}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Patient
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Transfers */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transfer Requests</h3>

        {transfers.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No transfer requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transfers.slice(0, 10).map((transfer) => (
              <div
                key={transfer.transferId}
                className="bg-slate-700 border border-slate-600 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(transfer.status)}
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {transfer.fromHospital} → {transfer.toHospital}
                      </p>
                      <p className="text-sm text-slate-400">
                        Patient ID: {transfer.patientId} | {transfer.transferType.toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Requested: {new Date(transfer.requestedAt).toLocaleString()}
                      </p>
                      {transfer.approvedBy && (
                        <p className="text-xs text-slate-500">
                          {transfer.status === 'approved' ? 'Approved' : 'Rejected'} by: {transfer.approvedBy}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-2 py-1 rounded ${
                      transfer.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                      transfer.status === 'approved' ? 'bg-blue-900/30 text-blue-400' :
                      transfer.status === 'rejected' ? 'bg-red-900/30 text-red-400' :
                      'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {transfer.status.toUpperCase()}
                    </span>

                    {/* Action buttons for pending transfers */}
                    {transfer.status === 'pending' && (
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => handleApproveTransfer(transfer.transferId)}
                          className="bg-green-600 hover:bg-green-500 text-white p-2 rounded transition-colors"
                          title="Approve Transfer"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRejectTransfer(transfer.transferId)}
                          className="bg-red-600 hover:bg-red-500 text-white p-2 rounded transition-colors"
                          title="Reject Transfer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Delete button for all transfers */}
                    <button
                      onClick={() => handleDeleteTransfer(transfer.transferId)}
                      className="bg-slate-600 hover:bg-slate-500 text-white p-2 rounded transition-colors ml-1"
                      title="Delete Transfer Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transfer Modal */}
      {showTransferModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Initiate Patient Transfer
              </h3>

              {/* Patient Summary */}
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                  {generateTransferSummary(mapHISToInternal(selectedPatient))}
                </pre>
              </div>

              {/* Transfer Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Destination Hospital *
                  </label>
                  <select
                    value={transferForm.toHospital}
                    onChange={(e) => setTransferForm({...transferForm, toHospital: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="">Select Hospital</option>
                    {getHospitalData().map(h => (
                      <option key={h.id} value={h.name}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Transfer Type
                    </label>
                    <select
                      value={transferForm.transferType}
                      onChange={(e) => setTransferForm({...transferForm, transferType: e.target.value as any})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="urgent">Urgent</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Required Bed Type
                    </label>
                    <select
                      value={transferForm.bedType}
                      onChange={(e) => setTransferForm({...transferForm, bedType: e.target.value as any})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="general">General</option>
                      <option value="icu">ICU</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Transport Method
                  </label>
                  <select
                    value={transferForm.transportMethod}
                    onChange={(e) => setTransferForm({...transferForm, transportMethod: e.target.value as any})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="ambulance">Ambulance</option>
                    <option value="helicopter">Helicopter</option>
                    <option value="patient_transport">Patient Transport</option>
                    <option value="family">Family Transport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Transfer Reason *
                  </label>
                  <textarea
                    value={transferForm.reason}
                    onChange={(e) => setTransferForm({...transferForm, reason: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    rows={3}
                    placeholder="Enter reason for transfer..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSubmitTransfer}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Submit Transfer Request
                </button>
                <button
                  onClick={() => {
                    setShowTransferModal(false);
                    setSelectedPatient(null);
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Add New Patient
              </h3>

              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={newPatientForm.firstName}
                      onChange={(e) => setNewPatientForm({...newPatientForm, firstName: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={newPatientForm.lastName}
                      onChange={(e) => setNewPatientForm({...newPatientForm, lastName: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={newPatientForm.dateOfBirth}
                      onChange={(e) => setNewPatientForm({...newPatientForm, dateOfBirth: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Gender
                    </label>
                    <select
                      value={newPatientForm.gender}
                      onChange={(e) => setNewPatientForm({...newPatientForm, gender: e.target.value as any})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Blood Type
                    </label>
                    <select
                      value={newPatientForm.bloodType}
                      onChange={(e) => setNewPatientForm({...newPatientForm, bloodType: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="">Select...</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                {/* Medical Info */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Allergies (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newPatientForm.allergies}
                    onChange={(e) => setNewPatientForm({...newPatientForm, allergies: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="Penicillin, Latex, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Current Medications (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newPatientForm.medications}
                    onChange={(e) => setNewPatientForm({...newPatientForm, medications: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="Lisinopril 10mg, Metformin 500mg, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Medical Conditions (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newPatientForm.medicalConditions}
                    onChange={(e) => setNewPatientForm({...newPatientForm, medicalConditions: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="Hypertension, Diabetes, etc."
                  />
                </div>

                {/* Admission Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Admission Status
                    </label>
                    <select
                      value={newPatientForm.admissionStatus}
                      onChange={(e) => setNewPatientForm({...newPatientForm, admissionStatus: e.target.value as any})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="outpatient">Outpatient</option>
                      <option value="admitted">Admitted</option>
                      <option value="emergency">Emergency</option>
                      <option value="icu">ICU</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Source Hospital *
                    </label>
                    <select
                      value={newPatientForm.sourceHospital}
                      onChange={(e) => setNewPatientForm({...newPatientForm, sourceHospital: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="">Select Hospital</option>
                      {getHospitalData().map(h => (
                        <option key={h.id} value={h.name}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Transfer Info */}
                <div className="border-t border-slate-600 pt-4 mt-4">
                  <h4 className="text-lg font-semibold text-white mb-3">Transfer Information</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Transfer Priority
                      </label>
                      <select
                        value={newPatientForm.transferPriority}
                        onChange={(e) => setNewPatientForm({...newPatientForm, transferPriority: e.target.value as any})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Required Specialty
                      </label>
                      <input
                        type="text"
                        value={newPatientForm.requiredSpecialty}
                        onChange={(e) => setNewPatientForm({...newPatientForm, requiredSpecialty: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        placeholder="Cardiology, Neurosurgery, etc."
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Transfer Reason
                    </label>
                    <textarea
                      value={newPatientForm.transferReason}
                      onChange={(e) => setNewPatientForm({...newPatientForm, transferReason: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      rows={2}
                      placeholder="Reason for potential transfer..."
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddPatient}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add Patient
                </button>
                <button
                  onClick={() => {
                    setShowAddPatientModal(false);
                    setNewPatientForm({
                      firstName: '',
                      lastName: '',
                      dateOfBirth: '',
                      gender: 'male',
                      bloodType: '',
                      allergies: '',
                      medications: '',
                      medicalConditions: '',
                      admissionStatus: 'admitted',
                      transferPriority: 'medium',
                      transferReason: '',
                      requiredSpecialty: '',
                      sourceHospital: ''
                    });
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
