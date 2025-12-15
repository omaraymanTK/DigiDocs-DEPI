import { createFileRoute } from '@tanstack/react-router'
import Examination from '@/pages/Examination'
import axios from 'axios'
import type { PatientProfile } from '@/types'

export const Route = createFileRoute('/examination/$patientId')({
  loader: async ({ params }) => {
    const { patientId } = params
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/Patient/${patientId}`)
    return {
      patient: response.data as PatientProfile,
      examinationId: Number(response.data.examinationId) || 0
    }
  },

  component: Examination,
})