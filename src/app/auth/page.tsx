'use client';

import { AuthComponent } from '@/components/ui/sign-up-21st';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const CustomLogo = () => (
  <div className="flex items-center justify-center">
    <Image 
      src="/images/fovvydotted.png" 
      alt="lunoSpaces" 
      width={32} 
      height={32}
      className="rounded-md"
    />
  </div>
);

export default function AuthPage() {
  const router = useRouter();

  const handleAuthSuccess = () => {
    // Redirect to dashboard after successful auth
    router.push('/dashboard');
  };

  return (
    <AuthComponent 
      logo={<CustomLogo />}
      brandName="lunoSpaces"
      onAuthSuccess={handleAuthSuccess}
    />
  );
}
