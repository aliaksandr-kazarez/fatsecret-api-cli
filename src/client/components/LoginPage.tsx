import React from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{ 
          marginBottom: '1rem',
          color: '#333',
          fontSize: '2rem'
        }}>
          🍎 Food Tracker
        </h1>
        <p style={{ 
          marginBottom: '2rem',
          color: '#666',
          fontSize: '1.1rem'
        }}>
          Track your daily food intake with FatSecret API
        </p>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '6px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Features:</h3>
          <ul style={{ 
            listStyle: 'none',
            padding: 0,
            margin: 0,
            color: '#555'
          }}>
            <li style={{ marginBottom: '0.5rem' }}>📊 View daily nutrition stats</li>
            <li style={{ marginBottom: '0.5rem' }}>🔍 Search thousands of foods</li>
            <li style={{ marginBottom: '0.5rem' }}>📝 Add foods to your diary</li>
            <li style={{ marginBottom: '0.5rem' }}>🎯 Track your nutrition goals</li>
          </ul>
        </div>
        
        <button
          onClick={onLogin}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 'bold'
          }}
        >
          Login with FatSecret
        </button>
        
        <p style={{ 
          marginTop: '1rem',
          fontSize: '0.9rem',
          color: '#888'
        }}>
          You'll be redirected to FatSecret to authorize this app
        </p>
      </div>
    </div>
  );
};