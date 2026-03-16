"use client";

import React, { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const PencilIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="15"
      height="16"
      viewBox="0 0 15 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.8614 0.727933C12.6307 0.497089 12.3568 0.313982 12.0552 0.189078C11.7537 0.0641742 11.4305 -7.61342e-05 11.1041 6.77029e-08C10.7778 7.62696e-05 10.4546 0.0644775 10.1531 0.189522C9.85167 0.314566 9.57781 0.497802 9.3472 0.728753L1.54665 8.53997C1.08186 9.00583 0.820737 9.63696 0.820505 10.295V12.9231C0.820505 13.2628 1.0962 13.5385 1.43588 13.5385H4.08037C4.73924 13.5385 5.37103 13.2759 5.83626 12.8107L13.6311 5.01097C14.096 4.5449 14.3572 3.91343 14.3572 3.25509C14.3572 2.59674 14.096 1.96528 13.6311 1.49921L12.8614 0.727933ZM0.615379 14.7692C0.45217 14.7692 0.295646 14.8341 0.18024 14.9495C0.0648343 15.0649 0 15.2214 0 15.3846C0 15.5478 0.0648343 15.7044 0.18024 15.8198C0.295646 15.9352 0.45217 16 0.615379 16H13.7435C13.9067 16 14.0632 15.9352 14.1786 15.8198C14.294 15.7044 14.3588 15.5478 14.3588 15.3846C14.3588 15.2214 14.294 15.0649 14.1786 14.9495C14.0632 14.8341 13.9067 14.7692 13.7435 14.7692H0.615379Z"
        fill="#0D6363"
      />
    </svg>
  );
};

export const Profile: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop",
  );
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f9fafb] xl:px-[80px] lg:px-[40px] px-[20px] py-[24px] font-noto-sans overflow-y-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 xl:mb-[20px] mb-[15px] text-[15px] text-[#888888] capitalize">
        <span>My Account</span>
        <span>/</span>
        <span className="font-medium text-[#333333]">My Profile</span>
      </nav>

      <div className="flex flex-col">
        <div className="max-w-[770px] w-full mx-auto flex flex-col flex-1">
          {/* Heading */}
          <h1 className="text-[24px] font-semibold font-noto-sans text-[#333333] xl:pb-[20px] pb-[15px] border-b-[1px] xl:mb-[20px] mb-[15px] capitalize">
            My Profile
          </h1>

          <div className="bg-white rounded-[20px] flex flex-col md:flex-row gap-[24px] items-start xl:p-[32px] lg:p-[25px] p-[20px]">
            {/* Avatar Section */}
            <div className="relative group">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="w-[108px] h-[108px] rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleAvatarClick}
                className="w-[28px] h-[28px] flex items-center justify-center absolute bottom-1 right-2 p-1.5 bg-[#BDD8D9] rounded-full text-[#0D6363] transition-colors cursor-pointer shadow-md"
              >
                <PencilIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Personal Information Form */}
            <div className="flex-1 w-full flex flex-col gap-[24px]">
              {/* Personal Information Card */}
              <div className="bg-white border border-[#EEEEEA] rounded-[16px] p-[20px]">
                <h2 className="font-noto-sans text-[18px] font-semibold text-[#333333] mb-[10px] capitalize">
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <Input
                      type="text"
                      defaultValue="John"
                      className="w-full h-[44px] px-4 rounded-[10px] bg-[#F4F4F4] border-0 text-[#333333] text-[15px] font-medium outline-none ring-0! ring-offset-0!"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Input
                      type="text"
                      defaultValue="Doe"
                      className="w-full h-[44px] px-4 rounded-[10px] bg-[#F4F4F4] border-0 text-[#333333] text-[15px] font-medium outline-none ring-0! ring-offset-0!"
                      placeholder="Last Name"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Input
                    type="email"
                    defaultValue="johndoe@gmail.com"
                    className="w-full h-[44px] px-4 rounded-[10px] bg-[#F4F4F4] border-0 text-[#888888] text-[15px] font-medium outline-none cursor-not-allowed ring-0! ring-offset-0!"
                    readOnly
                  />

                  <Select>
                    <SelectTrigger className="w-full h-[44px] px-4 rounded-[10px] bg-[#F4F4F4] border-0 text-[#333333] text-[15px] font-medium outline-none ring-0! ring-offset-0!">
                      <SelectValue placeholder="Market/Business" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[12px]">
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-full h-[44px] px-4 rounded-[10px] bg-[#F4F4F4] border-0 text-[#333333] text-[15px] font-medium outline-none ring-0! ring-offset-0!">
                      <SelectValue placeholder="Profession" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[12px]">
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="broker">Broker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <button className="w-full mt-6 h-[44px] rounded-[10px] bg-[#0D6363] hover:bg-[#0D6363]/90 text-white font-semibold text-[15px] transition-all cursor-pointer shadow-[0px_4px_10px_0px_#0D636340]">
                  Save
                </button>
              </div>

              {/* Password Card */}
              <div className="bg-white border border-[#EEEEEA] rounded-[16px] p-[20px]">
                <h2 className="font-noto-sans text-[18px] font-semibold text-[#333333] mb-[10px] capitalize">
                  Password
                </h2>
                <div className="flex flex-col gap-4">
                  <div className="relative w-full">
                    <Input
                      type="password"
                      defaultValue="password12345"
                      className="w-full h-[44px] px-4 rounded-[10px] bg-[#F4F4F4] border-0 text-[#333333] text-[15px] font-medium outline-none ring-0! ring-offset-0!"
                      readOnly
                    />
                  </div>
                  <button
                    onClick={() => setIsPasswordDialogOpen(true)}
                    className="text-[#0D6363] text-[15px] font-medium hover:underline w-fit cursor-pointer capitalize"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              {/* Change Password Dialog */}
              <Dialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
              >
                <DialogContent className="max-w-[480px] bg-white p-0 overflow-hidden border-0">
                  <div className="p-[24px]">
                    <div className="mb-5">
                      <DialogTitle className="text-[20px] font-noto-sans font-bold text-[#333333] mb-2">
                        Change Password
                      </DialogTitle>
                      <DialogDescription className="font-noto-sans text-[14px] leading-[140%] text-[#666666]">
                        Enter your email address below and we'll send you a link
                        to reset your password.
                      </DialogDescription>
                    </div>

                    <div className="flex flex-col gap-7">
                      <div className="flex flex-col space-y-2">
                        <label className="font-noto-sans text-[14px] font-medium text-[#333333]">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="w-full h-[44px] px-4 rounded-[10px] bg-[#F4F4F4] border-0 text-[#333333] text-[15px] font-noto-sans font-medium outline-none ring-0! ring-offset-0!"
                        />
                      </div>

                      <button className="w-full h-[44px] rounded-[10px] bg-[#0D6363] hover:bg-[#0D6363]/90 text-white font-noto-sans font-semibold text-[15px] transition-all cursor-pointer shadow-[0px_4px_10px_0px_#0D636340]">
                        Send Link
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Payment Methods Card */}
              <div className="bg-white border border-[#EEEEEA] rounded-[16px] p-[20px] flex items-center justify-between">
                <h2 className="font-noto-sans text-[18px] font-semibold text-[#333333] capitalize">
                  Payment Methods
                </h2>
                <button className="px-6 h-[44px] rounded-[10px] bg-[#0D6363] hover:bg-[#0D6363]/90 text-[#F4F4F4] font-semibold text-[15px] flex items-center gap-2 transition-all cursor-pointer capitalize">
                  Manage <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
