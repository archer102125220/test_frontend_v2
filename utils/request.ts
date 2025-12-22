import axios from 'axios'
const baseURL = import.meta.env.VITE_BASE_API || ''

export const request = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})
