export function useUserDataFromClerk() {
  // Dummy user data for testing
  return {
    userData: {
      user: {
        _id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
    },
    isLoading: false,
    isError: false,
  };
} 