// 'use client';

// import CameraIcon from '@/components/common/icons/CameraIcon';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { useGetUser } from '@/lib/hooks/service/user/useGetUserById';
// import { useUploadImage } from '@/lib/hooks/service/user/useImageUpload';
// import toast, { Toaster } from 'react-hot-toast';

// function ProfileHeader() {
//   const { data: user } = useGetUser();
//   const { mutateAsync: uploadImage, isPending } = useUploadImage({
//     onSuccess: () => {
//       toast.success('image uploaded successfuly');
//     },
//     onError: error => {
//       toast.error('unable to upload image');
//     },
//   });
//   return (
//     <div className="flex w-full flex-col items-center">
//       <Toaster />
//       <span className="text-[#101010] text-[1rem] leading-[1.5rem] font-[600] mt-[1.125rem]">
//         Profile Setting
//       </span>
//       <div className="relative mt-[2.625rem]">
//         <Avatar className="w-[6.25rem] h-[6.25rem]">
//           <AvatarImage src="" alt="@shadcn" className="object-cover" />
//           <AvatarFallback className="text-[2rem]">
//             {user?.name?.slice(0, 2)}
//           </AvatarFallback>
//         </Avatar>
//         <div className="absolute bottom-[2%] right-[1px]">
//           <CameraIcon />
//         </div>
//       </div>
//       <span className="text-[#101010] text-[1rem] leading-[1.5rem] font-[600] mt-[1rem]">
//         {user?.name}
//       </span>
//       <span className="text-[#878787] text-[0.875rem] leading-[1.25rem] font-[400] mt-[4px]">
//         {user?.email}
//       </span>
//     </div>
//   );
// }
// export default ProfileHeader;

'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import CameraIcon from '@/components/common/icons/CameraIcon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetUser } from '@/lib/hooks/service/user/useGetUserById';
import { useUploadImage } from '@/lib/hooks/service/user/useImageUpload';

function ProfileHeader() {
  const { data: user, refetch } = useGetUser();
  const { mutateAsync: uploadImage, isPending } = useUploadImage({
    onSuccess: () => {
      toast.success('Image uploaded successfully');
      refetch(); // Refetch user data to update avatar
    },
    onError: error => {
      toast.error('Failed to upload image');
    },
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    if (isPending) return;
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Clear input value to allow same file selection again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Client-side validation
    // if (!file.type.startsWith('image/')) {
    //   toast.error('Please select an image file');
    //   return;
    // }

    const formData = new FormData();
    formData.append('image', file);
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }
    try {
      await uploadImage({
        image: formData,
      });
    } catch {
      console.log('error');
    }
  };

  return (
    <div className="flex w-full flex-col items-center">
      <Toaster />

      <div className="relative mt-[2.625rem]">
        <Avatar className="w-[6.25rem] h-[6.25rem]">
          <AvatarImage
            src={user?.image} // Update this with your actual image URL field
            alt="Profile photo"
            className="object-cover"
          />
          <AvatarFallback className="text-[2rem]">
            {user?.name?.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div
          className="absolute bottom-[2%] right-[1px] cursor-pointer"
          onClick={handleCameraClick}
        >
          <CameraIcon />
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
          disabled={isPending}
        />
      </div>
      <span className="text-[#101010] text-[1rem] leading-[1.5rem] font-[600] mt-[1rem]">
        {user?.name}
      </span>
      <span className="text-[#878787] text-[0.875rem] leading-[1.25rem] font-[400] mt-[4px]">
        {user?.email}
      </span>
    </div>
  );
}

export default ProfileHeader;
