'use client';

import { AuthComponent } from '@/components/ui/sign-up-21st';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const search = useSearchParams();
  const redirect = search?.get('redirect') || '/dashboard'

  const handleAuthSuccess = () => {
    router.push(redirect);
  };

  return (
    <AuthComponent 
      logo={<CustomLogo />}
      brandName="lunoSpaces"
      backgroundImageUrl="https://images.pexels.com/photos/13582003/pexels-photo-13582003.jpeg"
      onAuthSuccess={handleAuthSuccess}
    />
  );
}
