import { getOnboardingData, isOnboardingSuccess, getOnboardingErrorMessage } from '../src/client';

// Mock fetch for testing
global.fetch = jest.fn();

describe('Onboarding SDK', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch onboarding data successfully', async () => {
    const mockResponse = {
      success: true,
      data: {
        _id: '68a16fed4fc91007bd28ff9f',
        appId: 'jakir-board',
        screens: [
          {
            id: 'screen1',
            type: 'text',
            content: {
              title: 'Welcome to Our App (jakir)!',
              subtitle: "Let's get you started with a quick setup",
              color: '#333333',
              background: '#ffffff',
              fontSize: 'xl',
              size: 'md'
            },
            actions: [
              {
                type: 'button',
                label: 'Next',
                color: '#ffffff',
                background: '#007AFF',
                target: 'screen2'
              }
            ]
          }
        ],
        createdAt: '2025-08-17T06:00:13.277Z',
        updatedAt: '2025-08-17T06:00:13.277Z',
        __v: 0
      }
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const response = await getOnboardingData('jakir-board');

    expect(isOnboardingSuccess(response)).toBe(true);
    expect(response.data?.appId).toBe('jakir-board');
    expect(response.data?.screens).toHaveLength(1);
    expect(fetch).toHaveBeenCalledWith(
      'http://192.168.0.105:3000/api/onboarding/jakir-board',
      expect.any(Object)
    );
  });

  test('should handle invalid app ID', async () => {
    const response = await getOnboardingData('');

    expect(isOnboardingSuccess(response)).toBe(false);
    expect(response.error?.code).toBe('INVALID_APP_ID');
    expect(response.error?.message).toContain('App ID must be a non-empty string');
  });

  test('should handle network errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new TypeError('fetch failed'));

    const response = await getOnboardingData('test-app');

    expect(isOnboardingSuccess(response)).toBe(false);
    expect(response.error?.code).toBe('NETWORK_ERROR');
    expect(response.error?.message).toContain('Network error');
  });

  test('should handle 404 errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    const response = await getOnboardingData('non-existent-app');

    expect(isOnboardingSuccess(response)).toBe(false);
    expect(response.error?.code).toBe('NOT_FOUND');
    expect(response.error?.message).toContain('Onboarding data not found');
  });

  test('should handle timeout errors', async () => {
    const abortError = new Error('The user aborted a request.');
    abortError.name = 'AbortError';
    (fetch as jest.Mock).mockRejectedValueOnce(abortError);

    const response = await getOnboardingData('test-app', { timeout: 1000 });

    expect(isOnboardingSuccess(response)).toBe(false);
    expect(response.error?.code).toBe('TIMEOUT');
    expect(response.error?.message).toContain('Request timeout');
  });

  test('should handle invalid response format', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false })
    });

    const response = await getOnboardingData('test-app');

    expect(isOnboardingSuccess(response)).toBe(false);
    expect(response.error?.code).toBe('UNKNOWN');
    expect(response.error?.message).toContain('Invalid response format');
  });

  test('should get error message correctly', () => {
    const errorResponse = {
      success: false,
      error: {
        code: 'NOT_FOUND' as const,
        message: 'Onboarding data not found'
      }
    };

    const message = getOnboardingErrorMessage(errorResponse);
    expect(message).toBe('Onboarding data not found');
  });
});

