import { useState, useEffect } from 'react';
import { fetchRecords } from './dailyRecordService';

export default function useDailyRecords() {
  const [records, setRecords] = useState([]);
  useEffect(() => {
    fetchRecords().then(setRecords).catch(console.error);
  }, []);
  return records;
}