'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import BlockEditor from '@/components/admin/BlockEditor';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'builder' | 'analytics'>('builder');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}>
        <div style={{ fontSize: '20px', color: '#666' }}>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, marginBottom: '5px' }}>
            Professional Block Builder
          </h1>
          <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
            Build your website with powerful, customizable blocks
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0e0e0';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            style={{
              backgroundColor: '#f0f0f0',
              color: '#333',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              display: 'inline-block',
            }}
          >
            View Website
          </a>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff0000';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ff4444';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(0.95)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
            }}
            style={{
              backgroundColor: '#ff4444',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '0 40px',
        display: 'flex',
        gap: '30px',
      }}>
        <button
          onClick={() => setActiveTab('builder')}
          onMouseEnter={(e) => {
            if (activeTab !== 'builder') {
              e.currentTarget.style.color = '#1a1a1a';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'builder') {
              e.currentTarget.style.color = '#666';
            }
          }}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '15px 0',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            borderBottom: activeTab === 'builder' ? '3px solid #1a1a1a' : '3px solid transparent',
            color: activeTab === 'builder' ? '#1a1a1a' : '#666',
            transition: 'all 0.2s ease',
          }}
        >
          Block Builder
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          onMouseEnter={(e) => {
            if (activeTab !== 'analytics') {
              e.currentTarget.style.color = '#1a1a1a';
            }
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'analytics') {
              e.currentTarget.style.color = '#666';
            }
          }}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '15px 0',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            borderBottom: activeTab === 'analytics' ? '3px solid #1a1a1a' : '3px solid transparent',
            color: activeTab === 'analytics' ? '#1a1a1a' : '#666',
            transition: 'all 0.2s ease',
          }}
        >
          Analytics
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '30px 40px' }}>
        {activeTab === 'builder' ? (
          <BlockEditor />
        ) : (
          <AnalyticsDashboard />
        )}
      </div>
    </div>
  );
}
