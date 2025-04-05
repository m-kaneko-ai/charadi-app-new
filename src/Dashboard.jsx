// src/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function Dashboard() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  // Supabaseからデータを取得し、月次集計する関数
  const fetchMonthlyData = async () => {
    try {
      // テーブル名を診断_logsに変更
      const { data, error } = await supabase
        .from('diagnostic_logs')  // 正しいテーブル名に修正
        .select('created_at, shared');
      
      if (error) {
        console.error('データ取得エラー:', error);
        setError(error.message);
        return;
      }
      
      console.log("取得データ:", data); // デバッグ用
      
      // 共有されているレコードのみをフィルタリング
      // sharedフィールドの値に応じて条件を調整
      const sharedLogs = data.filter(log => 
        log.shared && log.shared !== 'EMPTY' && log.shared !== null
      );
      
      console.log("共有レコード:", sharedLogs); // デバッグ用
      
      // 日付を元に月ごとに集計
      const counts = {};
      sharedLogs.forEach((log) => {
        const date = new Date(log.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        counts[monthKey] = (counts[monthKey] || 0) + 1;
      });
      
      // オブジェクトを配列に変換
      const aggregatedData = Object.keys(counts).map((key) => ({
        month: key,
        count: counts[key],
      }));
      
      console.log("集計データ:", aggregatedData); // デバッグ用
      setMonthlyData(aggregatedData);
    } catch (err) {
      console.error("エラー:", err);
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <h2>Shared 件数（月次）</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          エラー: {error}
        </div>
      )}
      
      {monthlyData.length > 0 ? (
        <BarChart width={600} height={300} data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      ) : (
        <p>データがないか、読み込み中です...</p>
      )}
    </div>
  );
}

export default Dashboard;