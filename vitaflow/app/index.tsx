import { Redirect } from 'expo-router';
import { useUserStore } from '../stores/userStore';

export default function Index() {
  const { isAuthenticated, hasCompletedOnboarding } = useUserStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/onboard" />;
  }
  if (!hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboard" />;
  }
  return <Redirect href="/(tabs)/home" />;
}
