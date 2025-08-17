import React from 'react';
import { useOnboarding, getOnboardingData, isOnboardingSuccess } from '../src';

// Basic React component using the hook
export function OnboardingDataFetcher({ appId }: { appId: string }) {
  const { data, loading, error, refetch, isStale } = useOnboarding(appId);

  if (loading) {
    return <div>Loading onboarding data...</div>;
  }

  if (error) {
    return (
      <div>
        <h3>Error loading onboarding data:</h3>
        <p>{error.message}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return <div>No onboarding data available</div>;
  }

  return (
    <div>
      <h2>Onboarding Data for {data.appId}</h2>
      {isStale && <p style={{ color: 'orange' }}>Data may be stale</p>}
      
      <div>
        <h3>Screens ({data.screens.length})</h3>
        {data.screens.map((screen, index) => (
          <div key={screen.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <h4>Screen {index + 1}: {screen.id}</h4>
            <p><strong>Type:</strong> {screen.type}</p>
            <p><strong>Title:</strong> {screen.content.title}</p>
            {screen.content.subtitle && (
              <p><strong>Subtitle:</strong> {screen.content.subtitle}</p>
            )}
            <p><strong>Actions:</strong> {screen.actions.length}</p>
          </div>
        ))}
      </div>
      
      <button onClick={refetch}>Refresh Data</button>
    </div>
  );
}

// Main app component
export function App() {
  const [appId, setAppId] = React.useState('jakir-board');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Onboarding SDK Example</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          App ID: 
          <input 
            value={appId} 
            onChange={(e) => setAppId(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>

      <OnboardingDataFetcher appId={appId} />
    </div>
  );
}
